import React, { useEffect } from "react";
import './character.css';
import { Drawer, Button, Slider, Animation } from 'rsuite';
import { Previous } from "../Previous";
import { push } from "connected-react-router";
import { useDispatch, useSelector } from "react-redux";
import ReactSlider from 'react-slider'
import { setCharacterHeading, setCharacterGender, resetCharacter, serverRegister, updateCharacterCameraPosition, serverCharacterReady } from "../../../helpers/playerEvents/rpcCall";
import { CharacterFace } from "./CharacterFace";
import { CharacterHead } from "./CharacterHead";
import { setInitialCharacter, setGender } from "../../../actions/characterActions";
import { State } from "../../../reducers";
import { CharacterHair } from "./CharacterHair";
import { CharacterHeading } from "./CharacterHeading";
import { CharacterHeadOverlay } from "./CharacterHeadOverlay";
import { CharacterEyes } from "./CharacterEyes";
import { enqueueSnackbar, NotifyVariant } from "../../../actions/notificationActions";

const { Bounce } = Animation;

function CharacterTitle(props: { title: string; }) {
    const { title } = props;
    
    return (
        <div style={ {fontSize: '1.6rem', margin: '2rem 0', textAlign: 'center', textTransform: 'uppercase'} }>{ title }</div>
    );
}

function Character() {
    const state = useSelector((state: State) => state.character || []);
    const registerState = useSelector((state: State) => state.auth.register || []);
    const dispatch = useDispatch();
    const { login, email, password } = registerState;

    const onGenderClick = async (gender: 'male' | 'female') => {
        await resetCharacter();
        await setCharacterGender(gender);
        dispatch(
            setGender(gender)
        );
        dispatch(
            setInitialCharacter()
        );
    };

    const onClickReset = async () => {
        // Отправка на клиент.
        await resetCharacter();
        dispatch(
            setInitialCharacter()
        );
    };

    const onReady = async () => {
        const serverResult = await serverCharacterReady({
            login: login.val, 
            email: email.val, 
            password: password.val,
        });
        // Занести данные в бд.

        dispatch(
            enqueueSnackbar({
                message: serverResult.text,
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: serverResult.result ? NotifyVariant.SUCCESS : NotifyVariant.ERROR,
                        anchorOrigin: {
                            horizontal: 'center',
                            vertical: 'bottom',
                        }
                },
            })
        );
        
        dispatch(push('clear'));
    };

    return (
        <div className='character'>
            <Drawer
                backdrop={ false }
                size={ 'xs' }
                placement={ 'left' }
                show={ true }
                className='character-drawer'
            >
                <Drawer.Header>
                    <span className='character-reset' onClick={ () => onClickReset() }>Сбросить</span>
                </Drawer.Header>
                <Drawer.Body>
                    <div className="character-content">
                        <div className="character-gender">
                            <Button appearance="ghost" color='red' size='lg' active onClick={ () => onGenderClick('male') }>Мужской</Button>
                            <Button appearance="ghost" color='violet' size='lg' active onClick={ () => onGenderClick('female') }>Женский</Button>
                        </div>
                        <CharacterTitle title='Лицо' />
                        <CharacterHead />
                        <CharacterTitle title='Лицо' />
                        <CharacterFace />
                        <CharacterTitle title='Внешний вид' />
                        <CharacterEyes />
                        <CharacterHair />
                        <CharacterHeadOverlay />

                    </div>
                </Drawer.Body>
                <Drawer.Footer>
                    <div style={ {textAlign: 'center'} }>
                        <Button appearance="ghost" size='lg' style={{textAlign: 'center', width: '8rem'}} onClick={ onReady }>ГОТОВО</Button>
                    </div>
                </Drawer.Footer>
            </Drawer>

            <CharacterHeading />
        </div>
    );
}

export {
    Character,
}