import React, { useState } from "react";
import './auth.css';
import { useToggle } from "@umijs/hooks";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar, NotifyVariant } from "../../../actions/notificationActions";
import { GiThumbUp, GiThumbDown } from "react-icons/gi";
import { serverRegister, serverLogin, updateCharacterCameraPosition, serverCheckLogin } from "../../../helpers/playerEvents/rpcCall";
import { Previous } from "../Previous";
import { push } from "connected-react-router";
import { Animation, Whisper, Tooltip } from 'rsuite';
import { State } from "../../../reducers";
import { setRegister, updateAuthProp } from "../../../actions/authActions";
const { Bounce } = Animation;

const btnRegValidStyles = {
    border: '1px solid #c0c0c0',   
    color: '#c0c0c0',
    opacity: '.5',
};

const inputStyles = (isError) => ({
    border: isError ? '1px dashed rgba(160, 7, 17, 1)' : '',
    color: isError ? 'rgba(160, 7, 17, 1)' : '',
})

function Register() {
    const state = useSelector((state: State) => state || []);
    const dispatch = useDispatch();

    const registerState = state.auth.register;

    const isLoginValid = registerState.login.isValid;
    const isLoginTouch = registerState.login.isTouch;
    const isEmailValid = registerState.email.isValid;
    const isEmailTouch = registerState.email.isTouch;
    const isPassValid = registerState.password.isValid;
    const isPassTouch = registerState.password.isTouch;
    const isConfirmPassValid = registerState.confirmPassword.isValid;
    const isConfirmPassTouch = registerState.confirmPassword.isTouch;

    const checkData = () => {
        const newState = {...registerState};
        newState.login.isValid = registerState.login.regular.test(registerState.login.val); 
        newState.email.isValid = registerState.email.regular.test(registerState.email.val); 
        newState.password.isValid = registerState.password.regular.test(registerState.password.val);
        newState.confirmPassword.isValid = newState.confirmPassword.val === newState.password.val; 

        dispatch(
            setRegister(newState)
        );
    };

    const clickRegisterBtn = async () => {
        if (isLoginValid && isPassValid && isConfirmPassValid && isEmailValid) {
            // Если игрока с указанным ником нет на сервере, то допустить к кастомизации.
            const serverResult = await serverCheckLogin(registerState.login.val);
            
            if (serverResult.result) {
                updateCharacterCameraPosition();
                dispatch(
                    push('/character')
                );
            } else {
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
            }
        }
    };

    const onChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;

        dispatch(
            updateAuthProp(name, 'val', value)
        );

        checkData();
    };

    const onBlur = (event: any) => {
        const name = event.target.name;
        dispatch(
            updateAuthProp(name, 'isTouch', true)
        );
    };

    const isDisabled = !isLoginValid || !isPassValid || !isConfirmPassValid || !isEmailValid;
    console.log('isDisabled', isDisabled);

    return (
        <Bounce in={ true }>
            <div className='middle-register'>
                <form className="middle-form">
                    <div className='middle-form_input'>
                        <input placeholder='Логин(Никнейм)' type="text" name='login' value={ registerState.login.val || '' } onChange={ onChange } onBlur={ onBlur } style={ inputStyles(isLoginTouch && !isLoginValid) } />
                        { isLoginTouch && isLoginValid && <GiThumbUp /> }
                        { isLoginTouch && !isLoginValid && <span style={ {color: 'rgb(218, 75, 85)'} }><GiThumbDown /></span> } 
                    </div>
                    <div className='middle-form_input'>
                        <input placeholder='Емейл' type="email" name='email' value={ registerState.email.val || '' } onChange={ onChange } onBlur={ onBlur } style={ inputStyles(registerState.email.isTouch && !registerState.email.isValid) } />
                        { isEmailTouch && isEmailValid && <GiThumbUp /> }
                        { isEmailTouch && !isEmailValid && <span style={ {color: 'rgb(218, 75, 85)'} }><GiThumbDown /></span> } 
                    </div>
                    <div className='middle-form_input'>
                        <input placeholder='Введите пароль' type="password" name='password' value={ registerState.password.val || '' } onChange={ onChange } onBlur={ onBlur } style={ inputStyles(isPassTouch && !isPassValid) } />
                        { isPassTouch && isPassValid && <GiThumbUp /> }
                        { isPassTouch && !isPassValid && <span style={ {color: 'rgb(218, 75, 85)'} }><GiThumbDown /></span> } 
                    </div>
                    <div className='middle-form_input'>
                        <input placeholder='Повторите пароль' type="password" name='confirmPassword' value={ registerState.confirmPassword.val || '' } onChange={ onChange } onBlur={ onBlur } style={ inputStyles(isConfirmPassTouch && !isConfirmPassValid) } />
                        { isConfirmPassTouch && isConfirmPassValid && <GiThumbUp /> }
                        { isConfirmPassTouch && !isConfirmPassValid && <span style={ {color: 'rgb(218, 75, 85)'} }><GiThumbDown /></span> }
                    </div>
                </form>
                <div className="auth-interface__bottom">
                    <button 
                        className='button-register' 
                        onClick={ () => clickRegisterBtn() } 
                        disabled={ isDisabled }
                        style={ isDisabled ? btnRegValidStyles : {} }    
                    >
                        Далее
                    </button>
                </div>
                <div className='auth-interface__bottom-errors'>
                    { isLoginTouch && !isLoginValid && <div>Логин должен быть длиной от <span style={{color: '#34c3ff'}}>3 до 16 символов</span>. Может содержать латинские буквы и цифры.</div> }
                    { isEmailTouch && !isEmailValid && <div>Введите корректный емейл.</div> }
                    { isPassTouch && !isPassValid && <div>Пароль должен быть от <span style={{color: '#34c3ff'}}>6 до 30 символов</span>, разрешено латиниские буквы, цифры и спецсимволы <span style={{color: '#34c3ff'}}>@ # $ % ^ & *</span>.</div> }
                    { isConfirmPassTouch && !isConfirmPassValid && <div>Пароли не совпадают.</div> }
                </div>
            </div>
        </Bounce>
    );
}

