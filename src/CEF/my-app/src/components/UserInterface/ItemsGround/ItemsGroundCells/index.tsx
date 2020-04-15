import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { State } from "../../../../reducers";
import { setInventoryItems } from "../../../../actions/inventoryActions";
import { UIState } from "../../../../reducers/UIReducer";
import { InventoryCell } from "../../Inventory/InventoryCell";
import { Item } from "../../../../types";

const shortString = '__groundCells';

type Props = {
    setInventoryItems: (items: Item[]) => void;
    UIState: UIState;
}

const getListStyle = (isDraggingOver) => ({
    overflow: 'auto',
    height: '100%',
});

const ItemsGroundCells = (props: Props) => {
    const { UIState } = props;
    const { ground } = UIState;
    const { items } = ground;

    return (
        <Droppable droppableId="droppable">
        {(provided, snapshot) => (
            <div { ...provided.droppableProps } ref={ provided.innerRef } style={ getListStyle(snapshot.isDraggingOver) }>
                { items.map((item, idx) => <InventoryCell onSelectItem={ () => false } key={ `${shortString}${item.data.shortid}` } id={ idx } item={ item } />) }
                { provided.placeholder }
            </div>
        )}
        </Droppable>
    );
};

const mapStateToProps = (state: State) => ({
    UIState: state.UI,
});

const mapDispatchToProps = (dispatch) => ({
    setInventoryItems: (items: Item[]) => dispatch(setInventoryItems(items)),
});

const ItemsGroundCellsConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ItemsGroundCells);

export {
    ItemsGroundCellsConnect as ItemsGroundCells,
}