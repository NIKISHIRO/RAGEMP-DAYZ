import { Item } from "../types";
import { VehicleData} from "../types";
import { postgres } from "../db";

export class Car {
    static async spawnCar(id?:number){
        let data
        if(!id){
            data = await postgres<VehicleData>('vehiclespawn').select('*');
        }else{
            data = await postgres<VehicleData>('vehiclespawn').select('*').where({id:id});
        }
        data.map(car => {
            console.log(car)
            const pos = new mp.Vector3(car.defaultposition.x,car.defaultposition.y,car.defaultposition.z);
            let veh: VehicleMp = mp.vehicles.new(mp.joaat(car.hash), pos);
            const items: Item[] = [];

            if(!car.rotation.x) car.rotation.x = 0;
            if(!car.rotation.y) car.rotation.x = 0;
            if(!car.rotation.z) car.rotation.z = Car.random(1,360)
            car.color.map((n, i) => {
                    if(!n) car.color[i] = Car.random(1,255);
            });

            veh.rotation = new mp.Vector3(car.rotation.x, car.rotation.y, car.rotation.z)
            veh.setColorRGB(car.color[0], car.color[1], car.color[2], car.color[3], car.color[4], car.color[5]);

            veh.setVariable('lootItems', items);
            veh.setVariable('isExplode', false);
            veh.setVariable('id', car.id)
        })
    }
    
    // Добавляет объект машины в файл vehicleCoords.json.
    static async saveCar(player: PlayerMp, hash: string, position: Vector3Mp,rotation: Vector3Mp, color: number[], description?: string){

        if(!rotation.x) rotation.x = 0;
        if(!rotation.y) rotation.x = 0;
        if(!rotation.z) rotation.z = Car.random(1,360)
        color.map((n, i) => {
            if(isNaN(n)) color[i] = Car.random(1,255)
        })
        if(!description) description = "Машина была добавлена без описания";

        await postgres<VehicleData>('vehiclespawn').insert({ 
            hash: hash,
            description: description,
            color: [color[0], color[1], color[2], color[3], color[4], color[5]],
            defaultposition: {
                x: position.x,
                y: position.y,
                z: position.z,
            },
            saveposition: {
                x: position.x,
                y: position.y,
                z: position.z,
            },
            rotation: {
                x: rotation.x,
                y: rotation.y,
                z: rotation.z,
            },
            isExplode: false
        });
        player.outputChatBox('Машина успешно сохранена')
    }

    static async updateCar(id: string, position: Vector3Mp,rotation: Vector3Mp, color: number[]) {
        await postgres<VehicleData>('vehiclespawn')
        .update({saveposition:position, rotation:rotation, color:color})
        .where({ id:parseInt(id)})
    }

    // Функция возвращает рандомное число.
    static random(Minimal: number, Maximum: number): number {
        let random = Math.floor((Math.random() * Maximum) + Minimal);
        return random
    } 

    static async respawnVehicle(id: number){
        const car = await postgres<VehicleData>('vehiclespawn')
            .select('*')
            .where({id: id});
            Car.spawnCar(id)
            await postgres<VehicleData>('vehiclespawn')
            .update({saveposition:car[0].defaultposition})
            .where({id: id})
    }
}