type LoginType = {
    login: string;
    password: string;
}

function Login() {
    const dispatch = useDispatch();
    
    const [state, setState] = useState<LoginType>({
        login: '',
        password: '',
    });

    const onChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;

        setState({
            ...state,
            [name]: value,
        });
    };

    const onClick = async () => {
        const serverResult = await serverLogin(state.login, state.password);

        dispatch(
            enqueueSnackbar({
                message: serverResult.text,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: serverResult.result ? NotifyVariant.SUCCESS : NotifyVariant.ERROR,
                    anchorOrigin: {
                        horizontal: 'center',
                        vertical: 'bottom',
                    },
                },
            })
        );
    };

    const isDisabled = state.login.length < 3 || state.password.length < 6;

    return (
        <Bounce in={ true }>
            <div className='middle-login'>
                <form className="middle-form">
                    <input placeholder='Введите логин' type="text" name='login' value={ state.login || '' } onChange={ onChange } />
                    <input placeholder='Введите пароль' type="password" name='password' value={ state.password || '' } onChange={ onChange } />
                </form>
                <div className="auth-interface__bottom">
                    <button 
                        className='button-register' 
                        disabled={ isDisabled }
                        style={ isDisabled ? btnRegValidStyles : {} }
                        onClick={ onClick }
                    >
                        Авторизоваться
                    </button>
                </div>
            </div>
        </Bounce>
    );
}

function Auth() {
    const { state: toggleState, toggle: setToggle } = useToggle(0);
    const dispatch = useDispatch();

    return (
        <Bounce in={ true }>
            <div className='auth'>
                <div className="auth-interface">
                    <div className="auth-interface__top">
                        <div className="auth-interface__login" onClick={ () => setToggle(0) } style={ {color: toggleState === 0 ? 'rgba(160, 7, 17, 1)' : ''} }>
                            Авторизация
                        </div>
                        <div className="auth-interface__register" onClick={ () => setToggle(1) } style={ {color: toggleState === 1 ? 'rgba(160, 7, 17, 1)' : ''} }>
                            Регистрация
                        </div>
                    </div>
                    <div className="auth-interface__middle">
                        { toggleState === 0 && <Login /> }
                        { toggleState === 1 && <Register /> }
                    </div>
                </div>
            </div>
        </Bounce>
    );
}

export {
    Auth,
}