import React, { useState } from 'react';
import { Progress, Button, Icon, Slider, InputNumber } from 'rsuite';
import { MdDescription, MdCardTravel } from "react-icons/md";
import { GiDropWeapon, GiMagicPalm, GiLobArrow } from "react-icons/gi";
import { Item } from '../../../../../types/item';

type Props = {
    item: Item;
}

function ItemTooltip(props: Props) {
    const { item } = props;

    const [dropCount, setDropCount] = useState(item.amount);

    const onCountChange = (value) => {
        setDropCount(value);
    };

    return (
        <div className='item-tooltip'>
            <div className='item-buttons'>
                <Button color="green" appearance="ghost">
                    <GiMagicPalm />
                </Button>
                <Button color="red" appearance="ghost">
                    <GiDropWeapon />
                </Button>
            </div>
            <div className="item-drop-count">
                <div>
                    <Slider defaultValue={ item.amount } min={ 1 } step={ 1 } max={ item.amount } onChange={ onCountChange } graduated />
                </div>
                <div className='item-drop-count-input'>
                    <InputNumber value={ dropCount } min={ 1 } max={ item.amount } onChange={ onCountChange } />
                    <span className='item-drop-count-icon'>
                        <GiLobArrow />
                    </span>
                </div>
            </div>
        </div>
    );
}

export {
    ItemTooltip,
}