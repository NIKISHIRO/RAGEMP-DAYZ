import rageRpc from "../../../rage-rpc";

export type DisplayUI = {
    huds: boolean;
}

function setDisplayInterface(name: string, bool: boolean) {
    rageRpc.callServer('server_set_display', JSON.stringify({name, bool}));
}

export {
    setDisplayInterface,
}