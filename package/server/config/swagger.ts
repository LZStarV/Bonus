import * as path from 'path';
import { developmentConfig } from './dev.js';
import { productionConfig } from './prod.js';
import type { Options } from 'swagger-jsdoc';
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dev_port = developmentConfig.port;
const prod_port = productionConfig.port;

const options: Options = {
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

export default options;