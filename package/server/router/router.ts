import express from 'express';
import BonusController from '../controller/bonusController';

export const getRouter = () => {
    const bonusController = new BonusController();
    const router = express.Router();

    router.get('/getPerPersonBonus', bonusController.getPerPersonBonus);
    router.get('/getTotalBonus', bonusController.getTotalBonus);
    router.get('/getStageBonus', bonusController.getStageBonus);
    router.post('/setPerPersonBonus', bonusController.setPerPersonBonus);
    router.post('/setStagePeopleBonus', bonusController.setStagePeopleSize);
    router.post('/setStageWeight', bonusController.setStageWeight);

    return router;
};