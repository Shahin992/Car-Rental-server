"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnCarSchema = exports.bookingSchema = exports.carUpdateSchema = exports.carSchema = exports.signinSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
const userSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    role: zod_1.z.enum(['user', 'admin']),
    password: zod_1.z.string().min(6),
    phone: zod_1.z.string(),
    address: zod_1.z.string()
});
exports.userSchema = userSchema;
const signinSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
exports.signinSchema = signinSchema;
const carSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    color: zod_1.z.string(),
    isElectric: zod_1.z.boolean(),
    features: zod_1.z.array(zod_1.z.string()),
    pricePerHour: zod_1.z.number()
});
exports.carSchema = carSchema;
const carUpdateSchema = carSchema.partial();
exports.carUpdateSchema = carUpdateSchema;
const bookingSchema = zod_1.z.object({
    carId: zod_1.z.string(),
    date: zod_1.z.string(),
    startTime: zod_1.z.string()
});
exports.bookingSchema = bookingSchema;
const returnCarSchema = zod_1.z.object({
    bookingId: zod_1.z.string().nonempty(),
    endTime: zod_1.z.string().regex(/^\d{2}:\d{2}$/), // HH:mm format validation
});
exports.returnCarSchema = returnCarSchema;
