import './commands';
import './events';
import { Car } from './Car';

export interface VehicleCoord {
    hash: string; // RageEnums - в типах можно найти ЕНУМЫ для указания этого хэша.
    position: Vector3Mp;
    rotation?: Vector3Mp;
    color?: string;
    description?: string; // Описание, которое можно вывести потом через ф-ю.
}

const newCar: VehicleMp = Car.spawnCar('turismor', new mp.Vector3(111, 111, 111));


const items: Item[] = [
    {
        key: 'item_ak47Ammo',
        amount: 1
    }
];
newCar.setVariable('carInventory', items);