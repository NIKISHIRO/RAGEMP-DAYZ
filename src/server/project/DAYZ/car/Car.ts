import { Player } from "../player/Player";
import { Item } from "../types";

let fs = require('fs');

export class Car {
    static spawnCar(hash: string, position: Vector3Mp, rotation?: Vector3Mp, color?: number[]): VehicleMp {
        let veh: VehicleMp = mp.vehicles.new(mp.joaat(hash), position);

        const items: Item[] = [];
        veh.setVariable('vehInventory', items);
        veh.getVariable('vehInventory');
        

        if (rotation) veh.rotation = rotation;
        else veh.rotation = new mp.Vector3(0, 0, Car.random(1,360))
        if(color) veh.setColorRGB(color[0],color[1],color[2],color[3],color[4],color[5]);
        else veh.setColorRGB(Car.random(1,255), Car.random(1,255), Car.random(1,255), Car.random(1,255), Car.random(1,255), Car.random(1,255));
        
        return veh;
    }

    // Добавляет объект машины в файл vehicleCoords.json.
    static saveCar(hash: string, position: Vector3Mp, rotation?: Vector3Mp, color?: number[], description?: string): void {
        if(!rotation) rotation = new mp.Vector3(Car.random(1,360), Car.random(1,360), 90)
        if(!color) color = [Car.random(1,255), Car.random(1,255), Car.random(1,255), Car.random(1,255), Car.random(1,255), Car.random(1,255)];
        if(!description) description = "Машина была добавлена без описания";
        
        const path: string = "src/server/project/DAYZ/car/vehicleCoords.json";
        fs.readFile(path, 'utf-8', (err: any, result: any) => {
            if(err) return console.log(err)
            let objFile = JSON.parse(result);
            
            objFile.push({hash, position, rotation, color, description});
            
            fs.writeFile(path, JSON.stringify(objFile, null, 2), (err: string) => {
                if(err) {
                    return console.log(err);
                }
                console.log(`Файл был сохранен: '${path}'`);
            });
        });
    }

    // Функция возвращает рандомное число.
    static random(Minimal: number, Maximum: number): number {
        let random = Math.floor((Math.random() * Maximum) + Minimal);
        return random
    } 
    
    // Возвращаем массив машин в 10 метрах
    static getCar(player: PlayerMp) {
        const returnVehicles: any[] = [];

        mp.vehicles.forEachInRange(player.position, 10, (vehicle) => {
                returnVehicles.push(vehicle);
            }
        );
        return returnVehicles;
    };
    
    // Массив обьектов машин с ключами сортированными по дистанции от меньшего к большему
    static arrayCars(player: PlayerMp){
        let vehicles: any[] = [];
        let cars = Car.getCar(player);

        cars.forEach((elem) => {
            vehicles.push({
                'distance' : player.dist(elem.position),
                'objCar' : elem
            })
        });

        vehicles.sort((a, b) => a.distance-b.distance)
        
        return vehicles;
    }
    static putItem(player:PlayerMp ,vehicle:VehicleMp, index: number){
        const carInventory = vehicle.getVariable('carInventory');
        const playerInventory: Item[] = player.getInventory();
        if(!playerInventory || !playerInventory[index]){
            return player.outputChatBox('У вас нет такого предмета в инвентаре')
        }
        const itemKey = playerInventory[index].key;

        playerInventory.forEach(item => {
            if(item.key === itemKey){
                carInventory.push(item);
                vehicle.setVariable('carInventory',carInventory)
                player.removeItem(player.getItemIndex(itemKey), 1)
            }
        })
    }

    static takeItem(vehicle: VehicleMp) {
        
    }
}