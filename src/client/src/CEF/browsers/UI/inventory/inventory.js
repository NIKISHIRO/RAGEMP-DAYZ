function c_set_inventory_slots(slots) {
    console.log('c_set_inventory_slots', slots);
    setInventoryBlockItem(slots);
}

function c_add_inventory_item(item) {
    console.log('c_add_inventory_item', item);
    addItemInBlockItem(item, 0);


    // получить инфу о ячейках в которых есть предмет с "item.key" ключом.
    const items = getItemsInCellByItemKey(item.key);
    
}

// Возвращает массив объектов с объектом ДатаАтрибутов об предмете в ячейке
// и индекс ячейки с этим предметом.
function getItemsInCellByItemKey(itemKey) {
    const invState = getInventoryState();

    const items = [];
    invState.forEach((item, idx) => {
        if (item && item.itemKey === itemKey) {
            items.push({
                itemData: item,
                index: idx
            }); 
        }
    })
    return items;
}

// Добавляет предмет внутрь ячейки inventory-block-item.
function addItemInBlockItem(item, index) {
    let $blockItems = $('.inventory-block-item');
    
    if (index > $blockItems.length - 1) {
        return console.log(`addItemInBlockItem -> Не получилось добавить предмет в ячейку по индексу ${index}.`);
    }

    const itemData = findItemByItemKeyOrFalse(item.key);
    if (!itemData) {
        return console.log('addItemInBlockItem -> Такого предмета нет!');
    }

    // Если предмет получен.
    if (itemData) {
        // Обнуляет ячейку.
        $blockItems.eq(index).text('');
        // Добавляет предмет в ячейку.
        const createdItem = createItemOrFalse(item);
        $blockItems.eq(index).append(createdItem);
        // console.log('СОСТОЯНИЕ ИНВЕНТАРЯ:', getInventoryState())
    }
}

// Устанавливает инв. в UI взяв данные с сервака.
function setInventoryInfo(inventoryInfo) {
    console.log('inventoryInfo');
    console.log(inventoryInfo);
    
    const inventory = inventoryInfo.inventory;
    const maxSlots = inventoryInfo.maxSlots;

    // Установить слоты.
    setInventoryBlockItem(maxSlots);
    // Добавить предмет в первую пустую ячейку.
    inventory.forEach(item => {
        addItemInFirstEmptyCell(item);
    });

    DNDItemsInit();
}

// Добавляет предмет в первую пустую ячейку. ЕСЛИ пустых нет, то не добавит.
function addItemInFirstEmptyCell(item) {
    if (!item) {
        return console.log('addItemInFirstEmptyCell -> item не может быть пустым!');
    }
    
    $('.inventory-block-item').each((idx, cell) => {
        if (cell.childElementCount == 0) {
            addItemInBlockItem(item, idx);
            return false;
        }
    });
}

// Получить состояние инвентаря.
function getInventoryState() {
    const invState = [];

    $('.inventory-block-item').each((idx, item) => {
        const $itemChildren = $(item).children();

        if ($itemChildren.length) {
            const dataChildData = $itemChildren.data();
            invState.push(dataChildData);
        } else {
            invState.push(null);
        }
    });

    return invState;
}

// Устанавливает Х-ячеек в инвентаре.
function setInventoryBlockItem(count) {
    // Обнуляет
    $('.inventory-items').text('');
    
    let inventoryBlockItem = `<div class="inventory-block-item"></div>`;
    
    for (let i = 0; i < count; i++) {
        $('.inventory-items').append(inventoryBlockItem);
    }
}

// Добавляет новую ячейку в inventory-items.
function addInventoryBlockItem(count = 1) {
    let inventoryItem = `<div class="inventory-block-item"></div>`;

    for (let i = 0; i < count; i++) {
        $('.inventory-items').append(inventoryItem);
    }
}

// Возвращает элемент-предмет или FALSE.
function createItemOrFalse(item) {
    if (!item) {
        return false;
    }

    const itemKey = item.key;
    const name = item.data.name;
    const description = item.data.description;
    const amount = item.amount;
    const itemData = findItemByItemKeyOrFalse(item.key);
    const image = itemData.image;

    return `
    <div 
        class="item"
        data-item-key="${itemKey}"
        data-item-name="${name}"
        data-item-description="${description}"
        data-item-image="${image}"
        data-item-amount="${amount}"
        style="background-image: url('images/${image}');"
    >
        <span class="item-amount">${amount}</span>
    </div>`.trim();
}

// Возвращает объект предмета или FALSE.
function findItemByItemKeyOrFalse(key) {
    const item = getItems().find(item => item.key === key);
    if (item) {
        return item;
    }
    return false;
}

function DNDItemsInit() {
    let $inventoryItems = $('.inventory-items');
    let $blockItems = $('.inventory-block-item');
    let $items = $('.item');

    // Делаем ДРАГОМ все элементы с классом "item".
    $items.draggable({
        // PROPS:
        revert: true,
        containment: '.ui-center',
        stack: $items,
        delay: 0
    });
    // Делаем ДРОПОМ все элементы с классом "inventory-block-item".
    $blockItems.droppable({
        drop: function(event, ui) {
            const dragElement = ui.draggable;
            const dropElement = $(this);    
        
            // Если ячейка не пустая - обмен предметами.
            if (dropElement.children().length > 0) {
                // Предмет ячкйки на которую мы кладем другой предмет.
                const itemInAnotherCell = dropElement.children().eq(0);

                // Ячейка перемещаемого предмета.
                const currentDragCell = dragElement.parent().eq(0);
                
                // Кладем в ячейку(НА которую наводимся) предмет.
                dropElement.append(dragElement);
                currentDragCell.append(itemInAnotherCell);

                console.log('--> ОБМЕН ПРЕДМЕТАМИ.')
            } else {
                // Вставляю предмет в ячейку.
                dropElement.append(dragElement);
                console.log('--> ПРОСТОЕ ПЕРЕМЕЩЕНИЕ ПРЕДМЕТА.')
            }
            // Смещаю предмет, относительно координат ячейки.
            dragElement.offset({
                top: dropElement.offset().top + 5,
                left: dropElement.offset().left + 5,
            });
        },
    });
}

function eventsINIT() {
    // $('.item').on('click', );
}

// Возвращает массив объектов предметов с описанием.
function getItems() {
    return [
        {
            key: 'item_weapon_ak47',
            image: '126.png',
        },
        {
            key: 'item_baseball',
            image: '183.png',
        },
        {
            key: 'item_armour',
            image: '-9.png',
        }
    ];
}