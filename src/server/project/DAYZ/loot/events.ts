import { Player } from "../player/Player";
import { Item } from "../types";
import { CallRPC } from "../CallRPC";

mp.events.add({
    'playerEnterColshape': (player: PlayerMp, shape: ColshapeMp) => {
    },

    'playerExitColshape': (player: PlayerMp, shape: ColshapeMp) => {
    },
});