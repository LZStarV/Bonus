import { developmentConfig } from "./dev.js";
import { productionConfig } from "./prod.js";
import { envConfigInterface } from "../type/envConfig.js";

const env = process.env.NODE_ENV;

const getConfig = (): envConfigInterface => {
    if (env === "development") {
        return developmentConfig;
    }
    return productionConfig;
};

const envConfig = getConfig();

export default envConfig;