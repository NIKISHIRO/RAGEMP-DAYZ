import React from "react";
import { CharacterSlider } from "../CharacterSlider";
import { setCharacterFaceFeature } from "../../../../helpers/playerEvents/rpcCall";
import { useSelector, useDispatch } from "react-redux";
import { setFaceFeature } from "../../../../actions/characterActions";
import { State } from "../../../../reducers";

function CharacterFace() {
    const state = useSelector((state: State) => state || []);
    const face = state.character.face;

    const dispatch = useDispatch();

    const onSliderChange = (index: number, feature: number) => {
        setCharacterFaceFeature(index, feature);
        dispatch(setFaceFeature(index, feature));
    };

    const getData = () => {
        return face.map(i => (
            <div className='character-face__item' key={ `${i.index}_${i.index}` }>
                <div className="character-face__item-title">{ i.name }</div>
                <CharacterSlider min={-1.0} max={1.0} step={0.1} value={ i.feature } onChange={ (n: number) => onSliderChange(i.index, n) } />
            </div>
        ));
    }
 
    return (
        <div className='character-face'>
            { getData() }
        </div>
    );
}

export {
    CharacterFace,
}