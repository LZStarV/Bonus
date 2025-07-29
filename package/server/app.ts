import express from 'express';
import cors from 'cors';
import { logger } from './config/setLog';
import { getRouter } from './router/router';
import { envConfig } from './config/envConfig';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './config/swagger';

const app = express();
const port = envConfig.port || 8080;
const specs = swaggerJsDoc(swaggerOptions);

const main = async () => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use('/api', getRouter());
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    app.use('/static', express.static(envConfig.staticFilePath));

    app.listen(port, () => {
        logger.info(`server started at http://localhost:${port}`);
    });
};

main()
    .catch((result) => {
        logger.error(result);
    });
