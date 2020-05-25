import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import 'rsuite/dist/styles/rsuite-dark.css';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Root } from './components/Root';
import { rpcRegister } from './helpers/playerEvents/rpcRegister';

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// Регистрация всех RPC события для RAGEMP.
// rpcRegister(); 