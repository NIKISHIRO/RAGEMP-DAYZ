import { ItemKey, Item, ItemRarity } from '../../types';
import { EItem } from './Item';

// Массив предметов из которых будет идти перебор для спавна.
const itemInfo: Item[] = [
    // WEAPON: itemKey | hash | ItemRarity | Name | Description | addSlots | weight | amount | isDelete | isCollision
    EItem.createWeaponItem(ItemKey.ITEM_WEAPON_AK47, 'w_ar_assaultrifle', ItemRarity.RARITY_1, 'AK-47', '...', 4, 1, false, true),
    EItem.createWeaponItem(ItemKey.ITEM_WEAPON_PUMP_SHOTGUN, 'w_sg_pumpshotgun', ItemRarity.RARITY_1, 'Pump Shotgun', '...', 4, 1, false, true),
    // CLOTHES: itemKey | hash | ItemRarity | Name | Description | addSlots | weight | defence | amount | isDelete | isCollision
    EItem.createBodyArmorItem(ItemKey.ITEM_ARMOR, 'prop_bodyarmour_02', ItemRarity.RARITY_1, 'Броня', '...', 8, 40, 1, false, false),
    // CLOTHES: itemKey | hash | ItemRarity | Name | Description | addSlots | weight | amount | componentId | drawable | isDelete | isCollision
    EItem.createClothesItem(ItemKey.ITEM_CLOTHES_MASK_1, 'prop_cs_box_clothes', ItemRarity.RARITY_1, 'Маска 1', 'Маска', 1, 1, 1, 1, 1, false, false),
    EItem.createClothesItem(ItemKey.ITEM_CLOTHES_MASK_2, 'prop_cs_box_clothes', ItemRarity.RARITY_2, 'Маска 2', 'Маска', 1, 1, 1, 1, 2, false, false),
    EItem.createClothesItem(ItemKey.ITEM_CLOTHES_MASK_3, 'prop_cs_box_clothes', ItemRarity.RARITY_2, 'Маска 3', 'Маска', 1, 1, 1, 1, 3, false, false),
    EItem.createClothesItem(ItemKey.ITEM_CLOTHES_MASK_4, 'prop_cs_box_clothes', ItemRarity.RARITY_3, 'Маска 4', 'Маска', 1, 1, 1, 1, 4, false, false),
    EItem.createClothesItem(ItemKey.ITEM_CLOTHES_MASK_5, 'prop_cs_box_clothes', ItemRarity.RARITY_4, 'Маска 5', 'Маска', 1, 1, 1, 1, 5, false, false),
    // COMMON: itemKey | hash | ItemRarity | Name | Description | weight | msc | amount | isDelete | isCollision
    EItem.createSimpleItem(ItemKey.ITEM_AMMO_SHOTGUN, 'w_sg_pumpshotgun', ItemRarity.RARITY_1, 'Shotgun Shell', 'Патроны на дробовик', .1, 30, 25, false, true),
    EItem.createSimpleItem(ItemKey.ITEM_AMMO_AK47, 'prop_box_ammo07b', ItemRarity.RARITY_2, 'AK47 AMMO', 'Патроны на AK47', .1, 30, 30, false, true),
];

export {
    itemInfo,
}