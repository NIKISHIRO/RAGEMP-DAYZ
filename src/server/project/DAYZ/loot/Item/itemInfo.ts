import { ItemKey, Item, ItemRarity } from '../../types';
import { EItem } from './Item';

// Массив предметов из которых будет идти перебор для спавна.
const itemInfo: Item[] = [
    // WEAPON: itemKey | ItemRarity | Name | Description | addSlots | weight | amount | isDelete
    EItem.createWeaponItem(ItemKey.ITEM_WEAPON_AK47, ItemRarity.RARITY_1, 'Калаш', 'Пусто.', 4, 1, false),
    // ARMOR
    EItem.createBodyArmorItem(ItemKey.ITEM_ARMOR, ItemRarity.RARITY_1, 'Броня', 'Пустое описание.', 8, 40, 1, false),
    // CLOTHES: itemKey | ItemRarity | Name | Description | addSlots | weight | amount | componentId | drawable | isDelete
    EItem.createClothesItem(ItemKey.ITEM_CLOTHES_MASK_1, ItemRarity.RARITY_1, 'Маска 1', 'Маска', 1, 1, 1, 1, 1, false),
    EItem.createClothesItem(ItemKey.ITEM_CLOTHES_MASK_2, ItemRarity.RARITY_2, 'Маска 2', 'Маска', 1, 1, 1, 1, 2, false),
    EItem.createClothesItem(ItemKey.ITEM_CLOTHES_MASK_3, ItemRarity.RARITY_2, 'Маска 3', 'Маска', 1, 1, 1, 1, 3, false),
    EItem.createClothesItem(ItemKey.ITEM_CLOTHES_MASK_4, ItemRarity.RARITY_3, 'Маска 4', 'Маска', 1, 1, 1, 1, 4, false),
    EItem.createClothesItem(ItemKey.ITEM_CLOTHES_MASK_5, ItemRarity.RARITY_4, 'Маска 5', 'Маска', 1, 1, 1, 1, 5, false),
    // COMMON: itemKey | ItemRarity | Name | Description | weight | msc | amount | isDelete
    EItem.createSimpleItem(ItemKey.ITEM_AMMO_SHOTGUN, ItemRarity.RARITY_1, 'Shotgun Shell', 'Патроны на дробовик', .1, 30, 25, false),
    EItem.createSimpleItem(ItemKey.ITEM_AMMO_AK47, ItemRarity.RARITY_2, 'AK47 AMMO', 'Патроны на AK47', .1, 30, 30, false),
];

export {
    itemInfo,
}