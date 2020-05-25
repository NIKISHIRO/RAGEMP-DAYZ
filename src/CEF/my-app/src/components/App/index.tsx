import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom';
import './styles.css';
import { emitter } from "../../helpers/emitter";
import { NotifyComp } from "./NotifyComp";
import { useSelector, useDispatch } from "react-redux";
import { DisplayUI } from "../../reducers/UIReducer";
import { Huds } from "./Huds";
import { push } from "connected-react-router";
import { AdminInterface } from "../AdminInterface";
import { Auth } from "../StartMenu/Auth";
import { Character } from "../StartMenu/Character";
import { StartMenu } from "../StartMenu";
import { Inventory } from "../Inventory";

function RoutesComp() {
  const dispatch = useDispatch();

  return (
    <div style={{position: 'absolute', top: '50px', left: 0}}>
      <div>
        <ul>
          <li><a href='#' onClick={ () => dispatch(push('/clear')) }>clear</a></li>
          <li><a href='#' onClick={ () => dispatch(push('/UIItems')) }>Items UI</a></li>
          <li><a href='#' onClick={ () => dispatch(push('/AdminInterface')) }>Admin Interface</a></li>
          <li><a href='#' onClick={ () => dispatch(push('/auth')) }>Auth</a></li>
          <li><a href='#' onClick={ () => dispatch(push('/character')) }>Character</a></li>
          <li><a href='#' onClick={ () => dispatch(push('/StartMenu')) }>StartMenu</a></li>
        </ul>
      </div>
    </div>
  );
};

function Clear() {
  return (<div></div>);
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
        <Route exact path='/Inventory' component={ Inventory } />
        <Route exact path='/AdminInterface' component={ AdminInterface } />
        <Route exact path='/auth' component={ Auth } />
        <Route exact path='/character' component={ Character } />
        <Route exact path='/StartMenu' component={ StartMenu } />
      </Switch>
      <Redirect to="/Inventory" />
      {/* <RoutesComp /> */}
    </div>
  );
}

export {
  App,
};
