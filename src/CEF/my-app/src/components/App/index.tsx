import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom';
import 'rsuite/dist/styles/rsuite-default.css';
import './styles.css'
import { Equipment } from "../UI/Equipment";
import { emitter } from "../../helpers/emitter";

function RoutesComp() {
  return (
    <div style={{position: 'absolute', top: 0, left: 0}}>
      <div>
        <ul>
          <li><a href='#' onClick={ () => emitter.emit('goToHome') }>Главная</a></li>
          <li><a href='#' onClick={ () => emitter.emit('goToEquipment') }>Equipment</a></li>
        </ul>
      </div>
    </div>
  );
};

function Home({ history }) {
  console.log('history');

  return (
    <div>Всем привет, я хоме.</div>
  );
}

function App(props) {
  return (
    <div className="app">
      <RoutesComp />
      <Switch>
        <Route exact path='/' component={ Home } />
        <Route path='/equipment' component={ Equipment } />
      </Switch>
    </div>
  );
}

export {
  App,
};
