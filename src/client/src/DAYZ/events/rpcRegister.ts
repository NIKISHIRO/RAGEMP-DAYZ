import { register } from "../../rage-rpc";
import { playerInstance } from "../player/Player";

register('client_get_ground_z', (position: Vector3Mp): number => {
    return mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, position.z, parseFloat('0'), false);
});

// Отправка данных об созданных объектах в CEF.
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