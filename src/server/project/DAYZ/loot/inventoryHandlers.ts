import { ClothesData, WeaponData, ItemData } from "../types";
import { Player } from "../player/Player";

function armorHandler(player, inventoryIndex, itemKey, data) {
    player.armour = 70;
    player.outputChatBox("Вы надели бронежелет.");

    data.isDelete && player.removeItem(inventoryIndex);
};

function ammoShotgunHandler(player: PlayerMp, inventoryIndex: number, itemKey: string, data: ItemData) {
    player.armour = 100;
    player.outputChatBox("Armor refilled.");

    data.isDelete && player.removeItem(inventoryIndex);
}

function weaponAK47Handler(player: PlayerMp, inventoryIndex: number, itemKey: string, data: WeaponData) {
    data.isDelete && player.removeItem(inventoryIndex);
}

function clothesHandler(player: PlayerMp, inventoryIndex: number, itemKey: string, data: ClothesData) {
    player.changeClothes(data.componentId, data.drawable, 1, true);
        
    const plr = new Player(player);
    plr.addInventorySlots(data.addSlots);

    data.isDelete && player.removeItem(inventoryIndex);
}

export {
    armorHandler,
    ammoShotgunHandler,
    weaponAK47Handler,
    clothesHandler,
}