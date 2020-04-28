import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { InventoryCell } from "../InventoryCell";
import { useSelector } from "react-redux";
import { UIState } from '../../../../reducers/UIReducer';
const shortString = 'inventoryCells_';

const getListStyle = (isDraggingOver) => {
    console.log('isDraggingOver', isDraggingOver);
    
    return {
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '32rem',
        border: isDraggingOver ? '3px dotted green' : '3px dotted transparent',
    }
};

const InventoryCells = (props) => {
    const UIState = useSelector((state: any): UIState => {
        return state.UI || [];
    });
    const { inventory } = UIState;
    const { items } = inventory;

    const getItems = () => {
        return items.map((item, id) => {
            return <InventoryCell 
                key={ `${shortString}${item.data.shortid}` } 
                id={ id } 
                item={ item } 
                isInventory 
            />
        });
    };
    
    return (
        <>
            <Droppable droppableId="droppable1">
                {(provided, snapshot) => (
                    <div ref={ provided.innerRef } style={ getListStyle(snapshot.isDraggingOver) } { ...provided.droppableProps }>
                        { getItems() }
                        { provided.placeholder }
                    </div>
                )}
            </Droppable>
        </>
    );
};

export {
    InventoryCells,
}