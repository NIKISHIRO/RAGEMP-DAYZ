import { Item } from "./types";

export interface NotifyParams {
    text: string;
    color?: string;
}

interface Info {
    text: string;
    data?: any;
}

export interface ReturnInformation {
    result: boolean;
    info: Info;
}

export interface CarReturnInformation {
    result: boolean;
    info: string;
}

// Тип созданного колшипа.
export enum LootSpawn {
    RELOAD = 'RELOAD',
    DROPPED = 'DROPPED',
}

export interface LootShapeInfo {
    type: LootSpawn;
    labelId: number;
    objectId: number;
    blipId: number;
}