import React, { useState } from 'react';
import Slider from '@material-ui/core/Slider';
import IconButton from '@material-ui/core/IconButton';
import { MdCallSplit } from "react-icons/md";
import { connect } from 'react-redux';
import { splitInventoryItemByIndex } from '../../../../../actions/inventoryActions';
import { UIState } from '../../../../../reducers/UIReducer';
import { Item } from '../../../../../types';
import { State } from '../../../../../reducers';

type Props = {
    item: Item;
    UIState: UIState;
    splitInventoryItemByIndex: (itemId: number, splitCount: number) => any;
    onPopClose: () => any;
}

function TabSplitComponent(props: Props) {
    const { item, splitInventoryItemByIndex, UIState } = props;
    const { inventory } = UIState;
    const { items } = inventory;
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

    const onIconBtnClick = (event: any) => {
        const invItems = [...items];

        const idx = invItems.findIndex((i) => i === item);

        if (idx === -1) {
            props.onPopClose();
            return;
        }

        splitInventoryItemByIndex(idx, inputValue);
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

const mapStateToProps = (state: State) => ({
    UIState: state.UI,
});

const mapDispatchToProps = (dispatch) => ({
    splitInventoryItemByIndex: (itemId: number, splitCount: number) => dispatch(splitInventoryItemByIndex(itemId, splitCount)),
});

const TabComponentConnect = connect(
    mapStateToProps,
    mapDispatchToProps
)(TabSplitComponent);

export {
    TabComponentConnect as TabSplitComponent,
}