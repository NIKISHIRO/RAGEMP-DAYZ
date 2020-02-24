let fs = require('fs');
function Random(Minimal:number, Maximum:number) { // functinon random number
    let random = Math.floor((Math.random() * Maximum) + Minimal);
    return random;
}
export class Car {
    static spawnCar(hash: string, position: Vector3Mp,rotation?: Vector3Mp, color?: number[], description?: string): void {
        let veh = mp.vehicles.new(mp.joaat(hash), position);
        if(rotation) veh.rotation = rotation;
        else veh.rotation = new mp.Vector3(0, 0, Random(1,360))
        if(color) veh.setColorRGB(color[0],color[1],color[2],color[3],color[4],color[5]);
        else veh.setColorRGB(Random(1,255),Random(1,255),Random(1,255),Random(1,255),Random(1,255),Random(1,255));
    }
    static saveCar(hash: string, position: Vector3Mp, rotation?: Vector3Mp, color?: number[], description?: string): void {
        if(!rotation) rotation = new mp.Vector3(0,0,Random(1,360))
        if(!color) color = [Random(1,255),Random(1,255),Random(1,255),Random(1,255),Random(1,255),Random(1,255)];
        if(!description) description = "Машина была добавлена без описания"
        fs.readFile("src/server/project/DAYZ/carspawn/vehicleCoords.json", 'utf-8', (err:any, result:any) => {
            if(err) return console.log(err)
            let objFile = JSON.parse(result);
            console.log('old ==>'+objFile)
            objFile.push({"hash":hash,"position":position,"rotation":rotation,"color":color, "description": description})
            console.log('new ==>'+objFile)
            fs.writeFile("src/server/project/DAYZ/carspawn/vehicleCoords.json", JSON.stringify(objFile),(err:string) =>{
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
        })
    }
}
