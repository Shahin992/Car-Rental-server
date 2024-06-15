"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_route_1 = __importDefault(require("../src/modules/User/user.route"));
const cars_route_1 = __importDefault(require("../src/modules/Cars/cars.route"));
const booking_route_1 = __importDefault(require("../src/modules/Booking/booking.route"));
const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));
// Database connection
main().catch(err => console.log(err));
async function main() {
    try {
        mongoose.set('strictPopulate', false);
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.c60ctk1.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0`);
        console.log("=> Connected to DB");
    }
    catch (error) {
        console.log(error);
    }
}
// Router 
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
app.use('/api/auth', user_route_1.default);
app.use('/api/cars', cars_route_1.default);
app.use('/api/bookings', booking_route_1.default);
// app.use('/', router);
app.get('/', (req, res) => {
    res.send('Car Rental Server is Running');
});
app.listen(PORT, () => {
    console.log('=> Server running on', PORT);
});
