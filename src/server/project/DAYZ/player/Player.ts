import { logger } from "../shared/logger";

export class Player {
    private player: PlayerMp;

    constructor(player: PlayerMp) {
        this.player = player;
    }
    
    public getItemPoints(): number[] {
        return this.player.getVariable('itemPoints');
    }

    // Добавляет ИД колшипа в itemPoints.
    public addItemPoint(shapeId: number) {
        const itemPoints = this.player.getVariable('itemPoints');
        itemPoints.push(shapeId);
        this.player.setVariable('itemPoints', itemPoints);
    }

    public removeItemPoint(shapeId: number) {
        const itemPoints = this.getItemPoints();
        const idx = itemPoints.findIndex(idx => shapeId === idx);

        console.log('removeitempoint -> idx', idx);

        if (idx === -1) return;

        itemPoints.splice(idx, 1);
        this.player.setVariable('itemPoints', itemPoints);
    }

    // Устанавливает массив ИДОВ колшипов.
    public setItemPoints(shapeIds: number[]) {
        this.player.setVariable('itemPoints', shapeIds);
    }

    // Возвращает массив колшипов вокруг игрока.
    public getLootShapes(): ColshapeMp[] {
        const itemPoints: number[] = this.getItemPoints();
        return itemPoints.map(shapeId => mp.colshapes.at(shapeId));
    }
}