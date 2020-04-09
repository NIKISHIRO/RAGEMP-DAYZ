import { emitter } from '../helpers/emitter';
import { addInventoryItem } from '../actions/inventoryActions';
import { push } from 'connected-react-router'


function PlayerEvents(dispatch, getState) {
    emitter.on('goToHome', () => {
        dispatch(push('/'))
    });

    emitter.on('goToEquipment', () => {
        dispatch(push('/ui'))
    });

    emitter.on('addInventoryItem', (item: any) => {
        dispatch(addInventoryItem(item));
    });
}

export {
    PlayerEvents,
}