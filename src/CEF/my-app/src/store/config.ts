import { createMemoryHistory  } from 'history';
import { createStore, applyMiddleware, compose } from "redux";
import { createRootReducer } from "../reducers";
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { PlayerEvents } from '../helpers/playerEvents';

const history = createMemoryHistory({
    initialEntries: [ '/one', '/two', { pathname: '/three' } ],
    initialIndex: 1
});

const store = createStore(
    createRootReducer(history), 
    compose(
        applyMiddleware(
            routerMiddleware(history),
            thunk, 
            logger,
        ),
    ),
);

PlayerEvents(store.dispatch, store.getState);

export {
    history,
    store,
}