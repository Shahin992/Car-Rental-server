
import { Request, Response } from 'express';
import { Car } from '../Cars/cars.model';
import { Booking } from './booking.model';
import { ZodError } from 'zod';
import { formatZodError } from '../Cars/cars.controller';
import { bookingSchema,} from '../../../Utils/ErrorValidation';
import mongoose from 'mongoose';


export const createBooking = async (req: Request, res: Response) => {
  try {
    const parsed = bookingSchema.parse(req.body);
    const car = await Car.findById(parsed.carId);
    if (!car || car.isDeleted) {
      return res.status(404).json({ success: false, statusCode: 404, message: "Car not found", data: [] });
    }
    const booking = new Booking({
      car: parsed.carId,
      user: (req as any).user.id,
      date: new Date(parsed.date),
      startTime: parsed.startTime,
    });
    await booking.save();
    res.status(200).json({ success: true, statusCode: 200, message: "Car booked successfully", data: booking });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ success: false, statusCode: 400, message: 'Validation error', errors: formatZodError(error) });
    } else {
      res.status(500).json({ success: false, statusCode: 500, message: (error as Error).message });
    }
  }
};

export const getUserBookings = async (req: Request, res: Response) => {
    try {
      const bookings = await Booking.find({ user: (req as any).user.id }).populate('car user');
      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ success: false, statusCode: 404, message: "No Data Found", data: [] });
      }
      res.status(200).json({ success: true, statusCode: 200, message: "My Bookings retrieved successfully", data: bookings });
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      res.status(500).json({ success: false, statusCode: 500, message: "Internal Server Error", data: [] });
    }
  };

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({}).populate('car user');
    if (bookings.length === 0) {
      return res.status(404).json({ success: false, statusCode: 404, message: "No Data Found", data: [] });
    }
    res.status(200).json({ success: true, statusCode: 200, message: "Bookings retrieved successfully", data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, statusCode: 500, message: (error as Error).message });
  }
};

interface ReturnCarRequest extends Request {
  body: {
    bookingId: string;
    endTime: string;
  };
}

export const returnCar = async (req: ReturnCarRequest, res: Response) => {
  console.log(req.body);
  try {
    const { bookingId, endTime } = req.body;

    // Validate bookingId
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ success: false, message: 'Invalid bookingId' });
    }

    // Find the booking by bookingId and populate car details
    const booking = await Booking.findById(bookingId).populate('car').exec();

    if (!booking || !booking.car) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Update booking details
    booking.endTime = endTime;

    // Calculate total cost (example calculation)
    const start = new Date(`${booking.date.toISOString().split('T')[0]}T${booking.startTime}`);
    const end = new Date(`${booking.date.toISOString().split('T')[0]}T${endTime}`);
    const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    booking.totalCost = durationInHours * (booking.car as any).pricePerHour;

    await booking.save();

    // Update car status to 'available'
    const carId = (booking.car as any)._id;
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    car.status = 'available';
    await car.save();

    res.status(200).json({ success: true, message: 'Car returned successfully', data: booking });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};


