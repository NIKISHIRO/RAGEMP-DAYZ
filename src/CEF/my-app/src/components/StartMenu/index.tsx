import React from "react";
import './startMenu.css';
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { Animation } from 'rsuite';
const { Bounce } = Animation;

function StartMenu() {
    const dispatch = useDispatch();

    return (
        <Bounce in={ true }>
            <div className='start-menu'>
                <div className="start-menu__interface">
                    <div className="start-menu__item" onClick={ () => dispatch(push('/auth')) }>Авторизация/Регистрация</div>
                    <div className="start-menu__item" onClick={ () => dispatch(push('/character')) }>Создание персонажа</div>
                </div>
            </div>
        </Bounce>
    );
}

export {
    StartMenu,
}