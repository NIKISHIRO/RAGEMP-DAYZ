// Вывод доступных точек лута для игрока:
let itemPoints: number[] = [];
mp.events.addDataHandler("itemPoints", (entity: EntityMp, value: number[], oldValue) => {
    itemPoints = value;
});

// mp.events.add('entityStreamIn', (entity) => {
//   mp.gui.chat.push(entity.type);
// });

mp.keys.bind(0x47, true, function() {
  mp.events.callRemote('keypress:G');
});