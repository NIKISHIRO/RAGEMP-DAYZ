import './DAYZ';

// Библиотеки расширяющие функционал.
import './modules/syncedPlayerComponent';

// Вывод доступных точек лута для игрока:
let itemPoints: number[] = [];
mp.events.addDataHandler("itemPoints", (entity: EntityMp, value: number[], oldValue) => {
    // mp.gui.chat.push(`!{#c0c0c0}'itemPoints' изменился на '${value}'. entity.type = '${entity.type}'`);
    itemPoints = value;
});

mp.events.add('render', () => {
    mp.game.graphics.drawText(`Точек для лута: ${itemPoints.length} | ИДЫ: ${itemPoints}`, [0.5, 0.005], 
    {
      font: 4,
      color: [255, 255, 255, 255],
      scale: [0.5, 0.5],
      outline: true
    });
});