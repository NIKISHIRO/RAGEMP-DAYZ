import React from "react";
import { Provider } from 'react-redux';
import { store } from "../../store/config";
import { ConnectedRouter } from 'connected-react-router'
import { App } from "../App";
import { history } from '../../store/config';

function Root() {
    return (
        <Provider store={ store }>
            <ConnectedRouter history={ history }>
                <App />
            </ConnectedRouter>
        </Provider>
    );
}

export {
    Root,
}