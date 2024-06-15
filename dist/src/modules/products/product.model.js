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
// VarientSchema //
const VariantSchema = new mongoose_1.Schema({
    type: { type: String, required: true },
    value: { type: String, required: true }
}, { versionKey: false });
//inventorySchema //
const InventorySchema = new mongoose_1.Schema({
    quantity: { type: Number, required: true },
    inStock: { type: Boolean, required: true }
}, { versionKey: false });
// Product Schema   //
const ProductSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    tags: { type: [String], required: true },
    variants: { type: [VariantSchema], required: true },
    inventory: { type: InventorySchema, required: true }
}, { versionKey: false, timestamps: false });
exports.default = mongoose_1.default.model('Product', ProductSchema);
