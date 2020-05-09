import React, { useState } from "react";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { setCharacterHeadProp } from "../../../../helpers/playerEvents/rpcCall";
import { State } from "../../../../reducers";
import { useSelector, useDispatch } from "react-redux";
import { setParentIndex } from "../../../../actions/characterActions";
import { AnySelect } from "../../../shared/AnySelect";

type Props = {
    parentsObj: any;
    parents: { father: any, mother: any };
    parent: 'father' | 'mother';
    text: string;
    sendData: (name: any, value: any) => any;
};

function CharacterHeadParent(props: Props) {
    const { parents, parent, sendData, parentsObj, text } = props;
    const characterState = useSelector((state: State) => state || []);
    const parentIndex = characterState.character.head[parent].index;

    const dispatch = useDispatch();

    const onIncrement = () => {
        const length = parents[parent].length - 1;
        let c = parentIndex;
        
        c += 1;
        if (c > length) {
            c = length;
        }

        dispatch(setParentIndex(parent, c));
        sendData(parent, parentsObj[parents[parent][c]]);
    };

    const onDecrement = () => {
        let c = parentIndex;

        c -= 1;
        if (c <= 0) {
            c = 0;
        }

        dispatch(setParentIndex(parent, c));
        sendData(parent, parentsObj[parents[parent][c]]);
    };

    return (
        <div className='character-head'>
            <AnySelect onLeftClick={ onDecrement } onRightClick={ onIncrement } value={ parents[parent][parentIndex] } topText={ text } />
        </div>
    );
}

export {
    CharacterHeadParent,
}
