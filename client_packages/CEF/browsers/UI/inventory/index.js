// Устанавливает 12 ячеек.
setInventoryBlockItem(5);

// Добавляет предмет в ячейку по индексу.
// addItemInBlockItem('item_baseball', 4);
// addItemInBlockItem('item_baseball', 2);
// addItemInBlockItem('item_baseball', 1);
// addItemInBlockItem('item_baseball', 7);
// addItemInBlockItem('item_ak47', 0);

addItemInFirstEmptyCell('item_ak47'); 
addItemInFirstEmptyCell('item_ak47');
addItemInFirstEmptyCell('item_ak47'); 
addItemInFirstEmptyCell('item_ak47');
addItemInFirstEmptyCell('item_ak47');
addItemInFirstEmptyCell('item_ak47');


// Инициал. переменных.
let $ui = $('.ui');
let $inventoryItems = $('.inventory-items');
let $blockItems = $('.inventory-block-item');
let $items = $('.item');

/* 
  1) В момент когда ДРАГ кладется на ДРОП, ножно ДРАГ(который положился на ДРОП) вырванить по
  ячейке на которую его положили.

*/

// Делаем ДРАГОМ весь инвентарь.
$ui.draggable({
    handle: '.ui-top',
    containment: 'body',
    drag: function(event, ui) {},
});
// Делаем ДРАГОМ все элементы с классом "item".
$items.draggable({
  // PROPS:
  revert: true,
  containment: '.ui-center',
  stack: $items,
  // EVENTS:
  create: function(event, ui) {
    console.log('draggable -> create', ui);
  },
  start: function(event, ui) {
    console.log('draggable -> start', ui);
  },
  drag: function(event, ui) {
    console.log('draggable -> drag', ui);
  },
  stop: function(event, ui) {
    console.log('draggable -> stop', ui)
  },
});
// Делаем ДРОПОМ все элементы с классом "inventory-block-item".
$blockItems.droppable({
  drop: function(event, ui) {
    const dragElement = ui.draggable;
    const dropElement = $(this);    console.log('droppable -> drop', ui);
    console.log('dragElement', dragElement);
    console.log('dropElement.children', dropElement);

    // Если ячейка не пустая - запретить класть предмет.
    if (dropElement.children().length > 0) {
      // Предмет ячкйки на которую мы кладем другой предмет.
      const itemInAnotherCell = dropElement.children().eq(0);
      console.log('itemInAnotherCell', itemInAnotherCell);
      // Ячейка перемещаемого предмета.
      const currentDragCell = dragElement.parent().eq(0);
      console.log('currentDragCell', currentDragCell);
      // Кладем в ячейку(НА которую наводимся) предмет.
      dropElement.append(dragElement);
      currentDragCell.append(itemInAnotherCell);
    } else {
    // Вставляю предмет в ячейку.
      dropElement.append(dragElement);
    }
    // Смещаю предмет, относительно координат ячейки.
    dragElement.offset({
      top: dropElement.offset().top + 5,
      left: dropElement.offset().left + 5,
    });
  },
  create: function(event, ui) {
    console.log('droppable -> create');
  },
  activate: function(event, ui) {
    console.log('droppable -> activate');
  },
  deactivate: function(event, ui) {
    console.log('droppable -> deactivate');
  },
  over: function(event, ui) {
    console.log('droppable -> over');
  },
  out: function(event, ui) {
    console.log('droppable -> out');
    const dragElement = ui.draggable;
    const dropElement = $(this);
  },
});