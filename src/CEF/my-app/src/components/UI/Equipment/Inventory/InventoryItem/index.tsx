import React, { useEffect } from "react";
import item_armor from '../../../../../assets/items/item_armor.png';
import item_weapon_ak47 from '../../../../../assets/items/item_weapon_ak47.png';
import { ItemTooltip } from "../item-tooltip/ItemTooltip";
import { Item } from "../../../../../types/item";
import { Whisper, Tooltip } from 'rsuite';
import { connect } from "react-redux";
import { State } from "../../../../../reducers";
import { InventoryState,  } from "../../../../../reducers/inventoryReducer";
import { selectItem, putInventoryItem, swapInventoryItems, stackItems } from "../../../../../actions/inventoryActions";

const itemImages = {
    item_armor,
    item_weapon_ak47,
};

type Props = {
    item: Item;
    inventory: InventoryState;
    selectItem: (item: Item) => void;
    putInventoryItem: (dragCellIdx: number, dropCellIdx: number) => void;
    swapInventoryItems: (dragCellIdx: number, dropCellIdx: number) => void;
    stackItems: (dragCellIdx: number, dropCellIdx: number) => void;
}

function InventoryItem(props: Props) {
    const { item, inventory, putInventoryItem, swapInventoryItems, stackItems, selectItem } = props;
    const { items } = inventory;
    const itemImage = itemImages[item.key];

    const dragData = { cellIdx: item.data.cellIdx };

    const onClick = (e) => {
        console.log('onSelectItem', item);
        // selectItem(item);
    };

    const onDrop = (e) => {
        const inventoryItems = JSON.parse(JSON.stringify(items));
        const dragCellIdx = e.dragData.cellIdx;
        const dropCellIdx = e.dropData.cellIdx;

        console.log('onDrop - e', e);
        console.log('inventoryItems', [...inventoryItems]);
        console.log('drag', inventoryItems[dragCellIdx]);
        console.log('drop', inventoryItems[dropCellIdx]);

        if (dragCellIdx === dropCellIdx) {
            return;
        }

        if (inventoryItems[dropCellIdx] === null) {
            putInventoryItem(dragCellIdx, dropCellIdx);
            return;
        }

        if (inventoryItems[dragCellIdx].data.type === inventoryItems[dropCellIdx].data.type) {
            stackItems(dragCellIdx, dropCellIdx);
            return;
        }

        if (inventoryItems[dragCellIdx] && inventoryItems[dropCellIdx]) {
            swapInventoryItems(dragCellIdx, dropCellIdx);
        }
    };

    return (
        <Whisper
            trigger="click"
            placement='bottom'
            speaker={
            <Tooltip>
                <ItemTooltip item={ item } />
            </Tooltip>
        }>
            <div
                className='item' 
                // onClick={ onClick }
            >
                <img src={ itemImage } draggable={ false } />
                <div className='item-count'>{ item.amount }</div>
            </div>
        </Whisper>
    );
}

const mapDispatchToProps = (dispatch) => ({
    selectItem: (item) => dispatch(selectItem(item)),
    putInventoryItem: (dragCellIdx: number, dropCellIdx: number) => dispatch(putInventoryItem(dragCellIdx, dropCellIdx)),
    swapInventoryItems: (dragCellIdx: number, dropCellIdx: number) => dispatch(swapInventoryItems(dragCellIdx, dropCellIdx)),
    stackItems: (dragCellIdx: number, dropCellIdx: number) => dispatch(stackItems(dragCellIdx, dropCellIdx)),
});

const mapStataeToProps = (state: State) => ({
    inventory: state.inventory
});

const connectInventoryItem = connect(
    mapStataeToProps,
    mapDispatchToProps,
)(InventoryItem);

export {
    connectInventoryItem as InventoryItem,
}