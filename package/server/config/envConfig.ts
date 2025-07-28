import { developmentConfig } from "./dev";
import { productionConfig } from "./prod";
import { envConfigInterface } from "../type/envConfig";

const env = process.env.NODE_ENV;

const getConfig = (): envConfigInterface => {
    if (env === "development") {
        return developmentConfig;
    }
    return productionConfig;
};

export const envConfig = getConfig();