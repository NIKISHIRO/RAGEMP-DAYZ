import React, { useState } from 'react';
import Slider from '@material-ui/core/Slider';
import IconButton from '@material-ui/core/IconButton';
import { MdCallSplit } from "react-icons/md";
import { connect, useDispatch, useSelector } from 'react-redux';
import { splitInventoryItemByIndex, setInventoryItems, setGroundItems } from '../../../../../actions/inventoryActions';
import { UIState } from '../../../../../reducers/UIReducer';
import { Item } from '../../../../../types';
import { State } from '../../../../../reducers';
import { takeInventoryItemToServer } from '../../../../../helpers/playerEvents/rpcCall';
import { enqueueSnackbar, NotifyVariant } from '../../../../../actions/notificationActions';
import shortid from 'shortid';
const groundShortString = 'groundCells__';
const inventoryShortString = 'inventoryCells_';

type Props = {
    item: Item;
    isInventory?: boolean;
    onPopClose: () => any;
}

function TabSplitComponent(props: Props) {
    const { item, isInventory } = props;
    const UIState = useSelector((state: any): UIState => {
        return state.UI || [];
    });
    const dispatch = useDispatch();

    const { inventory, ground } = UIState;
    const { items: inventoryItems } = inventory;
    const { items: groundItems } = ground;
    const amount = item.amount;
    const maxSplit = amount - 1;
    
    const [inputValue, setInputValue] = useState<any>(maxSplit);

    const checkRangeValue = (value: number) => {
        if (!Number.isInteger(value) || isNaN(value)) {
            setInputValue(0);
        }
        
        if (value > maxSplit) {
            setInputValue(maxSplit);
        } 

        if (value < maxSplit) {
            setInputValue(value);
        }

        if (value < 0) {
            setInputValue(0);
        }
    };

    const onSliderChange = (event: any, value: number | number[]) => {
        if (typeof value !== 'number') {
            return;
        }

        checkRangeValue(value);
        console.log('-> onSliderChange value', value);

        if (typeof value === 'number') {
            setInputValue(value);
        }
    };

    const onInputChange = (event: any) => { 
        const value = parseInt(event.target.value);
        checkRangeValue(value);
    };

    const onIconBtnClick = async (event: any) => {
        // Если предмет принадлежит инвентарю.
        if (isInventory) {
            const idx = inventoryItems.findIndex((i) => i === item);
            console.log('onIconBtnClick idx', idx);

            if (idx !== -1) {
                dispatch(
                    splitInventoryItemByIndex(idx, inputValue)
                );
            }

            props.onPopClose();
        } else {            
            props.onPopClose();

            const idx = groundItems.findIndex((i) => i === item);
            if (idx !== -1) {
                if (inputValue <= 0) {
                    props.onPopClose();
                    return;
                }

                // Взять указанное количество предметов.
                const serverResult = await takeInventoryItemToServer(item.data.serverId, inputValue);    
                if (serverResult.result) {
                    console.log('Взять указанное кол-во', item);

                    const groundItem = JSON.parse(JSON.stringify(groundItems[idx]));
                    const inventoryItem = JSON.parse(JSON.stringify(groundItem));

                    const amount = groundItem.amount - inputValue;
                    if (amount > 0) {
                        groundItems[idx].amount = amount;
                        // groundItems[idx].data.shortid = `${groundShortString}${shortid.generate()}`;
                        inventoryItem.amount = inputValue;
                        inventoryItem.data.shortid = `${inventoryShortString}${shortid.generate()}`;
                        inventoryItems.unshift(inventoryItem);
                    }
            
                    if (amount <= 0) {
                        console.log('amount <= 0');
                        groundItems.splice(idx, 1);
                        inventoryItem.amount = groundItem.amount;
                        inventoryItems.unshift(inventoryItem);
                    }
            
                    dispatch(
                        setInventoryItems(JSON.parse(JSON.stringify(inventoryItems)))
                    );
                    dispatch(
                        setGroundItems(groundItems)
                    );
                    dispatch(
                        enqueueSnackbar({
                            message: serverResult.text,
                                options: {
                                    key: new Date().getTime() + Math.random(),
                                    variant: NotifyVariant.DEFAULT,
                                    anchorOrigin: {
                                        horizontal: 'center',
                                        vertical: 'bottom',
                                    }
                            },
                        })
                    );
                } else {
                    dispatch(
                        enqueueSnackbar({
                            message: serverResult.text,
                                options: {
                                    key: new Date().getTime() + Math.random(),
                                    variant: NotifyVariant.ERROR,
                                    anchorOrigin: {
                                        horizontal: 'center',
                                        vertical: 'bottom',
                                    }
                            },
                        })
                    );
                }
            }
        }

        props.onPopClose();
    };

    return (
        <div className="popover-tab-container">
            <div className="popover-tab-container__item">
                <Slider
                    defaultValue={ 1 }
                    valueLabelDisplay="auto"
                    step={ Math.ceil(amount / 100 * 10) } // 1 step = 10%.
                    min={ 1 }
                    max={ maxSplit }
                    value={ inputValue }
                    onChange={ onSliderChange }
                    disabled={ maxSplit <= 1 }
                    marks
                />
            </div>

            <input type="text" value={ inputValue } onChange={ onInputChange } />
            
            <div onClick={ onIconBtnClick }>
                <IconButton color="inherit" aria-label="upload picture" component="span" classes={{ root: 'popover-icon-button' }}>
                    <MdCallSplit />
                </IconButton>
            </div>
        </div>
    );
}

export {
    TabSplitComponent,
}