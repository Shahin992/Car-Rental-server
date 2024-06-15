import { Request, Response } from 'express';
import { z } from 'zod';
import { Car } from './cars.model';
import {carSchema,carUpdateSchema} from '../../../Utils/ErrorValidation'


import { ZodError } from 'zod';

export const formatZodError = (error: ZodError) => {
  return error.errors.map(err => ({
    path: err.path.join('.'),
    message: err.message,
    code: err.code,
  }));
};

export const createCar = async (req: Request, res: Response) => {
  try {
    const parsed = carSchema.parse(req.body);
    const car = new Car(parsed);
    await car.save();
    res.status(201).json({ success: true, statusCode: 201, message: "Car created successfully", data: car });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const getAllCars = async (req: Request, res: Response) => {
  try {
    const cars = await Car.find({ isDeleted: false });
    if (cars.length === 0) {
      return res.status(404).json({ success: false, statusCode: 404, message: "No Data Found", data: [] });
    }
    res.status(200).json({ success: true, statusCode: 200, message: "Cars retrieved successfully", data: cars });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getCarById = async (req: Request, res: Response) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, statusCode: 404, message: "No Data Found", data: [] });
    }
    res.status(200).json({ success: true, statusCode: 200, message: "A Car retrieved successfully", data: car });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message})}
};

export const updateCar = async (req: Request, res: Response) => {
  try {
    const parsed = carUpdateSchema.parse(req.body);
    const car = await Car.findByIdAndUpdate(req.params.id, parsed, { new: true });
    if (!car) {
      return res.status(404).json({ success: false, statusCode: 404, message: "No Data Found", data: [] });
    }
    res.status(200).json({ success: true, statusCode: 200, message: "Car updated successfully", data: car });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};



export const deleteCar = async (req: Request, res: Response) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!car) {
      return res.status(404).json({ success: false, statusCode: 404, message: "No Data Found", data: [] });
    }
    res.status(200).json({ success: true, statusCode: 200, message: "Car Deleted successfully", data: car });
  } catch (error) {
    res.status(500).json({ success: false, message:(error as Error).message });
  }
};
