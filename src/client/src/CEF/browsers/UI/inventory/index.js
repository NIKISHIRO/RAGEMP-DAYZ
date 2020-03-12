// Устанавливает 12 ячеек.
setInventoryBlockItem(12);

// Добавляет предмет в ячейку по индексу.

const data = {
  type: 'ARMOUR',
  defence: 40,
  name: 'Бронежелет',
  description: 'Бронежелет 3 уровня. Увеличивает ваш армор до 50%',
  maxStackCount: 1,
};
const item = { key: 'item_weapon_ak47', amount: 5, data: data };

const data2 = {
  type: 'ARMOUR',
  defence: 40,
  name: 'Бронежелет',
  description: 'Бронежелет 3 уровня. Увеличивает ваш армор до 50%',
  maxStackCount: 1,
};
const item2 = { key: 'item_baseball', amount: 1, data: data };

addItemInFirstEmptyCell(item2);
addItemInBlockItem(item2, 5);

const items = getItemsInCellByItemKey('item_baseball');
console.log('items', items);

DNDItemsInit();
eventsINIT();

// Делаем ДРАГОМ весь инвентарь.
$('.ui').draggable(
  {
    handle: '.ui-top',
    containment: 'body',
    drag: function(event, ui) {},
});