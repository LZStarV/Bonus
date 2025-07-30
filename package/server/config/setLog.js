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
exports.errorLogger = exports.warnLogger = exports.infoLogger = exports.debugLogger = exports.logger = void 0;
const log4js = __importStar(require("log4js"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
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
exports.logger = log4js.getLogger();
exports.debugLogger = log4js.getLogger('debug');
exports.infoLogger = log4js.getLogger('info');
exports.warnLogger = log4js.getLogger('warn');
exports.errorLogger = log4js.getLogger('error');
// 导出log4js实例供其他配置使用
exports.default = log4js;
