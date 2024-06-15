"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const error_1 = require("../../../Utils/middleware/error");
const user_model_1 = require("./user.model");
const userSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    role: zod_1.z.enum(['user', 'admin']),
    password: zod_1.z.string().min(6),
    phone: zod_1.z.string(),
    address: zod_1.z.string(),
});
const signinSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const signup = async (req, res, next) => {
    try {
        const parsed = userSchema.parse(req.body);
        const user = new user_model_1.User(parsed);
        await user.save();
        res.status(201).json({ success: true, statusCode: 201, message: 'User registered successfully', data: user });
    }
    catch (error) {
        next((0, error_1.createError)(400, 'Failed to register user', [{ path: 'User', message: error.message }]));
    }
};
exports.signup = signup;
const signin = async (req, res, next) => {
    try {
        const parsed = signinSchema.parse(req.body);
        const user = await user_model_1.User.findOne({ email: parsed.email });
        if (!user || !(await user.comparePassword(parsed.password))) {
            // return res.status(401).send("User Unauthorised");
            res.status(401).send({ success: false, statusCode: 401, message: 'Unauthorized user' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, 'secretKey', { expiresIn: '1h' });
        res.status(200).json({ success: true, statusCode: 200, message: 'User logged in successfully', data: user, token });
    }
    catch (error) {
        res.status(500).json({ success: false, statusCode: 500, message: 'Failed to login user', details: error.message });
    }
};
exports.signin = signin;
