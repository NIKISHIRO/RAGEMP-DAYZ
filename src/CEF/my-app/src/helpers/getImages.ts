import img_item_weapon_ak47 from '../assets/items/item_weapon_ak47.png';
import img_item_armor from '../assets/items/item_armor.png';
import img_item_ammo_shotgun from '../assets/items/item_ammo_shotgun.png';
import item_clothes_mask_1 from '../assets/items/item_clothes_mask_1.jpg';
import item_clothes_mask_2 from '../assets/items/item_clothes_mask_2.jpg';
import item_clothes_mask_3 from '../assets/items/item_clothes_mask_3.jpg';
import item_clothes_mask_4 from '../assets/items/item_clothes_mask_4.jpg';
import item_clothes_mask_5 from '../assets/items/item_clothes_mask_5.jpg';
import { ItemKey } from '../types';

const images = {
    [ItemKey.ITEM_WEAPON_AK47]: img_item_weapon_ak47,
    [ItemKey.ITEM_ARMOR]: img_item_armor,
    [ItemKey.ITEM_AMMO_SHOTGUN]: img_item_ammo_shotgun,
    [ItemKey.ITEM_CLOTHES_MASK_1]: item_clothes_mask_1,
    [ItemKey.ITEM_CLOTHES_MASK_2]: item_clothes_mask_2,
    [ItemKey.ITEM_CLOTHES_MASK_3]: item_clothes_mask_3,
    [ItemKey.ITEM_CLOTHES_MASK_4]: item_clothes_mask_4,
    [ItemKey.ITEM_CLOTHES_MASK_5]: item_clothes_mask_5,
};

const getItemImage = (itemKey: ItemKey) => images[itemKey];

export {
    getItemImage,
}