import {Car} from './Car';
import vehicleCoords from './vehicleCoords.json';

export interface VehicleCoord {
    hash: string; // RageEnums - в типах можно найти ЕНУМЫ для указания этого хэша.
    position: Vector3Mp;
    rotation?: Vector3Mp;
    color?: string;
    description?: string; // Описание, которое можно вывести потом через ф-ю.
}
mp.events.addCommand('pos',() => {
    Car.saveCar("g65amg", new mp.Vector3(111,111,111), new mp.Vector3(0,0,111), [255,255,255,0,0,0], 'spawn tachka');
})

mp.events.addCommand('sc', ()=>{
    vehicleCoords.forEach(car =>{
        Car.spawnCar(car.hash,new mp.Vector3(car.position.x,car.position.y,car.position.z), new mp.Vector3(car.rotation.x,car.rotation.y,car.rotation.z),[car.color[0],car.color[1],car.color[2],car.color[3],car.color[4],car.color[5]]);
    })
})



// Спавнит кар по хэшу.
// spawnCar(hash: RageEnums.Hashes.Vehicle, position: Vector3Mp, description?: string): void;

// Сохраняет машину в JSON-файл(vehicleCoords.json). Добавив его в массив того файла.
// saveCar(hash: RageEnums.Hashes.Vehicle, position: Vector3Mp, description?: string): void;

// Возвращает массив машин из JSON-файла.  
// loadCars(): cars: VehicleCoord[];

/* Можешь использовать приватные функции, логически вынося функционал в отдельные из них. Главное
чтобы на выходе были эти функции. */ 
