import http from '@/utils/http';
import type { StageBonusInterface } from '@/types/stageBonus';
import type { ResponseInterface } from '@/types/response';
import {SetPerPersonBonusInterface, SetStagePeopleSizeInterface, SetStageWeightInterface} from "@/types/api";

// 获取人均奖金
export const getPerPersonBonus = async (): Promise<number> => {
    const res = await http.get<ResponseInterface<number>>('/getPerPersonBonus');
    return res.data;
}

// 获取总奖金
export const getTotalBonus = async (): Promise<number> => {
    const res = await http.get<ResponseInterface<number>>('/getTotalBonus');
    return res.data;
}

// 获取各挡位奖金情况
export const getStageBonus = async (): Promise<StageBonusInterface> => {
    const res = await http.get<ResponseInterface<StageBonusInterface>>('/getStageBonus');
    return res.data;
}

// 设置人均奖金
export const setPerPersonBonus = async (value: number): Promise<string> => {
    const res = await http.post<SetPerPersonBonusInterface, ResponseInterface<string>>('/setPerPersonBonus', { value });
    return res.msg;
}

// 设置指定挡位人数
export const setStagePeopleSize = async (index: number, peopleSize: number): Promise<string> => {
    const res = await http.post<SetStagePeopleSizeInterface, ResponseInterface<string>>('/setStagePeopleSize', { index, peopleSize });
    return res.msg;
}

// 设置挡位权重
export const setStageWeight = async (index: number, weight: number): Promise<string> => {
    const res = await http.post<SetStageWeightInterface, ResponseInterface<string>>('/setStageWeight', { index, weight });
    return res.msg;
}