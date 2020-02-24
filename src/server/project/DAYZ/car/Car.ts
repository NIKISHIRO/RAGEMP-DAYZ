let fs = require('fs');

export class Car {
    static spawnCar(hash: string, position: Vector3Mp, rotation?: Vector3Mp, color?: number[]): VehicleMp {
        let veh: VehicleMp = mp.vehicles.new(mp.joaat(hash), position);

        if (rotation) veh.rotation = rotation;
        else veh.rotation = new mp.Vector3(0, 0, Car.random(1,360))
        if(color) veh.setColorRGB(color[0],color[1],color[2],color[3],color[4],color[5]);
        else veh.setColorRGB(Car.random(1,255), Car.random(1,255), Car.random(1,255), Car.random(1,255), Car.random(1,255), Car.random(1,255));
        
        return veh;
    }

    // Добавляет объект машины в файл vehicleCoords.json.
    static saveCar(hash: string, position: Vector3Mp, rotation?: Vector3Mp, color?: number[], description?: string): void {
        if(!rotation) rotation = new mp.Vector3(0, 0, Car.random(1,360))
        if(!color) color = [Car.random(1,255), Car.random(1,255), Car.random(1,255), Car.random(1,255), Car.random(1,255), Car.random(1,255)];
        if(!description) description = "Машина была добавлена без описания";
        
        const path: string = "src/server/project/DAYZ/carspawn/vehicleCoords.json";
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
        return random;
    }    
}