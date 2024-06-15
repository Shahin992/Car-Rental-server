import { Router } from 'express';
import { authenticate, authorize } from '../../../middleware/authMiddlewares';
import { createCar, deleteCar, getAllCars, getCarById, updateCar } from './cars.controller';
// import { createCar, getAllCars, getCarById, updateCar, deleteCar } from '../controllers/carController';
// import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize(['admin']), createCar);
router.get('/', getAllCars);
router.get('/:id', getCarById);
router.put('/:id', authenticate, authorize(['admin']), updateCar);
router.delete('/:id', authenticate, authorize(['admin']), deleteCar);

export default router;
