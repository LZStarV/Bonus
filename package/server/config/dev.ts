import path from "path";
import { envConfigInterface } from "../type/envConfig";

export const developmentConfig: envConfigInterface = {
    staticFilePath: path.join(__dirname, "../../../output/client"),
    port: 3000,
};