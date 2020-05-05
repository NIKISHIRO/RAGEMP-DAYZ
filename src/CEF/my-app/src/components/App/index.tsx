import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom';
import './styles.css';
import { ItemsUI } from "../UserInterface";
import { emitter } from "../../helpers/emitter";
import { NotifyComp } from "./NotifyComp";
import { useSelector, useDispatch } from "react-redux";
import { DisplayUI } from "../../reducers/UIReducer";
import { Huds } from "./Huds";
import { push } from "connected-react-router";
import { AdminInterface } from "../AdminInterface";

function RoutesComp() {
  const dispatch = useDispatch();

  return (
    <div style={{position: 'absolute', top: '50px', left: 0}}>
      <div>
        <ul>
          <li><a href='#' onClick={ () => dispatch(push('/clear')) }>clear</a></li>
          <li><a href='#' onClick={ () => dispatch(push('/UIItems')) }>Items UI</a></li>
          <li><a href='#' onClick={ () => dispatch(push('/AdminInterface')) }>Admin Interface</a></li>
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
      { huds && <Huds />}
      <NotifyComp />      
      <Switch>
        <Route exact path='/clear' component={ Clear } />
        <Route exact path='/UIItems' component={ ItemsUI } />
        <Route exact path='/AdminInterface' component={ AdminInterface } />
        <Redirect to="/AdminInterface" />
      </Switch>
      <RoutesComp />
    </div>
  );
}

export {
  App,
};
