import React from "react";
import { AnySelect } from "../../../shared/AnySelect";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../../../reducers";
import { setHairId, setHairColor } from "../../../../actions/characterActions";
import { setCharacterHair, setCharacterHairColor } from "../../../../helpers/playerEvents/rpcCall";

// drawableIds.
const hairList = {
    male: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 
        24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 
        44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 
        65, 66, 67, 68, 69, 70, 71, 72, 73, 74,
    ],
    female: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 
        22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 
        42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 
        62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78,
    ],
};

function CharacterHair() {
    const state = useSelector((state: State) => state || []);
    const dispatch = useDispatch();
    const gender = state.character.gender; 
    let hairId = state.character.hair;
    let hairColorId = state.character.hairColorId;

    const onLeftClick = async () => {      
        hairId -= 1;

        if (hairId < 0) {
            hairId = hairList[gender].length - 1;
        }

        // Отправка на клиент.
        await setCharacterHair(hairList[gender][hairId]);
        
        dispatch(
            setHairId(hairId)
        );
    };

    const onRightClick = async () => {
        hairId += 1;

        if (hairId > hairList[gender].length - 1) {
            hairId = 0;
        }

        // Отправка на клиент.
        await setCharacterHair(hairList[gender][hairId]);
        
        dispatch(
            setHairId(hairId)
        );
    };

    const onHairColorRightClick = () => {
        hairColorId += 1;
        if (hairColorId > 63) {
            hairColorId = 0;
        } 

        // Отправка на клиент.
        setCharacterHairColor(hairColorId);

        dispatch(setHairColor(hairColorId));
    };

    const onHairColorLeftClick = () => {
        hairColorId -= 1;
        if (hairColorId < 0) {
            hairColorId = 63;
        } 
        
        // Отправка на клиент.
        setCharacterHairColor(hairColorId);

        dispatch(setHairColor(hairColorId));
    };
    
    return (
        <div className='character-hair'>
            <AnySelect value={ hairList[gender][hairId] } onRightClick={ onRightClick } onLeftClick={ onLeftClick } topText='Тип волос' />
            <AnySelect value={ hairColorId } onRightClick={ onHairColorRightClick } onLeftClick={ onHairColorLeftClick } topText='Цвет волос' />
        </div>
    );
}

export {
    CharacterHair,
}