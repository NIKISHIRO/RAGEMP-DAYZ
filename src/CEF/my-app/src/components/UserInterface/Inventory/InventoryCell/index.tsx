import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Item } from "../../../../types";
import { getItemImage } from "../../../../helpers/getImages";
import { useDispatch, useSelector } from "react-redux";
import { setInventoryItems, splitInventoryItemByIndex, stackItems, setGroundItems } from "../../../../actions/inventoryActions";
import { UIState } from "../../../../reducers/UIReducer";
import { GiRapidshareArrow } from "react-icons/gi";
import { SelectedInventoryItem } from "../SelectedInventoryItem";
import { SelectedGroundItem } from "../SelectedGroundItem";
import { takeInventoryItemToServer } from "../../../../helpers/playerEvents/rpcCall";
import { enqueueSnackbar, NotifyVariant } from "../../../../actions/notificationActions";
import shortid from 'shortid';

type Props = {
    item: Item;
    id: number;
    isPopover?: boolean;
    isInventory?: boolean;
}

const InventoryCell = (props: Props) => {
    const { item, id, isInventory } = props;

    const UIState = useSelector((state: any): UIState => {
        return state.UI || [];
    });
    const dispatch = useDispatch();

    const { inventory, ground } = UIState;
    const { items } = inventory;
    const { items: groundItems } = ground;
    const itemImage = getItemImage(item.key);


    const [currentItem, setCurrentItem] = useState<Item | null>(null);
    const [anchorEl, setAnchorEl] = useState(null);

    let isStack = false;
    let currentInvItem;
    let nextItem;
    if (isInventory) {
        const currentInvItemIdx = items.findIndex(i => i === item);
        if (currentInvItemIdx !== -1) {
            currentInvItem = items[currentInvItemIdx];
            nextItem = items[currentInvItemIdx + 1];

            if (currentInvItem && nextItem) {
                if (currentInvItem.key === nextItem.key && currentInvItem.data.maxStackCount > 1) {
                    isStack = true;
                }
            }
        }
    }

    const onSelectItem = (item: Item, e: any) => {
        console.log('onSelectItem', item);
        setCurrentItem(item);
        setAnchorEl(e.currentTarget);
    };

    const onPopClose = () => {
        setCurrentItem(null);
        setAnchorEl(null);
    }

    const onMouseDown = async (event) => {
        // Клик правой кнопкой мыши на элемент в инвентаре.
        if (isInventory && event.button === 2) {
            if (item.amount <= 1) {
                return;
            }

            const idx = items.findIndex(i => i === item);

            if (idx === -1) {
                return;
            }

            dispatch(
                splitInventoryItemByIndex(idx, Math.floor(item.amount / 2))
            );
        } 
        // Клик правой кнопкой мыши на элемент на земле.
        else if (!isInventory && event.button === 2) {
            console.log('Взять макс число предметов.', item);
            // Взять максимальное количество предметов по клику на правую кнопку мыши.
            const serverResult = await takeInventoryItemToServer(item.data.serverId, item.amount);

            // Если удалить предмет с земли получилось - положить его в инвентарь.
            if (serverResult.result) {
                const idx = groundItems.findIndex(i => i === item);

                if (idx === -1) {
                    return;
                }

                const inventoryItems = [...items];
                const groundItem = JSON.parse(JSON.stringify(groundItems[idx]));
                const inventoryItem = JSON.parse(JSON.stringify(groundItem));
                
                inventoryItem.amount = item.amount;
                inventoryItems.unshift(inventoryItem);
                groundItems.splice(idx, 1);

                dispatch(setInventoryItems(inventoryItems));
                dispatch(setGroundItems(groundItems));
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
        }
        // Клик левой кнопкой мыши на элемент на земле.
        else if (!isInventory && event.button === 0) {
            console.log('Открыть контекстное меню.', item);
        }
    }

    const onStackClick = (event: any) => {
        event.stopPropagation();
        const currentItemIndex = items.findIndex(i => i === item);
        const nextItemIndex = items.findIndex(i => i === nextItem);
        console.log('currentItemIndex', currentItemIndex);
        console.log('nextItemIndex', nextItemIndex);
        dispatch(
            stackItems(currentItemIndex, nextItemIndex)
        );
    };

    return (
        <>
            { !!currentItem && isInventory && <SelectedInventoryItem onPopClose={ onPopClose } anchorEl={ anchorEl } item={ currentItem } /> }
            { !!currentItem && !isInventory && <SelectedGroundItem isInventory onPopClose={ onPopClose } anchorEl={ anchorEl } item={ currentItem } /> }

            <Draggable draggableId={ item.data.shortid } index={ id }>
                {(dragProvided, snapshot) => {
                    return (
                        <div
                            onClick={ (e) => onSelectItem(item, e) }
                            onMouseDown={ onMouseDown }
                        >
                            <div ref={ dragProvided.innerRef }>
                                <div 
                                    className=" inventory-cell"
                                    { ...dragProvided.draggableProps }
                                    { ...dragProvided.dragHandleProps }
                                >
                                    <div className="inventory-cell-image" >
                                        <img src={ itemImage } draggable={ false } />
                                    </div>
                                    <div className="inventory-cell-name">
                                        { item.data.name }
                                    </div>
                                    <div className="inventory-cell-amount">
                                        { `${item.amount}/${item.data.maxStackCount}` }
                                    </div>
                                    <div className="inventory-cell-weight">
                                        { (item.data.weight * item.amount).toFixed(1) }&nbsp;кг.
                                    </div>
                                    { isStack && <div className='isStack' onClick={ (e) => onStackClick(e) }><GiRapidshareArrow /></div> }
                                </div>
                            </div>
                        </div>
                    );
                }} 
            </Draggable>
        </>
    );
};

export {
    InventoryCell,
}