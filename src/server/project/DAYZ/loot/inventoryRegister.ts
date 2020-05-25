import { ItemKey } from "../types";
import { itemAPI } from "./inventoryEvents";
import { 
    armorHandler, ammoShotgunHandler, weaponAK47Handler, clothesHandler
} from "./inventoryHandlers";

// Регистрация предметов.
itemAPI.addItem(ItemKey.ITEM_ARMOR, "Бронежелет", "Военный бронежелет.", armorHandler);
itemAPI.addItem(ItemKey.ITEM_WEAPON_PUMP_SHOTGUN, "Pump Shotgun", "Дробовик", ammoShotgunHandler);
itemAPI.addItem(ItemKey.ITEM_AMMO_SHOTGUN, "Shotgun SHELL", "Патроны на дробовик", ammoShotgunHandler);
itemAPI.addItem(ItemKey.ITEM_AMMO_AK47, "AK-47 AMMO", "Патроны на калаш", ammoShotgunHandler);
itemAPI.addItem(ItemKey.ITEM_WEAPON_AK47, "AK-47 AMMO", "Патроны на калаш", weaponAK47Handler);
itemAPI.addItem(ItemKey.ITEM_CLOTHES_MASK_1, 'Маска_1', 'Одежда с ИД = 1', clothesHandler);
itemAPI.addItem(ItemKey.ITEM_CLOTHES_MASK_2, 'Маска_2', 'Одежда с ИД = 2', clothesHandler);
itemAPI.addItem(ItemKey.ITEM_CLOTHES_MASK_3, 'Маска_3', 'Одежда с ИД = 3', clothesHandler);
itemAPI.addItem(ItemKey.ITEM_CLOTHES_MASK_4, 'Маска_4', 'Одежда с ИД = 4', clothesHandler);
itemAPI.addItem(ItemKey.ITEM_CLOTHES_MASK_5, 'Маска_5', 'Одежда с ИД = 5', clothesHandler);