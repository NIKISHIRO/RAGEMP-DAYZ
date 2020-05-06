import { register, callServer } from "../../rage-rpc";

register('client_get_ammo_in_clip', (player) => {
    return player.getAmmoInClip()
})
