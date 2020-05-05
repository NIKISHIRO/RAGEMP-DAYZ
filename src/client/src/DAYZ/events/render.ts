// Вывод доступных точек лута для конкретного игрока.
let itemPoints: number[] = [];
mp.events.addDataHandler("itemPoints", (entity: EntityMp, value: number[], oldValue) => {
  if (entity.type === 'player') {
    if (entity === mp.players.local) {
      itemPoints = value;
    }
  }
});

// Функционал буквы на машине и игроке
var res = mp.game.graphics.getScreenActiveResolution(1, 1);
var entity: any = null;
var nearestObject = null;
function getLookingAtEntity() {
  let localplayer:any = mp.players.local;
  let startPosition = localplayer.getBoneCoords(12844, 0.5, 0, 0);
  let secondPoint = mp.game.graphics.screen2dToWorld3d(new mp.Vector3(res.x / 2, res.y / 2, (2 | 4 | 8)));
  if (secondPoint == undefined) return null;

  startPosition.z -= 0.3;
  const result = mp.raycasting.testPointToPoint(startPosition, secondPoint, localplayer, (2 | 4 | 8 | 16));

  if (typeof result !== 'undefined') {
      if (typeof result.entity.type === 'undefined') return null;
      if (result.entity.type == 'object' && (result.entity.getVariable('TYPE') == undefined )) return null;
      let entPos = result.entity.position;
      let lPos = localplayer.position;
      if (mp.game.gameplay.getDistanceBetweenCoords(entPos.x, entPos.y, entPos.z, lPos.x, lPos.y, lPos.z, true) > 4) return null;
      return result.entity;
  }
  return null;
}
function getNearestObjects() {
  let localplayer = mp.players.local;
  var tempO:any = null;
  if (localplayer.isInAnyVehicle(false)) {
      var players = mp.players.toArray();
      players.forEach(
          (player) => {
              var posL = localplayer.position;
              var posO = player.position;
              var distance = mp.game.gameplay.getDistanceBetweenCoords(posL.x, posL.y, posL.z, posO.x, posO.y, posO.z, true);
              if (localplayer != player && localplayer.dimension === player.dimension && distance < 2) {
                  if (tempO === null) tempO = player;
                  else if (mp.game.gameplay.getDistanceBetweenCoords(posL.x, posL.y, posL.z, posO.x, posO.y, posO.z, true) <
                      mp.game.gameplay.getDistanceBetweenCoords(posL.x, posL.y, posL.z, tempO.position.x, tempO.position.y, tempO.position.z, true))
                      tempO = player;
              }
          });
  }
  else {
      var objects = mp.objects.toArray();
      objects.forEach(
          (object) => {
              var posL = localplayer.position;
              var posO = object.position;
              var distance = mp.game.gameplay.getDistanceBetweenCoords(posL.x, posL.y, posL.z, posO.x, posO.y, posO.z, true);

              if (object.getVariable('TYPE') != undefined) {
                  if (localplayer.dimension === object.dimension && distance < 3) {
                      if (tempO === null) tempO = object;
                      else if (mp.game.gameplay.getDistanceBetweenCoords(posL.x, posL.y, posL.z, posO.x, posO.y, posO.z, true) <
                          mp.game.gameplay.getDistanceBetweenCoords(posL.x, posL.y, posL.z, tempO.position.x, tempO.position.y, tempO.position.z, true))
                          tempO = object;
                  }
              }
          });
  }
  nearestObject = tempO;
}

mp.events.add('render', () => {
    if (!mp.players.local.isInAnyVehicle(false) && !mp.players.local.isDead()) {
        entity = getLookingAtEntity();
      getNearestObjects();
    if (entity != null && entity.getVariable('INVISIBLE') == true) entity = null;
    }
    if (entity != null && !mp.players.local.isInAnyVehicle(false)) {
      mp.game.graphics.drawText("G", [entity.position.x, entity.position.y, entity.position.z], {
        font: 0,
        color: [255, 255, 255, 185],
        scale: [0.4, 0.4],
        outline: true
      });
    }
    mp.game.graphics.drawText(`Точек для лута: ${itemPoints.length} | Индексы колшипов: ${itemPoints}`, [0.5, 0.005], 
    {
      font: 4,
      color: [255, 255, 255, 255],
      scale: [0.5, 0.5],
      outline: true
    });
    
    mp.game.graphics.drawText(`[TAB] Инвентарь:`, [0.9, 0.8], 
    { font: 4, color: [255, 255, 255, 255], scale: [0.3, 0.4], outline: true });

    mp.game.graphics.drawText(`[G] Зайти в инвентарь машины:`, [0.9, 0.83], 
    { font: 4, color: [255, 255, 255, 255], scale: [0.3, 0.4], outline: true });

    mp.game.graphics.drawText(`[F6] HUDS:`, [0.9, 0.86], 
    { font: 4, color: [255, 255, 255, 255], scale: [0.3, 0.4], outline: true });

    const pos = mp.players.local.position;
    mp.game.graphics.drawText(`[${pos.x}]-[${pos.y}]-[${pos.z}]`, [0.5, 0.95], 
    { font: 4, color: [255, 255, 255, 255], scale: [0.7, 0.6], outline: true });
});