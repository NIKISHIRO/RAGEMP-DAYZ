import { ItemKey, Item, ItemRarity, ItemType } from '../../types';
import { WeaponItem, BodyArmorItem, ClothesItem, CommonItem } from './Item';

const itemInfo: Item[] = [
    new CommonItem(ItemKey.ITEM_AMMO_AK47, 30, ItemType.COMMON, ItemRarity.RARITY_2, 30, 'AK-47 Ammo', 'В калашик суешь...', 'prop_box_ammo07b', false, true),
    new CommonItem(ItemKey.ITEM_AMMO_SHOTGUN, 30, ItemType.COMMON, ItemRarity.RARITY_2, 30, 'SHOTGUN Shell', 'В шотганчик суешь...', 'w_sg_pumpshotgun', false, true),

    new WeaponItem(ItemKey.ITEM_WEAPON_AK47, 8, ItemRarity.RARITY_4, 1, 'AK-47', 'ЕБАЛО БИТЬ', 'w_ar_assaultrifle', false, true),
    new WeaponItem(ItemKey.ITEM_WEAPON_PUMP_SHOTGUN, 8, ItemRarity.RARITY_3, 1, 'SHOTGUN', 'ЕБАЛО БИТЬ 2', 'w_sg_pumpshotgun', false, true),

    new BodyArmorItem(ItemKey.ITEM_ARMOR, 1, ItemRarity.RARITY_3, 1, 'ARMOR', 'ЗАЩИЩАТЬ СВОЮ ДУШУ ОТ ГРЯЗИ', 'prop_bodyarmour_02', false, false),
    
    new ClothesItem(ItemKey.ITEM_CLOTHES_MASK_1, 1, ItemRarity.RARITY_1, 1, 'Одежда 1', 'ПИЗДАТО ВЫГЛЯДИШЬ ТЕПЕРЬ', 'prop_cs_box_clothes', true, false, 1, 1, 1),
    new ClothesItem(ItemKey.ITEM_CLOTHES_MASK_2, 1, ItemRarity.RARITY_1, 1, 'Одежда 1', 'ПИЗДАТО ВЫГЛЯДИШЬ ТЕПЕРЬ', 'prop_cs_box_clothes', true, false, 1, 1, 2),
    new ClothesItem(ItemKey.ITEM_CLOTHES_MASK_3, 1, ItemRarity.RARITY_1, 1, 'Одежда 1', 'ПИЗДАТО ВЫГЛЯДИШЬ ТЕПЕРЬ', 'prop_cs_box_clothes', true, false, 1, 1, 3),
    new ClothesItem(ItemKey.ITEM_CLOTHES_MASK_4, 1, ItemRarity.RARITY_1, 1, 'Одежда 1', 'ПИЗДАТО ВЫГЛЯДИШЬ ТЕПЕРЬ', 'prop_cs_box_clothes', true, false, 1, 1, 4),
    new ClothesItem(ItemKey.ITEM_CLOTHES_MASK_5, 1, ItemRarity.RARITY_1, 1, 'Одежда 1', 'ПИЗДАТО ВЫГЛЯДИШЬ ТЕПЕРЬ', 'prop_cs_box_clothes', true, false, 1, 1, 5),
];

export {
    itemInfo,
}