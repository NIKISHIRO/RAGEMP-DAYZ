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

    // return: Item[] || FALSE. Получает itemList колшипа по ИД в массиве "доступных точек"(itemPoints) игрока.
    public getItemListById(id: number) {
        if (isNaN(id) || !Number.isInteger(id)) return false;

        const lootShapes: ColshapeMp[] = this.getLootShapes();

        if (!lootShapes[id]) {
            return false;
        }
        
        const itemList: Item[] = lootShapes[id].getVariable('itemList');
        return itemList;
    }

    // cellId - Индекс элемента в itemPoints игрока для получения колшипа.
    // itemId - Индекс предмета в itemList полученного колшипа.
    public getItem(cellId: number, itemId: number) {
        console.log('getItem');
        const itemList = this.getItemListById(cellId);

        if (!itemList) return;

        const item: Item = itemList[itemId];
        console.log('getItem -> item', item);
    }
}