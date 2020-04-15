import React, { useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Item } from "../../../../types";
import { getItemImage } from "../../../../helpers/getImages";
import { connect } from "react-redux";
import { setInventoryItems, splitInventoryItemByIndex, stackItems } from "../../../../actions/inventoryActions";
import { State } from "../../../../reducers";
import { UIState } from "../../../../reducers/UIReducer";
import { GiRapidshareArrow } from "react-icons/gi";

type Props = {
    item: Item;
    id: number;
    UIState: UIState;
    isPopover?: boolean;
    isInventory?: boolean;
    onSelectItem: (item: Item, event: any) => any;
    setInventoryItems: (items: Item[]) => any;
    splitInventoryItemByIndex: (itemId: number, splitCount: number) => any;
    stackItems: (currentItemIndex: number, nextItemIndex: number) => any;
}

// const getOccupiedSlots = (): number => {
//     let weight = 0;
//     invItems.forEach(item => weight += (item.amount * item.data.weight));
//     console.log('getOccupiedSlots', weight);
//     return weight;
// };

const InventoryCell = (props: Props) => {
    const { item, id, UIState, setInventoryItems, splitInventoryItemByIndex, isInventory, onSelectItem, stackItems } = props;
    const { inventory } = UIState;
    const { items } = inventory;
    const itemImage = getItemImage(item.key);

    let isStack = false;
    let currentItem;
    let nextItem;
    if (isInventory) {
        const currentItemIdx = items.findIndex(i => i === item);
        if (currentItemIdx !== -1) {

            currentItem = items[currentItemIdx];
            nextItem = items[currentItemIdx + 1];

            if (currentItem && nextItem) {
                if (currentItem.key === nextItem.key && currentItem.data.maxStackCount > 1) {
                    isStack = true;
                }
            }
        }
    }

    const onMouseDown = (event) => {
        if (!isInventory) {
            return;
        }

        // Клик колесиком мыши на элемент.
        if (event.button === 2) {
            if (item.amount <= 1) {
                return;
            }

            const idx = items.findIndex(i => i === item);

            if (idx === -1) {
                return;
            }

            splitInventoryItemByIndex(idx, Math.floor(item.amount / 2));
        }
    }

    const onStackClick = (event: any) => {
        event.stopPropagation();
        const currentItemIndex = items.findIndex(i => i === currentItem);
        const nextItemIndex = items.findIndex(i => i === nextItem);
        stackItems(currentItemIndex, nextItemIndex)
    };

    return (
        <Draggable draggableId={ item.data.shortid } index={ id }>
            {(dragProvided, snapshot) => {
                return (
                    <div 
                        onClick={ onSelectItem ? (e) => onSelectItem(item, e) : () => false }
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
                                    { item.amount }
                                </div>

                                { isStack && <div className='isStack' onClick={ (e) => onStackClick(e) }><GiRapidshareArrow /></div> }
                            </div>
                        </div>
                    </div>
                );
            }} 
        </Draggable>
    );
};

const mapDispatchToProps = (dispatch) => ({
    setInventoryItems: (items: Item[]) => dispatch(setInventoryItems(items)),
    splitInventoryItemByIndex: (itemId: number, splitCount: number) => dispatch(splitInventoryItemByIndex(itemId, splitCount)),
    stackItems: (currentItemIndex: number, nextItemIndex: number) => dispatch(stackItems(currentItemIndex, nextItemIndex)),
});

const mapStateToProps = (state: State) => ({
    UIState: state.UI,
});

const InventoryCellConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
)(InventoryCell);

export {
    InventoryCellConnect as InventoryCell,
}