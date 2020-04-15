import { Player } from "../player/Player";
import { Item } from "../types";
import { VehicleSpawn } from "../db/schema";

interface ReturnInformation {
    result: boolean;
    info: string;
}

export class Car {
    static spawnCar(hash: string, position: Vector3Mp, rotation: Vector3Mp, color: number[], id:string ): VehicleMp {
        let veh: VehicleMp = mp.vehicles.new(mp.joaat(hash), position);
        const items: Item[] = [];

        if(!rotation.x) rotation.x = 0;
        if(!rotation.y) rotation.x = 0;
        if(!rotation.z) rotation.z = Car.random(1,360)
        
        
        color.map((n, i) => {
            if(!n) color[i] = Car.random(1,255)
        })

        veh.rotation = new mp.Vector3(rotation.x, rotation.y, rotation.z)
        veh.setColorRGB(color[0], color[1], color[2], color[3], color[4], color[5]);

        veh.setVariable('carInventory', items);
        veh.setVariable('isExplode', false);
        veh.setVariable('id', id)

        return veh;
    }
    
    // Добавляет объект машины в файл vehicleCoords.json.
    static saveCar(hash: string, position: Vector3Mp,rotation: Vector3Mp, color: number[], description?: string): ReturnInformation {
        const returnInformation: ReturnInformation = {
            info: '!{#DA3060} должно быть число',
            result: false
        };

        if(!rotation.x) rotation.x = 0;
        if(!rotation.y) rotation.x = 0;
        if(!rotation.z) rotation.z = Car.random(1,360)
        color.map((n, i) => {
            if(isNaN(n)) color[i] = Car.random(1,255)
        })
        if(!description) description = "Машина была добавлена без описания";

        let car = new VehicleSpawn({
            hash: hash,
            description: description,
            color: [color[0], color[1], color[2], color[3], color[4], color[5]],
            defaultPosition: {
                x: position.x,
                y: position.y,
                z: position.z,
            },
            savePosition: {
                x: position.x,
                y: position.y,
                z: position.z,
            },
            rotation: {
                x: rotation.x,
                y: rotation.y,
                z: rotation.z,
            }
        });
        Car.VehicleCreate(car)
        returnInformation.info = 'Машина успешно сохранена';
        returnInformation.result = true;
        return returnInformation
    }

    static updateCar(id: string, position: Vector3Mp,rotation: Vector3Mp, color: number[]) {
        VehicleSpawn.updateMany({'_id': id}, {$set: {savePosition: position, rotation: rotation, color: color}})
        .then(result => console.log(result))
        .catch(err => console.log(err))
    }

    // Функция возвращает рандомное число.
    static random(Minimal: number, Maximum: number): number {
        let random = Math.floor((Math.random() * Maximum) + Minimal);
        return random
    } 
    
    // Возвращает массив машин в 10 метрах
    static getCar(player: PlayerMp, distance:number) {
        const returnVehicles: any[] = [];

        mp.vehicles.forEachInRange(player.position, distance, (vehicle) => {
                returnVehicles.push(vehicle);
            }
        );
        return returnVehicles;
    };
    
    // Массив обьектов машин с ключами сортированными по дистанции от меньшего к большему
    static arrayCars(player: PlayerMp){
        let vehicles: any[] = [];
        let cars = Car.getCar(player, 10);

        cars.forEach((elem) => {
            vehicles.push({
                'distance' : player.dist(elem.position),
                'objCar' : elem
            })
        });

        vehicles.sort((a, b) => a.distance-b.distance)
        
        return vehicles;
    };
    static async VehicleCreate(vehicle) {
        await vehicle.save()
            .catch(error => console.log(error)) // Если ошибка есть, он её выведет.
            .then(result => console.log(result)) // Выводит результат, если ошибок нет.
    }
}