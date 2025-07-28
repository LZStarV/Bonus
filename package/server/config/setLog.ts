import * as log4js from 'log4js';
import * as path from 'path';
import * as fs from 'fs';

// 创建日志目录
const logDir = path.join(__dirname, '../log');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// 配置log4js
log4js.configure({
    appenders: {
        console: { type: 'console' },
        debugFile: {
            type: 'dateFile',
            filename: path.join(logDir, 'debug/debug'),
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            encoding: 'utf-8',
            maxLogSize: 10485760, // 10MB
            backups: 5
        },
        infoFile: {
            type: 'dateFile',
            filename: path.join(logDir, 'info/info'),
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            encoding: 'utf-8',
            maxLogSize: 10485760,
            backups: 5
        },
        warnFile: {
            type: 'dateFile',
            filename: path.join(logDir, 'warn/warn'),
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            encoding: 'utf-8',
            maxLogSize: 10485760,
            backups: 5
        },
        errorFile: {
            type: 'dateFile',
            filename: path.join(logDir, 'error/error'),
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            encoding: 'utf-8',
            maxLogSize: 10485760,
            backups: 5
        }
    },
    categories: {
        default: { appenders: ['console'], level: 'debug' },
        debug: { appenders: ['debugFile'], level: 'debug' },
        info: { appenders: ['infoFile'], level: 'info' },
        warn: { appenders: ['warnFile'], level: 'warn' },
        error: { appenders: ['errorFile'], level: 'error' }
    }
});

// 创建并导出不同级别的logger
export const logger = log4js.getLogger();
export const debugLogger = log4js.getLogger('debug');
export const infoLogger = log4js.getLogger('info');
export const warnLogger = log4js.getLogger('warn');
export const errorLogger = log4js.getLogger('error');

// 导出log4js实例供其他配置使用
export default log4js;