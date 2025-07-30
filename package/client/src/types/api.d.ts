import {StageBonusInterface} from '@/types/stageBonus';

export interface SetPerPersonBonusInterface {
    value: number; // 人均奖金
}

export interface SetStagePeopleSizeInterface {
    peopleSize: number; // 人数
}

export interface SetStageWeightInterface {
    weight: number; // 权重
}

export interface CreateStageInterface {
    peopleSize: number;
    weight: number;
}