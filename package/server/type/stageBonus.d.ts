export interface stageBonusInterface {
    peopleSize: number;
    weight: number;
    bonus: number;
}

export interface bonusInterface {
    perPersonBonus: number;
    totalBonus: number;
    stageBonus: stageBonusInterface[];
}