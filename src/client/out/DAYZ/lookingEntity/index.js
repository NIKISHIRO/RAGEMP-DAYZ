"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("../player/Player");
mp.events.add('render', () => {
    let startPos = mp.players.local.getBoneCoords(12844, 0.5, 0, 0);
    startPos.z -= .3;
    var res = mp.game.graphics.getScreenActiveResolution(1, 1);
    let endPos = mp.game.graphics.screen2dToWorld3d(new mp.Vector3(res.x / 2, res.y / 2, 0));
    const result = Player_1.playerInstance.getLookingAtEntity(3);
    Player_1.playerInstance.setLookingData(null);
    if (!endPos)
        return;
    if (!result)
        return;
    if (result.entity) {
        Player_1.playerInstance.setLookingData(result.entity);
        switch (result.entity.type) {
            case 'object': {
                const object = mp.objects.atRemoteId(result.entity.remoteId);
                const objPos = object.position;
                let text = '[E] Loot';
                mp.game.graphics.drawText(text, [objPos.x, objPos.y, objPos.z], {
                    font: 0,
                    color: [255, 255, 255, 255],
                    scale: [.3, .3],
                    outline: false,
                });
                break;
            }
            case 'vehicle': {
                const vehicle = mp.vehicles.atRemoteId(result.entity.remoteId);
                const pos = vehicle.position;
                let text = '[E] Vehicle';
                mp.game.graphics.drawText(text, [pos.x, pos.y, pos.z], {
                    font: 0,
                    color: [255, 255, 255, 255],
                    scale: [.3, .3],
                    outline: false,
                });
                break;
            }
            default: {
                Player_1.playerInstance.setLookingData(null);
            }
        }
    }
});
