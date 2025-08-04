import { app, BrowserWindow, Menu, dialog } from 'electron';
import path from 'path';
import { spawn } from 'child_process';
import fs from 'fs/promises';

// 全局状态管理
let backendProcess: ReturnType<typeof spawn> | null = null;
let mainWindow: BrowserWindow | null = null;
let isQuitting = false;

/**
 * 规范化路径，移除可能的重复根目录（如E:\E:\）
 */
function normalizePath(p: string): string {
    // 处理Windows系统下的路径重复问题
    if (process.platform === 'win32') {
        const match = p.match(/^([A-Za-z]:\\)(\1.*)/);
        if (match) {
            console.warn(`检测到路径异常: ${p}，已自动修复`);
            return match[2]; // 返回修复后的路径
        }
    }
    return p;
}

/**
 * 获取应用根目录路径
 * 生产环境：exe所在目录
 * 开发环境：项目根目录
 */
function getAppRoot(): string {
    // 计算当前模块所在目录（替代__dirname）
    const currentDir = path.dirname(new URL(import.meta.url).pathname)
        // 处理Windows路径中的斜杠问题
        .replace(/^\/([A-Za-z]:)/, '$1')
        // 规范化路径
        .replace(/\//g, path.sep);

    let appRoot: string;

    if (app.isPackaged) {
        // 生产环境：exe所在目录
        appRoot = path.dirname(app.getPath('exe'));
    } else {
        // 开发环境：根据main.ts位置计算项目根目录
        // 目录结构：项目根目录/output/electron/main.ts
        appRoot = path.resolve(currentDir, '../../');
    }

    // 规范化路径，修复可能的重复根目录问题
    const normalizedRoot = normalizePath(appRoot);

    // 开发环境打印路径调试信息
    if (!app.isPackaged) {
        console.log('=== 路径调试信息 ===');
        console.log('当前模块目录:', currentDir);
        console.log('计算得到的根目录:', appRoot);
        console.log('规范化后的根目录:', normalizedRoot);
        console.log('====================');
    }

    return normalizedRoot;
}

/**
 * 验证文件是否存在并输出调试信息
 */
async function verifyFile(path: string, description: string): Promise<boolean> {
    try {
        await fs.access(path);
        if (!app.isPackaged) {
            console.log(`✅ 找到${description}: ${path}`);
        }
        return true;
    } catch {
        if (!app.isPackaged) {
            console.error(`❌ 未找到${description}: ${path}`);
        }
        return false;
    }
}

/**
 * 启动后端服务
 */
async function startBackend(): Promise<void> {
    const appRoot = getAppRoot();
    // 开发环境后端路径 - 包含package目录
    const serverPath = path.join(appRoot, 'output', 'server', 'server.exe');
    const normalizedServerPath = normalizePath(serverPath);

    // 验证后端文件
    if (!await verifyFile(normalizedServerPath, '后端服务文件')) {
        dialog.showErrorBox(
            '启动失败',
            `后端服务文件不存在：\n${normalizedServerPath}\n\n请检查后端是否已编译到package/server目录`
        );
        app.quit();
        return;
    }

    try {
        // 启动后端进程
        backendProcess = spawn(normalizedServerPath, [], {
            cwd: path.dirname(normalizedServerPath),
            shell: true,
            stdio: 'ignore'
        });

        // 后端进程错误处理
        backendProcess.on('error', (err) => {
            dialog.showErrorBox('服务启动失败', `启动后端服务时出错：${err.message}`);
            if (!isQuitting) app.quit();
        });

        // 后端进程退出处理
        backendProcess.on('exit', (code) => {
            if (code !== 0 && !isQuitting) {
                dialog.showErrorBox('服务异常退出', `后端服务已退出，代码：${code}`);
                app.quit();
            }
            backendProcess = null;
        });
    } catch (err) {
        dialog.showErrorBox('服务启动异常', `无法启动后端服务：${(err as Error).message}`);
        app.quit();
    }
}

/**
 * 创建主窗口
 */
async function createWindow(): Promise<void> {
    // 避免重复创建窗口
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
        return;
    }

    const appRoot = getAppRoot();
    // 开发环境前端路径 - 包含package目录
    const indexPath = path.join(appRoot, 'output', 'client', 'index.html');
    const normalizedIndexPath = normalizePath(indexPath);

    // 验证前端文件
    if (!await verifyFile(normalizedIndexPath, '前端页面文件')) {
        dialog.showErrorBox(
            '加载失败',
            `前端页面文件不存在：\n${normalizedIndexPath}\n\n请检查前端是否已编译到package/client目录`
        );
        setTimeout(() => app.quit(), 1500);
        return;
    }

    // 创建窗口
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        title: '奖金计算器',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
            devTools: !app.isPackaged
        }
    });

    // 开发环境打印路径信息
    if (!app.isPackaged) {
        console.log('前端页面加载路径:', `file://${normalizedIndexPath}`);
    }

    // 加载前端页面
    try {
        await mainWindow.loadURL(`file://${normalizedIndexPath}`);

        // 页面加载完成后显示窗口
        mainWindow.once('ready-to-show', () => {
            mainWindow?.show();
        });

        // 开发环境自动打开开发者工具
        if (!app.isPackaged) {

            // 监听前端控制台消息
            mainWindow.webContents.on('console-message', (event, level, message) => {
                console.log(`[前端控制台] ${message}`);
            });
        }
    } catch (err) {
        console.error('页面加载失败:', err);
        dialog.showErrorBox('页面加载失败', `无法加载应用界面：${(err as Error).message}`);
        mainWindow.close();
    }

    // 窗口事件监听
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // 页面加载失败事件
    mainWindow.webContents.on('did-fail-load', (_, errorCode, errorDescription) => {
        console.error(`页面加载失败: ${errorDescription} (错误码: ${errorCode})`);
        dialog.showErrorBox('页面加载错误', `加载页面时出错：${errorDescription}`);
        mainWindow?.close();
    });
}

/**
 * 应用生命周期管理
 */
app.whenReady().then(async () => {
    // 隐藏菜单栏
    Menu.setApplicationMenu(null);

    try {
        // 开发环境额外的调试信息
        if (!app.isPackaged) {
            console.log('=== 应用启动调试信息 ===');
            console.log('应用是否打包:', app.isPackaged);
            console.log('当前工作目录:', process.cwd());
            console.log('========================');
        }

        // 启动后端服务
        await startBackend();
        // 创建主窗口
        await createWindow();
    } catch (err) {
        console.error('应用初始化失败:', err);
        dialog.showErrorBox('初始化失败', `应用启动时发生错误：${(err as Error).message}`);
        app.quit();
    }

    // macOS激活事件
    app.on('activate', () => {
        if (!mainWindow) {
            createWindow();
        }
    });
});

// 所有窗口关闭时
app.on('window-all-closed', () => {
    isQuitting = true;

    // 终止后端进程
    if (backendProcess) {
        backendProcess.kill();
        backendProcess = null;
    }

    // macOS以外平台退出应用
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// 应用退出前清理
app.on('before-quit', () => {
    isQuitting = true;
});
