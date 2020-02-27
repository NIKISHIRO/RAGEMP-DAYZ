import './commands';
import './events';

export interface VehicleCoord {
    hash: string; // RageEnums - в типах можно найти ЕНУМЫ для указания этого хэша.
    position: Vector3Mp;
    rotation?: Vector3Mp;
    color?: string;
    description?: string; // Описание, которое можно вывести потом через ф-ю.
}
export interface vehicle {
    inventory: number[],
    distance: Float32Array,
    obj: object
}
