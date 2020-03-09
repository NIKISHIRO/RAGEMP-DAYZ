import { Schema, model, Model, Document } from 'mongoose';

// Интерфейсы.
export interface VehicleSpawnProp extends Document {
    hash: string;
    description: string;
    color: number[];
    position: {
        x: number,
        y: number,
        z: number,
    },
    rotation: {
        x: number,
        y: number,
        z: number,
    },
    inventory: Item[]
}

// Создание схем.
const VehicleSpawnSchema = new Schema({
    hash: String,
    description: String,
    color: [Number],
    position: {
        x: Number,
        y: Number,
        z: Number,
    },
    rotation: {
        x: Number,
        y: Number,
        z: Number,
    },
    inventory: [Object]
});

// Экспорты моделей.
export const VehicleSpawn: Model<VehicleSpawnProp> = model('VehicleSpawn', VehicleSpawnSchema);