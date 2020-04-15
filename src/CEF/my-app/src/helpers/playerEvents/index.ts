import { push } from 'connected-react-router'
import { emitter } from '../emitter';
import { Item } from '../../types';
import { setGroundItems, setInventorySlots } from '../../actions/inventoryActions';

function PlayerEvents(dispatch, getState) {
    emitter.on('goToHome', () => {
        dispatch(push('/'));
    });

    emitter.on('goToUi', () => {
        dispatch(push('/ui'));
    });

    emitter.on('eventSetGroundItems', (items: Item[]) => {
        dispatch(setGroundItems(items));
    });

    emitter.on('eventSetInventorySlots', (slots: number) => {
        dispatch(setInventorySlots(slots));
    });
}

export {
    PlayerEvents,
}