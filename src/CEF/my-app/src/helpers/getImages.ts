import img_item_weapon_ak47 from '../assets/items/item_weapon_ak47.png';
import img_item_armor from '../assets/items/item_armor.png';
import img_item_ammo_shotgun from '../assets/items/item_ammo_shotgun.png';
import { ItemKey } from '../types';

const images = {
    [ItemKey.ITEM_WEAPON_AK47]: img_item_weapon_ak47,
    [ItemKey.ITEM_ARMOR]: img_item_armor,
    [ItemKey.ITEM_AMMO_SHOTGUN]: img_item_ammo_shotgun,
};

const getItemImage = (itemKey: ItemKey) => images[itemKey];

export {
    getItemImage,
}