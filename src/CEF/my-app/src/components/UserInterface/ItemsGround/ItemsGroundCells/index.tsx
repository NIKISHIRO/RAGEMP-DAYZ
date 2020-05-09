import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { setInventoryItems } from "../../../../actions/inventoryActions";
import { UIState } from "../../../../reducers/UIReducer";
import { InventoryCell } from "../../Inventory/InventoryCell";
const groundShortString = 'groundCells__';
const inventoryShortString = 'inventoryCells_';

const getListStyle = (isDraggingOver) => ({
    overflowY: 'auto',
    overflowX: 'hidden',
    height: '37rem',
    border: isDraggingOver ? '3px dotted green' : '3px dotted transparent',
});

const ItemsGroundCells = (props) => {
    const UIState = useSelector((state: any): UIState => {
        return state.UI || [];
    });
    const { ground } = UIState;
    const { items } = ground;    

    return (
        <Droppable droppableId="droppable">
        {(provided, snapshot) => (
            <div { ...provided.droppableProps } ref={ provided.innerRef } style={ getListStyle(snapshot.isDraggingOver) }>
                { items.map((item, idx) => <InventoryCell key={ `${groundShortString}${item.data.shortid}` } id={ idx } item={ item } />) }
                { provided.placeholder }
            </div>
        )}
        </Droppable>
    );
};

export {
    ItemsGroundCells,
}