import express from 'express';
import cors from 'cors';
import router from './router/router.js';
import envConfig from './config/envConfig.js';
import swaggerDocs from './config/swagger.js';

const app = express();
const port = envConfig.port;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 路由
app.use('/api', router);

// 启动服务器
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
  // swaggerDocs(app, port);
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

export default app;
