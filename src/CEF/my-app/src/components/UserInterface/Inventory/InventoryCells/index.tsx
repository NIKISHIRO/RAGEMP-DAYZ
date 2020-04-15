import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { State } from "../../../../reducers";
import { UIState } from "../../../../reducers/UIReducer";
import { InventoryCell } from "../InventoryCell";
import { Item } from "../../../../types";
import { SelectedItem } from "../SelectedItem";

const shortString = '__inventoryCells';

type Props = {
    UIState: UIState;
}

const getListStyle = (isDraggingOver) => ({
    overflow: 'auto',
    height: '100%',
});

const InventoryCells = (props: Props) => {
    const { UIState } = props;
    const { inventory } = UIState;
    const { items } = inventory;

    const [currentItem, setCurrentItem] = useState<Item | null>(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const onSelectItem = (item: Item, e: any) => {
        setCurrentItem(item);
        setAnchorEl(e.currentTarget);
    };

    const onPopClose = () => {
        setCurrentItem(null);
        setAnchorEl(null);
    }

    const getItems = () => {
        return items.map((item, id) => {
            return <InventoryCell 
                onSelectItem={ onSelectItem } 
                key={ `${shortString}${item.data.shortid}` } 
                id={ id } 
                item={ item } 
                isInventory 
            />
        });
    };
    
    return (
        <>
            {!!currentItem && <SelectedItem onPopClose={ onPopClose } anchorEl={ anchorEl } item={ currentItem } />}
            
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

const mapStateToProps = (state: State) => ({
    UIState: state.UI,
});

const InventoryCellsConnect = connect(
    mapStateToProps,
)(InventoryCells);

export {
    InventoryCellsConnect as InventoryCells,
}