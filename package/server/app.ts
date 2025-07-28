import express from 'express';
import { logger } from './config/setLog';
import { getRouter } from "./router/router";
import { envConfig } from "./config/envConfig";

const main = async () => {
    const app = express();
    const port = envConfig.port || 8080;

    app.use("/api", getRouter());
    app.use("/static", express.static(envConfig.staticFilePath));

    app.listen(port, () => {
        logger.info(`server started at http://localhost:${port}`);
    });
};

main()
    .catch((result) => {
        logger.error(result);
    });
