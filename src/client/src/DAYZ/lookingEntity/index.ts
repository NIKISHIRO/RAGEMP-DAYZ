import { playerInstance } from "../player/Player";
import { Item } from "../../interfaces";

mp.events.add('render', () => {
    let startPos = mp.players.local.getBoneCoords(12844, 0.5, 0, 0);
    startPos.z -= .3;
    var res = mp.game.graphics.getScreenActiveResolution(1, 1);
    let endPos = mp.game.graphics.screen2dToWorld3d(new mp.Vector3(res.x / 2, res.y / 2, 0));

    // Получаем raycastResult или Null сущности дист. до X метров от игрока.
    const result = playerInstance.getLookingAtEntity(3);
    // Обнуляем объект на который смотрит игрок.
    playerInstance.setLookingData(null);

    if (!endPos) return;
    // mp.game.graphics.drawLine(startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z, 255, 255, 255, 255);
    if (!result) return;

    if (result.entity) {
        // Устанавливаем игроку инфу о том на какую сущность он смотрит.
        playerInstance.setLookingData(result.entity);

        switch (result.entity.type) {
            // Если видимая сущность объект.
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
                playerInstance.setLookingData(null);
            }
        }
    }
});
