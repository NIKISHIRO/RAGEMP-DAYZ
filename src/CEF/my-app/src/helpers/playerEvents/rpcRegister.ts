import rpc from 'rage-rpc';
import { eventSetGroundItems, eventSetInventorySlots } from './events/eventSetGroundItems';
import { Item } from '../../types';

const rpcRegister = () => {
    console.log(' ---> rpcRegister');

    rpc.register('cef_set_ground_items', (data: Item[]) => {
        console.log('ОН ДОШЕЛ ДО ЦЕФА. data', data);
        console.log(JSON.stringify(data));
        eventSetGroundItems(data);
    });

    rpc.register('cef_set_inventory_slots', (slots: number) => {
        eventSetInventorySlots(slots);
    });

    rpc.register('cef_display_ui', (name: string) => {
        
    });
};

export {
    rpcRegister,
}