
import { logger } from "../shared/logger";

export interface ReturnInformation {
    result: boolean;
    info: string;
}

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
    public getItemListByIndex(id: number) {
        if (isNaN(id) || !Number.isInteger(id)) return false;

        const colshapes: ColshapeMp[] = this.getLootShapes();

        if (!colshapes[id]) {
            return false;
        }
        
        const itemList: Item[] = colshapes[id].getVariable('itemList');
        return itemList;
    }

    // cellId - Индекс элемента в itemPoints игрока для получения колшипа.
    // itemId - Индекс предмета в itemList полученного колшипа.
    public getItem(cellId: number, itemId: number) {
        const itemList = this.getItemListByIndex(cellId);

        if (!itemList) return false;

        const item: Item = itemList[itemId];
        return item;
    }

    // Из itemPoints берет itemList из колшипа под индексом = cellId 
    // и берет из массива itemList предмет под индексом itemId
    public takeItem(cellId: number, itemId: number): ReturnInformation {
        const returnInformation = {
            info: '!{#DA3060}Такого предмета или точки здесь нет!',
            result: false
        };

        const item = this.getItem(cellId, itemId);
        
        if (item) {
            const colshapes: ColshapeMp[] = this.getLootShapes();
            const colshape: ColshapeMp = colshapes[cellId];
            const itemPoints: number[] = this.getItemPoints();
            const itemListOrFalse = this.getItemListByIndex(cellId);

            // Проверка - находится ли игрок в пределах колшипа.
            if (!colshape.isPointWithin(this.player.position)) {
                returnInformation.info = '!{#DA3060}Поблизости нет точки с лутом';
                returnInformation.result = false;
                return returnInformation;
            }

            // Если у игрока есть такой колшип, удалить его ид из массива
            // и сам колшип с карты.
            const idx = itemPoints.findIndex(i => i === colshape.id);
            if (idx !== -1) {
                // Если массив предметов в колшипе больше нуля, удалить выбранный предмет.
                if (itemListOrFalse && itemListOrFalse.length > 0) {
                    itemListOrFalse.splice(itemId, 1);
                    colshape.setVariable('itemList', itemListOrFalse);
                    
                    returnInformation.info = `Предмет был удален из этой точки. Осталось всего: ${itemListOrFalse.length} предметов.`;
                    returnInformation.result = true;
                }
                // Если массив пуст, то удалить сам колшип.
                if (itemListOrFalse && !itemListOrFalse.length) {
                    // itemPoints.splice(idx, 1);
                    this.player.setVariable('itemPoints', itemPoints);

                    mp.players.forEach(p => {
                        const itemPoints = p.getVariable('itemPoints');
                        
                        if (itemPoints.length) {
                            const idx = itemPoints.findIndex(id => id === colshape.id);
                            
                            if (idx !== -1) {
                                itemPoints.splice(idx, 1);
                                p.setVariable('itemPoints', itemPoints);
                            }   
                        }
                    });

                    colshape.destroy();
                    
                    returnInformation.info = `Эта точка была удалена.`;
                    returnInformation.result = true;
                }

                this.player.giveItem(item.key, item.amount, item.data);          
            }
        }

        return returnInformation;
    }
}