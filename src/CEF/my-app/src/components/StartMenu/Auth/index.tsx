import React, { useState } from "react";
import './auth.css';
import { useToggle } from "@umijs/hooks";
import { useDispatch } from "react-redux";
import { enqueueSnackbar, NotifyVariant } from "../../../actions/notificationActions";
import { GiThumbUp, GiThumbDown } from "react-icons/gi";
import { serverRegister, serverLogin } from "../../../helpers/playerEvents/rpcCall";
import { Previous } from "../Previous";
import { push } from "connected-react-router";
import { Animation, Whisper, Tooltip } from 'rsuite';
const { Bounce } = Animation;

type RegisterType = {
    login: {
        val: string;
        isValid: boolean;
        isTouch: boolean,
        regular: RegExp;
    };
    password: {
        val: string;
        isValid: boolean;
        isTouch: boolean,
        regular: RegExp;
    };
    confirmPassword: {
        val: string;
        isTouch: boolean,
        isValid: boolean;
    };
    email: {
        val: string;
        isValid: boolean
        isTouch: boolean,
        regular: RegExp,
    }
}

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
    const dispatch = useDispatch();

    const [state, setState] = useState<RegisterType>({
        login: {
            val: '',
            isValid: false,
            isTouch: false,
            regular: /^[a-z0-9_-]{3,16}$/,
        },
        password: {
            val: '',
            isValid: false,
            isTouch: false,
            regular: /^[0-9a-zA-Z!@#$%^&*]{6,30}$/,
        },
        email: {
            val:'',
            isValid: false,
            isTouch: false,
            regular: /.+@.+\..+/i,
        },
        confirmPassword: {
            val: '',
            isValid: false,
            isTouch: false,
        }
    });

    const isLoginValid = state.login.isValid;
    const isLoginTouch = state.login.isTouch;
    const isEmailValid = state.email.isValid;
    const isEmailTouch = state.email.isTouch;
    const isPassValid = state.password.isValid;
    const isPassTouch = state.password.isTouch;
    const isConfirmPassValid = state.confirmPassword.isValid;
    const isConfirmPassTouch = state.confirmPassword.isTouch;

    const checkData = () => {
        const newState = {...state};
        newState.login.isValid = state.login.regular.test(state.login.val); 
        newState.email.isValid = state.email.regular.test(state.email.val); 
        newState.password.isValid = state.password.regular.test(state.password.val);
        newState.confirmPassword.isValid = newState.confirmPassword.val === newState.password.val; 

        setState({...newState});
    };

    const clickLoginBtn = async () => {
        if (isLoginValid && isPassValid && isConfirmPassValid) {
            const { login, email, password } = state;
            const serverResult = await serverRegister(login.val, email.val, password.val);
            
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
        }
    };

    const onChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        const newState = {...state};
        newState[name].val = value;
        setState(newState);
        checkData();
    };

    const onBlur = (event: any) => {
        const name = event.target.name;
        const newState = {...state};
        newState[name].isTouch = true;
        setState(newState);
    };

    return (
        <Bounce in={ true }>
            <div className='middle-register'>
                <form className="middle-form">
                    <div className='middle-form_input'>
                        <input placeholder='Логин(Никнейм)' type="text" name='login' value={ state.login.val || '' } onChange={ onChange } onBlur={ onBlur } style={ inputStyles(isLoginTouch && !isLoginValid) } />
                        { isLoginTouch && isLoginValid && <GiThumbUp /> }
                        { isLoginTouch && !isLoginValid && <span style={ {color: 'rgb(218, 75, 85)'} }><GiThumbDown /></span> } 
                    </div>
                    <div className='middle-form_input'>
                        <input placeholder='Емейл' type="email" name='email' value={ state.email.val || '' } onChange={ onChange } onBlur={ onBlur } style={ inputStyles(state.email.isTouch && !state.email.isValid) } />
                        { isEmailTouch && isEmailValid && <GiThumbUp /> }
                        { isEmailTouch && !isEmailValid && <span style={ {color: 'rgb(218, 75, 85)'} }><GiThumbDown /></span> } 
                    </div>
                    <div className='middle-form_input'>
                        <input placeholder='Введите пароль' type="password" name='password' value={ state.password.val || '' } onChange={ onChange } onBlur={ onBlur } style={ inputStyles(isPassTouch && !isPassValid) } />
                        { isPassTouch && isPassValid && <GiThumbUp /> }
                        { isPassTouch && !isPassValid && <span style={ {color: 'rgb(218, 75, 85)'} }><GiThumbDown /></span> } 
                    </div>
                    <div className='middle-form_input'>
                        <input placeholder='Повторите пароль' type="password" name='confirmPassword' value={ state.confirmPassword.val || '' } onChange={ onChange } onBlur={ onBlur } style={ inputStyles(isConfirmPassTouch && !isConfirmPassValid) } />
                        { isConfirmPassTouch && isConfirmPassValid && <GiThumbUp /> }
                        { isConfirmPassTouch && !isConfirmPassValid && <span style={ {color: 'rgb(218, 75, 85)'} }><GiThumbDown /></span> }
                    </div>
                </form>
                <div className="auth-interface__bottom">
                    <button 
                        className='button-register' 
                        onClick={ () => clickLoginBtn() } 
                        disabled={ !isLoginValid || !isPassValid || !isConfirmPassValid }
                        style={ !isLoginValid || !isPassValid || !isConfirmPassValid ? btnRegValidStyles : {} }    
                    >
                        Зарегистрироваться
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
                    <div onClick={ () => dispatch(push('/StartMenu')) } className='auth-previous'>
                        <Previous />
                    </div>

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