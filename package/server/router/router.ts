import express from 'express';
import * as bonusController from '../controller/bonusController.js';

/**
 * @swagger
 * tags:
 *   name: Bonus
 *   description: 奖金计算相关接口
 */

const getRouter = () => {
    const router = express.Router();

    /**
     * @swagger
     * /api/getPerPersonBonus:
     *   get:
     *     summary: 获取人均奖金
     *     tags: [Bonus]
     *     description: 返回人均奖金金额
     *     responses:
     *       200:
     *         description: 成功返回人均奖金
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: number
     *                   description: 人均奖金金额
     *                   example: 5000
     *                 msg:
     *                   type: string
     *                   example: 成功获取人均奖金数!
     *       500:
     *         description: 获取数据失败
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: number
     *                   example: 0
     *                 msg:
     *                   type: string
     *                   example: 获取数据失败,请通过日志查看详细错误信息!
     */
    router.get('/getPerPersonBonus', bonusController.getPerPersonBonus);

    /**
     * @swagger
     * /api/getTotalBonus:
     *   get:
     *     summary: 获取总奖金
     *     tags: [Bonus]
     *     description: 计算并返回总奖金金额
     *     responses:
     *       200:
     *         description: 成功返回总奖金
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: number
     *                   description: 总奖金金额
     *                   example: 50000
     *                 msg:
     *                   type: string
     *                   example: 成功获取总奖金!
     *       500:
     *         description: 获取数据失败
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: number
     *                   example: 0
     *                 msg:
     *                   type: string
     *                   example: 获取数据失败,请通过日志查看详细错误信息!
     */
    router.get('/getTotalBonus', bonusController.getTotalBonus);

    /**
     * @swagger
     * /api/getStageBonus:
     *   get:
     *     summary: 获取各挡位奖金分配情况
     *     tags: [Bonus]
     *     description: 返回挡位奖金分配情况
     *     responses:
     *       200:
     *         description: 成功返回阶段奖金
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       peopleSize:
     *                         type: number
     *                         description: 当前挡位人数
     *                         example: 10
     *                       weight:
     *                         type: number
     *                         description: 当前挡位权重
     *                         example: 1
     *                       bonus:
     *                         type: number
     *                         description: 当前挡位分配奖金
     *                         example: 3000
     *                 msg:
     *                   type: string
     *                   example: 成功获取各挡位奖金分配情况!
     *       500:
     *         description: 获取数据失败
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   example: []
     *                 msg:
     *                   type: string
     *                   example: 获取数据失败,请通过日志查看详细错误信息!
     */
    router.get('/getStageBonus', bonusController.getStageBonus);

    /**
     * @swagger
     * /api/perPersonBonus:
     *   put:
     *     summary: 设置人均奖金
     *     tags: [Bonus]
     *     description: 设置人均奖金金额
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - value
     *             properties:
     *               value:
     *                 type: number
     *                 description: 人均奖金金额
     *                 example: 1000
     *     responses:
     *       200:
     *         description: 设置成功
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 成功修改人均奖金!
     *       400:
     *         description: 参数错误
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 未获取到数据!
     *       500:
     *         description: 设置失败
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 修改失败,请通过日志查看详细错误信息!
     */
    router.put('/perPersonBonus', bonusController.setPerPersonBonus);

    /**
     * @swagger
     * /api/stage/{index}/peopleSize:
     *   put:
     *     summary: 设置指定挡位人数
     *     tags: [Bonus]
     *     description: 设置指定挡位人数
     *     parameters:
     *       - in: path
     *         name: index
     *         required: true
     *         schema:
     *           type: number
     *         description: 挡位编号
     *         example: 0
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - peopleSize
     *             properties:
     *               peopleSize:
     *                 type: number
     *                 description: 人数
     *                 example: 20
     *     responses:
     *       200:
     *         description: 设置成功
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 成功修改挡位人数!
     *       400:
     *         description: 参数错误
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 无效的挡位索引! 或 未获取到人数信息!
     *       404:
     *         description: 挡位不存在
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 未找到对应挡位!
     *       500:
     *         description: 设置失败
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 修改失败,请通过日志查看详细错误信息!
     */
    router.put('/stage/:index/peopleSize', bonusController.setStagePeopleSize);

    /**
     * @swagger
     * /api/stage/{index}/weight:
     *   put:
     *     summary: 设置挡位权重
     *     tags: [Bonus]
     *     description: 设置挡位权重
     *     parameters:
     *       - in: path
     *         name: index
     *         required: true
     *         schema:
     *           type: number
     *         description: 挡位索引
     *         example: 0
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - weight
     *             properties:
     *               weight:
     *                 type: number
     *                 description: 权重值
     *                 example: 1.6
     *     responses:
     *       200:
     *         description: 设置成功
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 成功修改挡位权重!
     *       400:
     *         description: 参数错误
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 无效的挡位索引! 或 未获取到权重信息!
     *       404:
     *         description: 挡位不存在
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 未找到对应挡位!
     *       500:
     *         description: 设置失败
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 修改失败,请通过日志查看详细错误信息!
     */
    router.put('/stage/:index/weight', bonusController.setStageWeight);



    /**
     * @swagger
     * /api/createStage:
     *   post:
     *     summary: 新增挡位
     *     tags: [Bonus]
     *     description: 新增一个奖金挡位，bonus将自动计算为0并在后续计算中更新
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - peopleSize
     *               - weight
     *             properties:
     *               peopleSize:
     *                 type: number
     *                 description: 挡位人数
     *                 example: 15
     *               weight:
     *                 type: number
     *                 description: 挡位权重
     *                 example: 1.2
     *     responses:
     *       200:
     *         description: 新增成功
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 成功新增挡位!
     *       400:
     *         description: 参数错误
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 请求体不能为空! 或 未获取到人数信息! 或 未获取到权重信息!
     *       500:
     *         description: 新增失败
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 修改失败,请通过日志查看详细错误信息!
     */
    router.post('/createStage', bonusController.createStage);

    /**
     * @swagger
     * /api/removeStage/{index}:
     *   delete:
     *     summary: 移除挡位
     *     tags: [Bonus]
     *     description: 根据索引移除一个奖金挡位
     *     parameters:
     *       - in: path
     *         name: index
     *         required: true
     *         schema:
     *           type: number
     *         description: 挡位索引
     *         example: 0
     *     responses:
     *       200:
     *         description: 移除成功
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 成功移除挡位!
     *       400:
     *         description: 参数错误
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 无效的挡位索引!
     *       404:
     *         description: 挡位不存在
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 未找到对应序号!
     *       500:
     *         description: 移除失败
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 修改失败,请通过日志查看详细错误信息!
     */
    router.delete('/removeStage/:index', bonusController.removeStage);

    return router;
};

const router = getRouter();
export default router;