"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const dev_1 = require("./dev");
const prod_1 = require("./prod");
const dev_port = dev_1.developmentConfig.port;
const prod_port = prod_1.productionConfig.port;
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: '奖金系统API文档',
            version: '1.0.0',
            description: '后台奖金计算系统接口文档，包含个人奖金、总奖金和阶段奖金的查询与设置接口',
        },
        servers: [
            {
                url: `http://localhost:${dev_port}`,
                description: '开发环境服务器',
            },
            {
                url: `http://localhost:${prod_port}`,
                description: '生产环境服务器',
            },
        ],
    },
    // 扫描包含Swagger注释的路由文件
    apis: [path.join(__dirname, '../router/*.ts')],
};
exports.default = options;
