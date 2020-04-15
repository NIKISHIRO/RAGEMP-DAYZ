import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom';
import './styles.css';
import { UserInterface } from "../UserInterface";
import { emitter } from "../../helpers/emitter";

function RoutesComp() {
  return (
    <div style={{position: 'absolute', top: 0, left: 0}}>
      <div>
        <ul>
          <li><a href='#' onClick={ () => emitter.emit('goToHome') }>Главная</a></li>
          <li><a href='#' onClick={ () => emitter.emit('goToUi') }>Equipment</a></li>
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
  // //// //// //// //// //// //// //// //// //// //// //// //// //// //// //
  // УДАЛИТЬ УДАЛИТЬ УДАЛИТЬ УДАЛИТЬ УДАЛИТЬ УДАЛИТЬ УДАЛИТЬ УДАЛИТЬ УДАЛИТЬ УДАЛИТЬ УДАЛИТЬ УДАЛИТЬ УДАЛИТЬ УДАЛИТЬ 
  // //// //// //// //// //// //// //// //// //// //// //// //// //// //// //
  emitter.emit('goToUi')
  // //// //// //// //// //// //// //// //// //// //// //// //// //// //// //

  return (
    <div className="app">
      <RoutesComp />
      <Switch>
        <Route exact path='/' component={ Home } />
        <Route path='/ui' component={ UserInterface } />
      </Switch>
    </div>
  );
}

export {
  App,
};
