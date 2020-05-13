import { push } from 'connected-react-router';
import { emitter } from '../emitter';
import { Item } from '../../types';
import { setGroundItems, setInventorySlots, setInventoryItems } from '../../actions/inventoryActions';
import { enqueueSnackbar } from '../../actions/notificationActions';
import { NotifyOrigin } from '../../actions/notificationActions';
import { DisplayUI } from '../../reducers/UIReducer';
import { setDisplayUI } from '../../actions/displayUIActions';
import { setHudsData, HudType } from '../../actions/hudsDataActions';

function PlayerEvents(dispatch, getState) {
    emitter.on('goToClear', () => {
        dispatch(push('/clear'));
    });

    emitter.on('goToUIItems', () => {
        dispatch(push('/UIItems'));
    });

    emitter.on('goToEntityCreate', () => {
        dispatch(push('/goToEntityCreate'));
    });

    emitter.on('eventSetGroundItems', (items: Item[]) => {
        dispatch(setGroundItems(items));
    });

    emitter.on('cef_set_inventory_items', (items: Item[]) => {
        dispatch(setInventoryItems(items));
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
            setHudsData(HudType.SET_HEALTH_HUDS, health)
        );
    });

    emitter.on('cef_set_armor_huds', (armor: number) => {
        dispatch(
            setHudsData(HudType.SET_ARMOR_HUDS, armor)
        );
    });

    emitter.on('cef_set_hunger_huds', (hunger: number) => {
        dispatch(
            setHudsData(HudType.SET_HUNGER_HUDS, hunger)
        );
    });

    emitter.on('cef_set_dehydration_huds', (hunger: number) => {
        dispatch(
            setHudsData(HudType.SET_DEHYDRATION_HUDS, hunger)
        );
    });

    emitter.on('cef_set_inventory_weight', (weight: number) => {
        dispatch(
            setInventorySlots(weight)
        );
    });
}

export {
    PlayerEvents,
}