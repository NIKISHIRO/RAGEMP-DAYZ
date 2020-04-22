import React from "react";
import { Switch, Route } from 'react-router-dom';
import './styles.css';
import { ItemsUI } from "../UserInterface";
import { emitter } from "../../helpers/emitter";
import { NotifyComp } from "./NotifyComp";
import { useSelector } from "react-redux";
import { DisplayUI } from "../../reducers/UIReducer";
import { Huds } from "./Huds";

function RoutesComp() {
  return (
    <div style={{position: 'absolute', top: 0, left: 0}}>
      <div>
        <ul>
          <li><a href='#' onClick={ () => emitter.emit('goToClear') }>clear</a></li>
          <li><a href='#' onClick={ () => emitter.emit('goToUIItems') }>Items UI</a></li>
        </ul>
      </div>
    </div>
  );
};

function Clear() {
  return (<div>clear</div>);
}

function App() {
  const store = useSelector((store: any) => store || []);
  const displayUI: DisplayUI = store.UI.displayUI;
  const { huds } = displayUI;

  return (
    <div className="app">
      <Switch>
        <Route exact path='/clear' component={ Clear } />
        <Route path='/UIItems' component={ ItemsUI } />
      </Switch>
      
      { huds && <Huds />}
      <RoutesComp />
      <NotifyComp />
    </div>
  );
}

export {
  App,
};
