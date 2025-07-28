import path from "path";
import { envConfigInterface } from "../type/envConfig";

export const productionConfig: envConfigInterface = {
    staticFilePath: path.join(__dirname, "../client"),
    port: 8080,
};