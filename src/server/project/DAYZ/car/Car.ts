import { Player } from "../player/Player";
import { ReturnInformation } from "project/interfaces";

let fs = require('fs');

export class Car {
    static spawnCar(hash: string, position: Vector3Mp, rotation?: Vector3Mp, color?: number[]): VehicleMp {
        let veh: VehicleMp = mp.vehicles.new(mp.joaat(hash), position);

        const items: Item[] = [];

        if (rotation) veh.rotation = rotation;
        else veh.rotation = new mp.Vector3(0, 0, Car.random(1,360))
        if(color) veh.setColorRGB(color[0],color[1],color[2],color[3],color[4],color[5]);
        else veh.setColorRGB(Car.random(1,255), Car.random(1,255), Car.random(1,255), Car.random(1,255), Car.random(1,255), Car.random(1,255));

        veh.setVariable('carInventory', items);

        return veh;
    }

    // Добавляет объект машины в файл vehicleCoords.json.
    static saveCar(hash: string, position: Vector3Mp, description?: string): ReturnInformation {
        const returnInformation: ReturnInformation = {
            info: '!{#DA3060} должно быть число',
            result: false
        };

        if(!description) description = "Машина была добавлена без описания";

        const path: string = "src/server/project/DAYZ/car/vehicleCoords.json";

        fs.readFile(path, 'utf-8', (err: any, result: any) => {
            if(err) return console.log(err)
            let objFile = JSON.parse(result);
            
            objFile.push({hash, position, description});
            
            fs.writeFile(path, JSON.stringify(objFile, null, 2), (err: string) => {
                if(err) {
                    return console.log(err);
                }
                console.log(`Файл был сохранен: '${path}'`);
            });
        });
        returnInformation.info = 'Машина успешно сохранена';
        returnInformation.result = true;
        return returnInformation
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
}