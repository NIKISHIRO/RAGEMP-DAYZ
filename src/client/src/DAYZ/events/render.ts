// Вывод доступных точек лута для конкретного игрока.
let itemPoints: number[] = [];
mp.events.addDataHandler("itemPoints", (entity: EntityMp, value: number[], oldValue) => {
  if (entity.type === 'player') {
    if (entity === mp.players.local) {
      itemPoints = value;
    }
  }
});

mp.events.add('render', () => {
    mp.game.graphics.drawText(`Точек для лута: ${itemPoints.length} | Индексы колшипов: ${itemPoints}`, [0.5, 0.005], 
    {
      font: 4,
      color: [255, 255, 255, 255],
      scale: [0.5, 0.5],
      outline: true
    });
});