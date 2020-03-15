import { Schema, model, Model, Document } from 'mongoose';

// Интерфейсы.
export interface VehicleSpawnProp extends Document {
    hash: string;
    description: string;
    color: number[];
    defaultPosition: {
        x: number,
        y: number,
        z: number,
    },
    savePosition: {
        x: number,
        y: number,
        z: number,
    },
    rotation: {
        x: number,
        y: number,
        z: number,
    },
    isExplode: boolean
}

// Создание схем.
const VehicleSpawnSchema = new Schema({
    hash: String,
    description: String,
    color: [Number],
    defaultPosition: {
        x: Number,
        y: Number,
        z: Number,
    },
    savePosition: {
        x: Number,
        y: Number,
        z: Number,
    },
    rotation: {
        x: Number,
        y: Number,
        z: Number,
    },
    isExplode: Boolean
});

// Экспорты моделей.
export const VehicleSpawn: Model<VehicleSpawnProp> = model('VehicleSpawn', VehicleSpawnSchema);