import { register } from "../../rage-rpc";
import { playerInstance } from "./Player";

register('client_get_any_prop', (name: 'hunger' | 'dehydration' | 'temperature') => {
    switch (name) {
        case 'hunger': {
            return playerInstance.getHunger();
        }
        case 'dehydration': {
            return playerInstance.getDehydration();
        }
        default: {
            return false;
        }
    }
});