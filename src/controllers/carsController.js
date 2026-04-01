import {
  getAllCars,
  getCarById,
  getCarImagesByCarId
} from "../models/carsModel.js";
import { getCommentsByCarId } from "../models/commentsModel.js";

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