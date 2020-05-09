import React from "react";
import ReactSlider from "react-slider";
import { AnySelect } from "../../../shared/AnySelect";
import { useSelector, useDispatch } from "react-redux";
import { State } from "../../../../reducers";
import { range } from "../../../../helpers/helps";
import { setEyesColor } from "../../../../actions/characterActions";
import { setCharacterEyes } from "../../../../helpers/playerEvents/rpcCall";

function CharacterEyes() {
    const state = useSelector((state: State) => state || []);
    const dispatch = useDispatch();
    let eyes = state.character.eyes;

    const onLeft = () => {
        eyes -= 1;
        eyes = range(eyes, 0, 31);
        dispatch(
            setEyesColor(eyes)
        );
        setCharacterEyes(eyes);
    };
    const onRight = () => {
        eyes += 1;
        eyes = range(eyes, 0, 31);
        dispatch(
            setEyesColor(eyes)
        );
        setCharacterEyes(eyes);
    };

    return (
        <div className='character-eyes'>
            <AnySelect 
                onLeftClick={ () => onLeft() } 
                onRightClick={ () => onRight() } 
                value={ eyes }
                topText={ 'Цвет глаз' } 
            />
        </div>
    );
}

export {
    CharacterEyes,
}