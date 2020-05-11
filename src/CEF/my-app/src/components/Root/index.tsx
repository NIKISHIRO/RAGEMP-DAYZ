import React from "react";
import { Provider } from 'react-redux';
import { store } from "../../store/config";
import { ConnectedRouter } from 'connected-react-router';
import { App } from "../App";
import { history } from '../../store/config';
import { SnackbarProvider } from 'notistack';
import { DndProvider } from "react-dnd";
import MouseBackEnd from 'react-dnd-mouse-backend';

function Root() {
    return (
        <Provider store={ store }>
                <SnackbarProvider hideIconVariant={ false } maxSnack={ 5 } autoHideDuration={ 3000 }>
                    <ConnectedRouter history={ history }>
                        <DndProvider backend={ MouseBackEnd }>
                            <App />
                        </DndProvider>
                    </ConnectedRouter>
                </SnackbarProvider>
        </Provider>
    );
}

export {
    Root,
}