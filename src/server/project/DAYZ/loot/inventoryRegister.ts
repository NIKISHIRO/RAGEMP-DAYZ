import { invAPI } from "./inventoryEvents";
import { ItemKey } from "../types";
import { 
    armorHandler, ammoShotgunHandler, weaponAK47Handler, clothesHandler
} from "./inventoryHandlers";

// Регистрация предметов.
invAPI.addItem(ItemKey.ITEM_ARMOR, "Бронежелет", "Военный бронежелет.", armorHandler);
invAPI.addItem(ItemKey.ITEM_AMMO_SHOTGUN, "Shotgun SHELL", "Патроны на дробовик", ammoShotgunHandler);
invAPI.addItem(ItemKey.ITEM_WEAPON_AK47, "AK-47", "Калаш", weaponAK47Handler);
invAPI.addItem(ItemKey.ITEM_CLOTHES_MASK_1, 'Маска_1', 'Одежда с ИД = 1', clothesHandler);
invAPI.addItem(ItemKey.ITEM_CLOTHES_MASK_2, 'Маска_2', 'Одежда с ИД = 2', clothesHandler);
invAPI.addItem(ItemKey.ITEM_CLOTHES_MASK_3, 'Маска_3', 'Одежда с ИД = 3', clothesHandler);
invAPI.addItem(ItemKey.ITEM_CLOTHES_MASK_4, 'Маска_4', 'Одежда с ИД = 4', clothesHandler);
invAPI.addItem(ItemKey.ITEM_CLOTHES_MASK_5, 'Маска_5', 'Одежда с ИД = 5', clothesHandler);