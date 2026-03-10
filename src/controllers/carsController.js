import {
  getAllCars,
  getCarById,
  getCarImagesByCarId
} from "../models/carsModel.js";

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
      return res.status(404).send("Car not found.");
    }

    const images = await getCarImagesByCarId(carId);

    res.render("cars/detail", {
      title: `${car.year} ${car.make} ${car.model}`,
      car,
      images
    });
  } catch (error) {
    next(error);
  }
}