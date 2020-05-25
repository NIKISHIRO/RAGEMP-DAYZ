import React, { Ref } from "react";
import '../inventory.css';
import { Item, ItemType } from "../../../types";
import { useDrop, useDrag } from "react-dnd";
import { Preview } from "../Preview";
import { getItemImage } from "../../../helpers/getImages";
import { useDispatch, useSelector } from "react-redux";
import { swapItems, swapInvAndGroundItems } from "../../../actions/inventoryActions";
import { dropInventoryItemToServer, takeInventoryItemToServer } from "../../../helpers/playerEvents/rpcCall";
import { State } from "../../../reducers";
import { enqueueSnackbar, NotifyVariant, Notify } from "../../../actions/notificationActions";
import { Snackbar } from "@material-ui/core";

type Props = {
    item: Item | null;
    id: number;
    itemsType: 'inventoryItems' | 'groundItems'
};

function InventoryCell(props: Props) {
    const { item } = props;

    const dispatch = useDispatch();
    const state = useSelector((state: State) => state || []);

    const imgSize = 3.83;
    const decrementSize = .2;

    const [{ isDragging }, dragRef] = useDrag({
        item: {
            type: props.itemsType,
            src: item ? getItemImage(item.key) : null, imgSize: `${imgSize - (decrementSize * 2)}rem`,
            id: props.id,
            amount: item?.amount,
        },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging(),
        }),
    });
    
    const onDrop = async (item, monitor) => {
        const dropIdx = props.id;
        const dragIdx = item.id;

        const dropType = props.itemsType; // Тип элемента КУДА ПЕРЕТАЩИЛИ ПРЕДМЕТ.
        const dragType = item.type; // Тип элемента КОТОРЫЙ ПЕРЕТАЩИЛИ.

        // Перенос с 1 зоны на другую.
        if (dropType != dragType) {
            let invId = -1;
            let groundId = -1;

            // Перенос с Инвентаря на Землю.
            if (dragType == 'inventoryItems') {
                invId = dragIdx;
                groundId = dropIdx;

                const items = [...state.inventory.inventoryItems]
                const invItem = items[invId];
                
                if (invItem) {
                    const serverResult = await dropInventoryItemToServer(invItem.key, invItem.amount, groundId);
                    if (serverResult.result) {
                        dispatch(swapInvAndGroundItems(invId, groundId));
                    }

                    dispatch(Notify(serverResult.text, serverResult.result ? NotifyVariant.SUCCESS : NotifyVariant.ERROR, 'center', 'bottom'));
                    return;
                }
            }

            // Перенос с Земли в Инвентарь.
            if (dragType == 'groundItems') {
                invId = dropIdx;
                groundId = dragIdx;

                const items = [...state.inventory.groundItems]
                const invItem = items[invId];

                if (invItem) {
                    const serverResult = await takeInventoryItemToServer(invItem.key, invItem.amount);
                    if (serverResult.result) {
                        dispatch(swapInvAndGroundItems(invId, groundId));
                    }
                    dispatch(Notify(serverResult.text, serverResult.result ? NotifyVariant.SUCCESS : NotifyVariant.ERROR, 'center', 'bottom'));

                    return;
                }
            }
        }

        dispatch(swapItems(dragIdx, dropIdx, dragType));
    };

    const [{ isOver, canDrop }, dropRef] = useDrop({
        accept: ['inventoryItems', 'groundItems'],
        canDrop: () => true,
        drop: (item, monitor) => onDrop(item, monitor),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    });

    const getImage = (isDragging: boolean) => {
        const styles = { padding: `${decrementSize}rem`, opacity: isDragging ? 0 : 1 };

        if (item) {
            return (
                <span>
                    <img src={ getItemImage(item.key) } style={ styles } />
                    <span className='inventory-cell_inner-amount' style={ { opacity: isDragging ? 0 : 1 } }>{ item?.amount }</span>
                </span>
            );
        }
        return null;
    };

    const cssInventoryCell = (isOver, canDrop): any => ({
        height: `${imgSize}rem`,
        width: `${imgSize}rem`,
        border: isOver ? '1px solid gold' : '1px solid transparent',
    });

    return (
        <div ref={ dropRef } className='inventory-cell' style={ cssInventoryCell(isOver, canDrop) }>

            <div className="inventory-cell_inner" ref={ dragRef }>
                { getImage(isDragging) }
            </div>
        </div>
    );
}

export {
    InventoryCell,
}