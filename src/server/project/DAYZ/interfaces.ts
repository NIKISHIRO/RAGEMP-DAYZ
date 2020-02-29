export interface ReturnInformation {
    result: boolean;
    info: string;
}

export enum LootSpawn {
    RELOAD = 'RELOAD',
    DROPPED = 'DROPPED',
}

export interface LootShapeInfo {
    type: LootSpawn,
    labelId: number,
    objectId: number,
}

export interface CreateItemParams {
    pos: Vector3Mp; 
    range: number;
    labelText: string;
    objectHash: string;
}