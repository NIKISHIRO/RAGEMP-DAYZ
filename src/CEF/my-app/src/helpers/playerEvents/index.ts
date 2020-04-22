import { push } from 'connected-react-router';
import { emitter } from '../emitter';
import { Item } from '../../types';
import { setGroundItems, setInventorySlots } from '../../actions/inventoryActions';
import { enqueueSnackbar } from '../../actions/notificationActions';
import { NotifyOrigin } from '../../actions/notificationActions';
import { DisplayUI } from '../../reducers/UIReducer';
import { setDisplayUI } from '../../actions/displayUIActions';
import { setHealthHudsData } from '../../actions/hudsDataActions';

function PlayerEvents(dispatch, getState) {
    emitter.on('goToClear', () => {
        dispatch(push('/clear'));
    });

    emitter.on('goToUIItems', () => {
        dispatch(push('/UIItems'));
    });

    emitter.on('eventSetGroundItems', (items: Item[]) => {
        dispatch(setGroundItems(items));
    });

    emitter.on('eventSetInventorySlots', (slots: number) => {
        dispatch(setInventorySlots(slots));
    });

    emitter.on('setNotify', (msg: string, variant: string, origin: NotifyOrigin) => {
        dispatch(enqueueSnackbar({
            message: msg,
            options: {
                key: new Date().getTime() + Math.random(),
                variant: variant,
                anchorOrigin: {
                    vertical: origin.vertical,
                    horizontal: origin.horizontal,
                },
            },
        }));
    });

    emitter.on('cef_set_display_ui', (displayUI: DisplayUI) => {
        dispatch(setDisplayUI(displayUI));
    });

    emitter.on('change_UI', (name: string) => {
        dispatch(push(`/${name}`));
    });

    emitter.on('cef_set_health_huds', (health: number) => {
        dispatch(
            setHealthHudsData(health)
        );
    });
}

export {
    PlayerEvents,
}