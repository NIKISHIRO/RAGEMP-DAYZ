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
    
    mp.game.graphics.drawText(`[TAB] Инвентарь:`, [0.9, 0.8], 
    { font: 4, color: [255, 255, 255, 255], scale: [0.3, 0.4], outline: true });

    mp.game.graphics.drawText(`[G] Зайти в инвентарь машины:`, [0.9, 0.83], 
    { font: 4, color: [255, 255, 255, 255], scale: [0.3, 0.4], outline: true });

    const pos = mp.players.local.position;
    mp.game.graphics.drawText(`[${pos.x}]-[${pos.y}]-[${pos.z}]`, [0.5, 0.95], 
    { font: 4, color: [255, 255, 255, 255], scale: [0.7, 0.6], outline: true });
});


