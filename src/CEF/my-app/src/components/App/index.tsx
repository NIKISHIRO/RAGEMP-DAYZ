import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom';
import './styles.css';
import { ItemsUI } from "../UserInterface";
import { emitter } from "../../helpers/emitter";
import { connect } from "react-redux";
import { State } from "../../reducers";
import { UIState } from "../../reducers/UIReducer";
import { NotifyComp } from "./NotifyComp";

function RoutesComp() {
  return (
    <div style={{position: 'absolute', top: 0, left: 0}}>
      <div>
        <ul>
          <li><a href='#' onClick={ () => emitter.emit('goToHome') }>Главная</a></li>
          <li><a href='#' onClick={ () => emitter.emit('goToUi') }>Items UI</a></li>
        </ul>
      </div>
    </div>
  );
};

function Home() {
  console.log('history');

  return (
    <div>Всем привет, я хоме.</div>
  );
}


function App() {
  emitter.emit('goToUi');

  return (
    <div className="app">
      <RoutesComp />
      <Switch>
        <Route exact path='/' component={ Home } />
        <Route path='/ui' component={ ItemsUI } />
      </Switch>
      <NotifyComp />
    </div>
  );
}

export {
  App,
};
