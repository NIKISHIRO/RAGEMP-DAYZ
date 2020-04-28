import { callServer } from "../../rage-rpc";

function serverSetHealth(health) {
    callServer('server_set_health', health);
}

export {
    serverSetHealth,
}