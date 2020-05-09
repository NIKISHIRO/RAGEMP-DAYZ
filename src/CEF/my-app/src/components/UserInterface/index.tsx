import React from "react";
import './UserInterface.css';
import { Inventory } from "./Inventory";
import { ItemsGround } from "./ItemsGround";
import { DragDropContext } from "react-beautiful-dnd";

import { setInventoryItems, setGroundItems } from "../../actions/inventoryActions";
import { enqueueSnackbar, NotifyVariant } from "../../actions/notificationActions";
import { useSelector, useDispatch } from "react-redux";
import { UIState } from "../../reducers/UIReducer";
import { takeInventoryItemToServer, dropInventoryItemToServer } from "../../helpers/playerEvents/rpcCall";

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


function ItemsUI(props) {
    const UIState = useSelector((state: any): UIState => {
        return state.UI || [];
    });
    const dispatch = useDispatch();

    const { inventory, ground } = UIState;


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
                dispatch(setGroundItems(items));
            }
            
            if (source.droppableId === 'droppable1') {
                dispatch(setInventoryItems(items));
            }

        } else { // Если дроп. перенесен с 1го на другой.
            const result = move(
                getList(source.droppableId),
                getList(destination.droppableId),
                source,
                destination,
            );

            // Предмет выкинули.
            // ОТПРАВКА НА SERVER ITEM_KEY И AMOUNT ПРЕДМЕТА - для его удаления из инвентаря.
            if (source.droppableId === 'droppable1') {
                const inventoryItems = [...inventory.items];
                const item = inventoryItems[source.index];

                const serverResult = await dropInventoryItemToServer(item.key, item.amount);
                if (serverResult.result) {
                    dispatch(setGroundItems(result.droppable));
                    dispatch(setInventoryItems(result.droppable1));
                }
            }

            // Предмет взяли.
            if (source.droppableId === 'droppable') {
                console.log(' ===> Предмет положен.');
              
                const groundItems = [...ground.items];
                const item = groundItems[source.index];
                console.log(' ---> ПРЕДМЕТ ПОЛОЖИЛИ.', item);
   
                // Отправляем на сервак shortid предмета который перекладываем в инвентарь.
                const serverResult = await takeInventoryItemToServer(item.data.serverId, item.amount);
                if (serverResult.result) {
                    dispatch(setGroundItems(result.droppable));
                    dispatch(setInventoryItems(result.droppable1));
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
                            },
                        },
                    })
                )
            }
        }
    };

    const onDragStart = (data) => {
        console.log('onDragStart data', data);  
    }

    return (
        <div className='UI'> 
            <div className="UI-container">
                <DragDropContext onDragEnd={ onDragEnd } onDragStart={ onDragStart }>  
                    <ItemsGround />
                    <Inventory />
                </DragDropContext>
            </div>
        </div>
    );
};


export {
    ItemsUI,
}