"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnCar = exports.getAllBookings = exports.getUserBookings = exports.createBooking = void 0;
const cars_model_1 = require("../Cars/cars.model");
const booking_model_1 = require("./booking.model");
const zod_1 = require("zod");
const cars_controller_1 = require("../Cars/cars.controller");
const ErrorValidation_1 = require("../../../Utils/ErrorValidation");
const mongoose_1 = __importDefault(require("mongoose"));
const createBooking = async (req, res) => {
    try {
        const parsed = ErrorValidation_1.bookingSchema.parse(req.body);
        const car = await cars_model_1.Car.findById(parsed.carId);
        if (!car || car.isDeleted) {
            return res.status(404).json({ success: false, statusCode: 404, message: "Car not found", data: [] });
        }
        const booking = new booking_model_1.Booking({
            car: parsed.carId,
            user: req.user.id,
            date: new Date(parsed.date),
            startTime: parsed.startTime,
        });
        await booking.save();
        res.status(200).json({ success: true, statusCode: 200, message: "Car booked successfully", data: booking });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ success: false, statusCode: 400, message: 'Validation error', errors: (0, cars_controller_1.formatZodError)(error) });
        }
        else {
            res.status(500).json({ success: false, statusCode: 500, message: error.message });
        }
    }
};
exports.createBooking = createBooking;
const getUserBookings = async (req, res) => {
    try {
        const bookings = await booking_model_1.Booking.find({ user: req.user.id }).populate('car user');
        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ success: false, statusCode: 404, message: "No Data Found", data: [] });
        }
        res.status(200).json({ success: true, statusCode: 200, message: "My Bookings retrieved successfully", data: bookings });
    }
    catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ success: false, statusCode: 500, message: "Internal Server Error", data: [] });
    }
};
exports.getUserBookings = getUserBookings;
const getAllBookings = async (req, res) => {
    try {
        const bookings = await booking_model_1.Booking.find({}).populate('car user');
        if (bookings.length === 0) {
            return res.status(404).json({ success: false, statusCode: 404, message: "No Data Found", data: [] });
        }
        res.status(200).json({ success: true, statusCode: 200, message: "Bookings retrieved successfully", data: bookings });
    }
    catch (error) {
        res.status(500).json({ success: false, statusCode: 500, message: error.message });
    }
};
exports.getAllBookings = getAllBookings;
const returnCar = async (req, res) => {
    console.log(req.body);
    try {
        const { bookingId, endTime } = req.body;
        // Validate bookingId
        if (!mongoose_1.default.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ success: false, message: 'Invalid bookingId' });
        }
        // Find the booking by bookingId and populate car details
        const booking = await booking_model_1.Booking.findById(bookingId).populate('car').exec();
        if (!booking || !booking.car) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        // Update booking details
        booking.endTime = endTime;
        // Calculate total cost (example calculation)
        const start = new Date(`${booking.date.toISOString().split('T')[0]}T${booking.startTime}`);
        const end = new Date(`${booking.date.toISOString().split('T')[0]}T${endTime}`);
        const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        booking.totalCost = durationInHours * booking.car.pricePerHour;
        await booking.save();
        // Update car status to 'available'
        const carId = booking.car._id;
        const car = await cars_model_1.Car.findById(carId);
        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found' });
        }
        car.status = 'available';
        await car.save();
        res.status(200).json({ success: true, message: 'Car returned successfully', data: booking });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.returnCar = returnCar;
