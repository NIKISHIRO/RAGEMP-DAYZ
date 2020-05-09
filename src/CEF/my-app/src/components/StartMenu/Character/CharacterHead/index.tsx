import React from "react";
import { CharacterHeadParent } from "../CharacterHeadParent";
import { CharacterSlider } from "../CharacterSlider";
import { setCharacterHeadProp } from "../../../../helpers/playerEvents/rpcCall";
import { State } from "../../../../reducers";
import { useSelector, useDispatch } from "react-redux";
import { setHeadProp } from "../../../../actions/characterActions";

const fatherObj = {
    "Benjamin": 0, 
    "Daniel": 1, 
    "Joshua": 2, 
    "Noah": 3, 
    "Andrew": 4, 
    "Juan": 5, 
    "Alex": 6, 
    "Isaac": 7, 
    "Evan": 8, 
    "Ethan": 9, 
    "Vincent": 10, 
    "Angel": 11, 
    "Diego": 12, 
    "Adrian": 13, 
    "Gabriel": 14, 
    "Michael": 15, 
    "Santiago": 16, 
    "Kevin": 17, 
    "Louis": 18, 
    "Samuel": 19, 
    "Anthony": 20, 
    "Claude": 42, 
    "Niko": 43, 
    "John": 44,
};

const motherObj = {
    "Hannah": 21, 
    "Aubrey": 22,
    "Jasmine": 23, 
    "Gisele": 24, 
    "Amelia": 25, 
    "Isabella": 26, 
    "Zoe": 27, 
    "Ava": 28, 
    "Camila": 29, 
    "Violet": 30, 
    "Sophia": 31, 
    "Evelyn": 32, 
    "Nicole": 33, 
    "Ashley": 34, 
    "Gracie": 35, 
    "Brianna": 36, 
    "Natalie": 37, 
    "Olivia": 38, 
    "Elizabeth": 39, 
    "Charlotte": 40, 
    "Emma": 41, 
    "Misty": 45,
};

const father = ["Benjamin", "Daniel", "Joshua", "Noah", "Andrew", "Juan", "Alex", "Isaac", "Evan", "Ethan", "Vincent", "Angel", "Diego", "Adrian", "Gabriel", "Michael", "Santiago", "Kevin", "Louis", "Samuel", "Anthony", "Claude", "Niko", "John"];
const mother = ["Hannah", "Aubrey", "Jasmine", "Gisele", "Amelia", "Isabella", "Zoe", "Ava", "Camila", "Violet", "Sophia", "Evelyn", "Nicole", "Ashley", "Gracie", "Brianna", "Natalie", "Olivia", "Elizabeth", "Charlotte", "Emma", "Misty"];
const parents = { father, mother };

function CharacterHead() {
    const sendData = (name: any, val: number) => {
        setCharacterHeadProp({name, val});
    };

    const state = useSelector((state: State) => state || []);
    const dispatch = useDispatch();

    const onChange = (name: string, val: number) => {
        sendData(name, val);
        dispatch(setHeadProp(name, val));
    };

    return (
        <div className='character-head-container'>
            <CharacterHeadParent parent={ 'father' } sendData={ sendData } parents={ parents } parentsObj={ fatherObj } text='Отец' />
            <CharacterHeadParent parent={ 'mother' } sendData={ sendData } parents={ parents } parentsObj={ motherObj } text='Мать' />

            <div className='character-head-container__title' style={{margin: '1rem 0'}}>Схожесть</div>
            <CharacterSlider min={ 0 } max={ 1 } step={ 0.1 } value={ state.character.similarity } onChange={ (val) => { onChange('similarity', val) } } />

            <div className='character-head-container__title' style={{margin: '1rem 0'}}>Цвет кожи</div>
            <CharacterSlider min={ 0 } max={ 1 } step={ 0.1 } value={ state.character.skin } onChange={ (val) => { onChange('skin', val) } } />
        </div>
    );
}

export {
    CharacterHead,
}