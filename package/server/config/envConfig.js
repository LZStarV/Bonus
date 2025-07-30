"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envConfig = void 0;
const dev_1 = require("./dev");
const prod_1 = require("./prod");
const env = process.env.NODE_ENV;
const getConfig = () => {
    if (env === "development") {
        return dev_1.developmentConfig;
    }
    return prod_1.productionConfig;
};
exports.envConfig = getConfig();
