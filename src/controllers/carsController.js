import {
  createCar,
  deleteCarById,
  getAllCars,
  getAllCategories,
  getCarById,
  getCarImagesByCarId,
  getPrimaryImageByCarId,
  updateCar
} from "../models/carsModel.js";
import { getCommentsByCarId } from "../models/commentsModel.js";

function normalizeCarForm(body = {}) {
  return {
    category_id: Number(body.category_id),
    title: body.title?.trim() || "",
    make: body.make?.trim() || "",
    model: body.model?.trim() || "",
    year: Number(body.year),
    price: Number(body.price),
    description: body.description?.trim() || "",
    featured: body.featured === "true",
    availability_status: body.availability_status?.trim() || "available",
    image_url: body.image_url?.trim() || "",
    image_alt_text: body.image_alt_text?.trim() || ""
  };
}

function validateCarForm(formData) {
  const errors = [];

  if (!formData.category_id || Number.isNaN(formData.category_id)) {
    errors.push("Please select a valid category.");
  }

  if (!formData.title) {
    errors.push("Title is required.");
  }

  if (!formData.make) {
    errors.push("Make is required.");
  }

  if (!formData.model) {
    errors.push("Model is required.");
  }

  if (!formData.year || Number.isNaN(formData.year)) {
    errors.push("Year is required.");
  }

  if (formData.year < 1886 || formData.year > 2100) {
    errors.push("Please enter a realistic year.");
  }

  if (Number.isNaN(formData.price)) {
    errors.push("Price is required.");
  }

  if (formData.price < 0) {
    errors.push("Price cannot be negative.");
  }

  if (!formData.description) {
    errors.push("Description is required.");
  }

  if (formData.description.length < 15) {
    errors.push("Description should be at least 15 characters long.");
  }

  return errors;
}

export async function buildCarsPage(req, res, next) {
  try {
    const cars = await getAllCars();

    res.render("cars/index", {
      title: "Browse Vintage Cars",
      cars
    });
  } catch (error) {
    next(error);
  }
}

export async function buildCarDetailPage(req, res, next) {
  try {
    const carId = Number(req.params.carId);
    const car = await getCarById(carId);

    if (!car) {
      return res.status(404).render("404", {
        title: "Car Not Found"
      });
    }

    const images = await getCarImagesByCarId(carId);
    const comments = await getCommentsByCarId(carId);

    res.render("cars/detail", {
      title: `${car.year} ${car.make} ${car.model}`,
      car,
      images,
      comments,
      errors: [],
      commentFormData: { comment_text: "" },
      editingCommentId: null
    });
  } catch (error) {
    next(error);
  }
}

export async function buildManageCarsPage(req, res, next) {
  try {
    const cars = await getAllCars();

    res.render("cars/manage", {
      title: "Manage Cars",
      cars
    });
  } catch (error) {
    next(error);
  }
}

export async function buildCreateCarPage(req, res, next) {
  try {
    const categories = await getAllCategories();

    res.render("cars/create", {
      title: "Add Car",
      categories,
      errors: [],
      formData: {
        category_id: "",
        title: "",
        make: "",
        model: "",
        year: "",
        price: "",
        description: "",
        featured: false,
        availability_status: "available",
        image_url: "",
        image_alt_text: ""
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function createCarSubmission(req, res, next) {
  try {
    const categories = await getAllCategories();
    const formData = normalizeCarForm(req.body);
    const errors = validateCarForm(formData);

    if (errors.length > 0) {
      return res.status(400).render("cars/create", {
        title: "Add Car",
        categories,
        errors,
        formData
      });
    }

    await createCar({
      categoryId: formData.category_id,
      title: formData.title,
      make: formData.make,
      model: formData.model,
      year: formData.year,
      price: formData.price,
      description: formData.description,
      featured: formData.featured,
      availabilityStatus: formData.availability_status,
      imageUrl: formData.image_url,
      imageAltText: formData.image_alt_text
    });

    res.redirect("/cars/manage");
  } catch (error) {
    next(error);
  }
}

export async function buildEditCarPage(req, res, next) {
  try {
    const carId = Number(req.params.carId);
    const [car, categories, primaryImage] = await Promise.all([
      getCarById(carId),
      getAllCategories(),
      getPrimaryImageByCarId(carId)
    ]);

    if (!car) {
      return res.status(404).render("404", {
        title: "Car Not Found"
      });
    }

    res.render("cars/edit", {
      title: "Edit Car",
      categories,
      errors: [],
      car,
      formData: {
        category_id: car.category_id ?? "",
        title: car.title ?? "",
        make: car.make ?? "",
        model: car.model ?? "",
        year: car.year ?? "",
        price: car.price ?? "",
        description: car.description ?? "",
        featured: Boolean(car.featured),
        availability_status: car.availability_status ?? "available",
        image_url: primaryImage?.image_url ?? "",
        image_alt_text: primaryImage?.alt_text ?? ""
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCarSubmission(req, res, next) {
  try {
    const carId = Number(req.params.carId);
    const [car, categories] = await Promise.all([
      getCarById(carId),
      getAllCategories()
    ]);

    if (!car) {
      return res.status(404).render("404", {
        title: "Car Not Found"
      });
    }

    const formData = normalizeCarForm(req.body);
    const errors = validateCarForm(formData);

    if (errors.length > 0) {
      return res.status(400).render("cars/edit", {
        title: "Edit Car",
        categories,
        errors,
        car,
        formData
      });
    }

    await updateCar(carId, {
      categoryId: formData.category_id,
      title: formData.title,
      make: formData.make,
      model: formData.model,
      year: formData.year,
      price: formData.price,
      description: formData.description,
      featured: formData.featured,
      availabilityStatus: formData.availability_status,
      imageUrl: formData.image_url,
      imageAltText: formData.image_alt_text
    });

    res.redirect("/cars/manage");
  } catch (error) {
    next(error);
  }
}

export async function deleteCarSubmission(req, res, next) {
  try {
    const carId = Number(req.params.carId);
    const deletedCar = await deleteCarById(carId);

    if (!deletedCar) {
      return res.status(404).send("Car not found.");
    }

    res.redirect("/cars/manage");
  } catch (error) {
    next(error);
  }
}