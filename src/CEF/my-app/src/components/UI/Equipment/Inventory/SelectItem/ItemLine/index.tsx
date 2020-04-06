import React from 'react';
import { Progress } from 'rsuite';
import { ItemType } from '../../../../../../types/item';
import { GiArmorDowngrade, GiCupidonArrow } from "react-icons/gi";

const { Line } = Progress;

type Props = {
    type: ItemType;
    percent: number;
}

function ItemLine(props: Props) {
    const { type, percent } = props;

    switch (type) {
        case ItemType.ARMOUR:
            return (
                <>
                    <span>
                        <GiArmorDowngrade />
                    </span>
                    <span>
                        <Line percent={ percent } strokeColor="#34c3ff" style={ { width: '80%' } } />
                    </span>
                </>
            );
        
        case ItemType.WEAPON:
            return (
                <>
                    <span>
                        <GiCupidonArrow />
                    </span>
                    <span>
                        <Line percent={ percent } strokeColor="#ffc107" style={ { width: '80%' } } />
                    </span>
                </>
            );
    }
}

export {
    ItemLine,
}