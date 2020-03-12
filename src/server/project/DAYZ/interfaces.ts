export interface InventoryInfo {
    inventory: Item[];
    maxSlots: number;
}

interface Info {
    text: string;
    data?: any;
}

export interface ReturnInformation {
    result: boolean;
    info: Info;
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

