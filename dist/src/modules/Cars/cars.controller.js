"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCar = exports.updateCar = exports.getCarById = exports.getAllCars = exports.createCar = exports.formatZodError = void 0;
const cars_model_1 = require("./cars.model");
const ErrorValidation_1 = require("../../../Utils/ErrorValidation");
const formatZodError = (error) => {
    return error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
        code: err.code,
    }));
};
exports.formatZodError = formatZodError;
const createCar = async (req, res) => {
    try {
        const parsed = ErrorValidation_1.carSchema.parse(req.body);
        const car = new cars_model_1.Car(parsed);
        await car.save();
        res.status(201).json({ success: true, statusCode: 201, message: "Car created successfully", data: car });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createCar = createCar;
const getAllCars = async (req, res) => {
    try {
        const cars = await cars_model_1.Car.find({ isDeleted: false });
        if (cars.length === 0) {
            return res.status(404).json({ success: false, statusCode: 404, message: "No Data Found", data: [] });
        }
        res.status(200).json({ success: true, statusCode: 200, message: "Cars retrieved successfully", data: cars });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllCars = getAllCars;
const getCarById = async (req, res) => {
    try {
        const car = await cars_model_1.Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ success: false, statusCode: 404, message: "No Data Found", data: [] });
        }
        res.status(200).json({ success: true, statusCode: 200, message: "A Car retrieved successfully", data: car });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCarById = getCarById;
const updateCar = async (req, res) => {
    try {
        const parsed = ErrorValidation_1.carUpdateSchema.parse(req.body);
        const car = await cars_model_1.Car.findByIdAndUpdate(req.params.id, parsed, { new: true });
        if (!car) {
            return res.status(404).json({ success: false, statusCode: 404, message: "No Data Found", data: [] });
        }
        res.status(200).json({ success: true, statusCode: 200, message: "Car updated successfully", data: car });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateCar = updateCar;
const deleteCar = async (req, res) => {
    try {
        const car = await cars_model_1.Car.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!car) {
            return res.status(404).json({ success: false, statusCode: 404, message: "No Data Found", data: [] });
        }
        res.status(200).json({ success: true, statusCode: 200, message: "Car Deleted successfully", data: car });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteCar = deleteCar;
