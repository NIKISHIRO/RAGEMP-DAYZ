import React from "react";
import './UserInterface.css';
import { Inventory } from "./Inventory";
import { ItemsGround } from "./ItemsGround";
import { DragDropContext } from "react-beautiful-dnd";
import { State } from "../../reducers";

import { setInventoryItems, setGroundItems, setSnackbar, SnackbarType } from "../../actions/inventoryActions";
import { connect } from "react-redux";
import { Item } from "../../types";
import { UIState } from "../../reducers/UIReducer";

const move = (source, destination, droppableSource, droppableDestination): any => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    console.log('result', result);

    return result;
};

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex): any => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

type Props = {
    UIState: UIState;
    setInventoryItems: (items: Item[]) => any; 
    setGroundItems: (items: Item[]) => any;
    setSnackbar: (snack: SnackbarType) => any;
}

function ItemsUI(props: Props) {
    const { UIState, setInventoryItems, setGroundItems, setSnackbar } = props;
    const { inventory, ground, snackbar } = UIState;
    const { slots } = inventory;

    const id2List = {
        droppable: 'ground',
        droppable1: 'inventory',
    };

    const getList = (id) => UIState[id2List[id]].items;

    const onDragEnd = async (result) => {
        const { source, destination } = result;

        console.log('result', result);
        console.log('source', source);
        console.log('destination', destination);

        // dropped outside the list
        if (!destination) {
            return;
        }

        // Если дроп. перенесен на текущий.
        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                getList(source.droppableId),
                source.index,
                destination.index
            );

            console.log('-> items', items);
            console.log('-> source.droppableId', source.droppableId);
            console.log('-> destination.index', destination.index);

            if (source.droppableId === 'droppable') {
                setGroundItems(items);
            }
            if (source.droppableId === 'droppable1') {
                setInventoryItems(items);
            }

        } else { // Если дроп. перенесен с 1го на другой.
            const result = move(
                getList(source.droppableId),
                getList(destination.droppableId),
                source,
                destination,
            );

            // Предмет выкинули
            // ОТПРАВКА НА SERVER ITEM_KEY И AMOUNT ПРЕДМЕТА - для его удаления из инвентаря.
            if (source.droppableId === 'droppable1') {
                const inventoryItems = [...inventory.items];
                const item = inventoryItems[source.index];
                // const serverResult = await dropInventoryItemToServer(item.key, item.amount);
                // if (serverResult.result) {
                //     setGroundItems(result.droppable);
                //     setInventoryItems(result.droppable1);
                // }

                setGroundItems(result.droppable);
                setInventoryItems(result.droppable1);
                console.log(' ===> Предмет выкинули.', item);
            }

            // Предмет положили
            if (source.droppableId === 'droppable') {
                const groundItems = [...ground.items];
                const item = groundItems[source.index];
                console.log(' ---> ПРЕДМЕТ ПОЛОЖИЛИ.', item);
   
                // Отправляем на сервак shortid предмета который перекладываем в инвентарь.
                // const serverResult = await takeInventoryItemToServer(item.data.shortid, item.amount);
                // if (serverResult.result) {
                //     setGroundItems(result.droppable);
                //     setInventoryItems(result.droppable1);
                //     setSnackbar({ open: true, text: serverResult.text, origin: { vertical: 'bottom', horizontal: 'center' } });
                // } else {
                //     setSnackbar({ open: true, text: serverResult.text, origin: { vertical: 'bottom', horizontal: 'center' } });
                // }

                console.log('result.droppable', result.droppable);
                console.log('result.droppable1', result.droppable1);
                console.log(' ===> Предмет положен.');

                setGroundItems(result.droppable);
                setInventoryItems(result.droppable1);
                // setSnackbar({ open: true, text: 'serverResult.text', origin: { vertical: 'bottom', horizontal: 'center' } });
            }
        }
    };

    return (
        <div className='UI'> 
            <div className="UI-container">
                <DragDropContext onDragEnd={ onDragEnd }>  
                    <ItemsGround />
                    <Inventory slots={ slots } />
                </DragDropContext>
            </div>
        </div>
    );    
};

const mapStateToProps = (state: State) => ({
    UIState: state.UI,
});

const mapDispatchToProps = (dispatch) => ({
    setInventoryItems: (items: Item[]) => dispatch(setInventoryItems(items)),
    setGroundItems: (items: Item[]) => dispatch(setGroundItems(items)),
    setSnackbar: (snack) => dispatch(setSnackbar(snack)),
});

const ItemsUIConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ItemsUI);

export {
    ItemsUIConnect as ItemsUI,
}