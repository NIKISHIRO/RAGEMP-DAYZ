import { register } from 'rage-rpc';
import { Item } from '../../types';
import { NotifyOrigin } from '../../actions/notificationActions';
import { DisplayUI } from '../../reducers/UIReducer';
import { emitter } from '../emitter';

type NotifyData = {
    text: string; 
    variant: string; 
    origin: NotifyOrigin;
};

function rpcRegister() {
    register('cef_set_ground_items', (items: Item[]) => {
        emitter.emit('eventSetGroundItems', items);
    });

    register('cef_set_inventory_items', (items: Item[]) => {
        emitter.emit('cef_set_inventory_items', items);
    });

    register('cef_set_inventory_slots', (slots: number) => {
        emitter.emit('eventSetInventorySlots', slots);
    });

    register('cef_set_notify', (data: NotifyData) => {
        console.log('----------------------------------');
        console.log('----------------------------------');
        console.log(data);
        emitter.emit('setNotify', data.text, data.variant, data.origin);
    });

    register('cef_set_display_ui', (displayUI: DisplayUI) => {
        emitter.emit('cef_set_display_ui', displayUI);
    });
    
    register('cef_change_UI', (name: string) => {
        emitter.emit('change_UI', name);
    });

    register('cef_set_health_huds', (health: number) => {
        emitter.emit('cef_set_health_huds', health);
    });

    register('cef_set_armor_huds', (armor: number) => {
        emitter.emit('cef_set_armor_huds', armor);
    });

    register('cef_set_hunger_huds', (hunger: number) => {
        emitter.emit('cef_set_hunger_huds', hunger);
    });

    register('cef_set_dehydration_huds', (hunger: number) => {
        emitter.emit('cef_set_dehydration_huds', hunger);
    });

    register('cef_set_inventory_weight', (weight: number) => {
        emitter.emit('cef_set_inventory_weight', weight);
    });
};

export {
    rpcRegister,
}