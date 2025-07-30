"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const setLog_1 = require("./config/setLog");
const router_1 = require("./router/router");
const envConfig_1 = require("./config/envConfig");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./config/swagger"));
const app = (0, express_1.default)();
const port = envConfig_1.envConfig.port || 8080;
const specs = (0, swagger_jsdoc_1.default)(swagger_1.default);
const main = async () => {
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cors_1.default)());
    app.use('/api', (0, router_1.getRouter)());
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
    app.use('/static', express_1.default.static(envConfig_1.envConfig.staticFilePath));
    app.listen(port, () => {
        setLog_1.logger.info(`server started at http://localhost:${port}`);
    });
};
main()
    .catch((result) => {
    setLog_1.logger.error(result);
});
