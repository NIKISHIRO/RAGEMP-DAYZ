export interface InventoryInfo {
    maxSlots: number;
}

export interface ReturnInformation {
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

export interface CreateItemParams {
    colshapePosition: Vector3Mp; 
    objectPosition: Vector3Mp; 
    labelPosition: Vector3Mp; 
    range: number;
    labelText: string;
    objectHash: string;
}

