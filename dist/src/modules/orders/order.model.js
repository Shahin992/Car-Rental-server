"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Order Schema //
const OrderSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    productId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: 'Product' },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
}, { versionKey: false, timestamps: false });
exports.default = mongoose_1.default.model('Order', OrderSchema);
