"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productionConfig = void 0;
const path_1 = __importDefault(require("path"));
exports.productionConfig = {
    staticFilePath: path_1.default.join(__dirname, "../client"),
    port: 8080,
};
