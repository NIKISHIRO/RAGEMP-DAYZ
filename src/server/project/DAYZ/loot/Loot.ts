/*
    Лут - класс, который создает на указаных коорд. точку.
    У игрока вставшего на "точку" должна появиться возможность взять лут с этой точки.
*/
export class Loot {
    // Объект колшипа.
    private shape: ColshapeMp;

    // ИД колшипа.
    private _shapeId: number;

    constructor() {
    }

    public setShape(x: number, y: number, z: number, range: number) {
        console.log(' -> setShape');
        this.shape = mp.colshapes.newSphere(x, y, z, range);
        this._shapeId = this.shape.id;
    }

    public set shapeId(value: number) {
        console.log(' -> set shapeId');
        this.shapeId = value;
    }

    public get shapeId() {
        console.log(' -> get shapeId');
        return this._shapeId;
    }

    
}


