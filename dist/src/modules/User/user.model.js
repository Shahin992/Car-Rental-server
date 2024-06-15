"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['user', 'admin'], required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
}, { timestamps: true, versionKey: false });
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcryptjs_1.default.hash(this.password, 10);
    next();
});
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
exports.User = (0, mongoose_1.model)('User', userSchema);
