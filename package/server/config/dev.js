"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.developmentConfig = void 0;
const path_1 = __importDefault(require("path"));
exports.developmentConfig = {
    staticFilePath: path_1.default.join(__dirname, "../../../output/client"),
    port: 3000,
};
