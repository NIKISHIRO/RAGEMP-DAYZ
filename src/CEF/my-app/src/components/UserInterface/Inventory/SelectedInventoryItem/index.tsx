import React from "react";
import { Item } from "../../../../types";
import { Popover } from '@material-ui/core';
import { TabSplitComponent } from "./TabSplitComponent";
import { useToggle } from "@umijs/hooks";
import { dropInventoryItemToServer, usesInventoryItemByServerId } from "../../../../helpers/playerEvents/rpcCall";
import { useDispatch, useSelector } from "react-redux";
import { SET_INVENTORY_ITEMS, SET_GROUND_ITEMS, deleteInventoryItemById } from "../../../../actions/inventoryActions";
import { UIState } from "../../../../reducers/UIReducer";
import shortid from 'shortid';
import { enqueueSnackbar, NotifyVariant } from "../../../../actions/notificationActions";
const shortString = '__groundCells';

type Props = {
    anchorEl: any;
    item: Item;
    onPopClose: () => any;
}

function SelectedInventoryItem(props: Props) {
    const { item, anchorEl, onPopClose } = props;
    const { state, toggle } = useToggle(0);
    const dispatch = useDispatch();
    const store = useSelector((state: any): UIState => {
        return state.UI || [];
    });

    function Tab1() {
        const onDropItem = async () => {
            const serverResult = await dropInventoryItemToServer(item.key, item.amount);
            
            if (serverResult.result) {
                console.log('onDropItem', item);
                const inventoryItems = [...store.inventory.items];
                const groundItems = [...store.ground.items];
                const idx = store.inventory.items.findIndex(i => i === item);

                if (idx !== -1) {
                    const newItem = {...item};
                    newItem.data.shortid = `${shortString}${shortid.generate()}`;
                    inventoryItems.splice(idx, 1);
                    groundItems.unshift(newItem);

                    dispatch({
                        type: SET_INVENTORY_ITEMS,
                        payload: inventoryItems
                    });
    
                    dispatch({
                        type: SET_GROUND_ITEMS,
                        payload: groundItems
                    });
                }
            }
        };

        const onUsesItem = async () => {
            const serverResult = await usesInventoryItemByServerId(item.data.serverId);

            // Если получилось использовать предмет, то удалить если нужно.
            if (serverResult.result) {
                const inventoryItems = [...store.inventory.items];
                const idx = inventoryItems.findIndex(i => i === item);

                if (item.data.isDelete) {
                    dispatch(
                        deleteInventoryItemById(idx)
                    );
                }
            }

            dispatch(
                enqueueSnackbar({
                    message: serverResult.text,
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: serverResult.result ? NotifyVariant.DEFAULT : NotifyVariant.ERROR,
                            anchorOrigin: {
                                horizontal: 'center',
                                vertical: 'bottom',
                            }
                    },
                })
            );
        };

        return (
            <div className='popover-select-tab'>
                <div onClick={ () => toggle(2) }>Инфо.</div>
                <div onClick={ onUsesItem }>Использовать</div>
                <div onClick={ () => toggle(1) }>Разделить</div>
                <div onClick={ onDropItem }>Выбросить</div>
            </div>
        );
    }
    
    function Tab2() {
        return (
            <div className='cell-popover-content cell-popover-content-tab2'>
                <div className="cell-popover-content__data">
                    <strong>
                        { item.data.name } (&nbsp;{ item.amount }&nbsp;)
                    </strong>
                </div>
                <div className="cell-popover-content__change-data">
                    <TabSplitComponent isInventory onPopClose={ onPopClose } item={ item } />
                </div>
            </div>
        );
    }

    function Tab3() {
        return (
            <div className='cell-popover-content cell-popover-content-tab3'>
                <div className="cell-popover-content__change-data">
                    <div>Название: { item.data.name }</div>
                    <div>Кол-во: { item.amount }</div>
                    <div>Макс. стак: { item.data.maxStackCount }</div>
                    <div>вес 1 шт.: { item.data.weight }</div>
                    <div>Описание: { item.data.description }</div>
                    <div>Тип: { item.data.type }</div>
                </div>
            </div>
        );
    }

    return (
        <Popover
            classes={ { root: 'rootOverridePopover', paper: 'paperOverridePopover' } }
            id={ 'cell-popover' }
            open={ !!anchorEl }
            anchorEl={ anchorEl }
            onClose={ onPopClose }
            anchorOrigin={{
                vertical: "top",
                horizontal: "left"
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "left"
            }}
        >
            <div className="cell-popover">
                { state === 0 && <Tab1 /> }
                { state === 1 && <Tab2 /> }
                { state === 2 && <Tab3 /> }
            </div>
        </Popover>
    );
};

export {
    SelectedInventoryItem,
}