function setInventoryBlockItem(count) {
    // Обнуляет
    $('.inventory-items').text('');
    
    let inventoryItem = `<div class="inventory-block-item"></div>`.trim();
    
    for (let i = 0; i < count; i++) {
        $('.inventory-items').append(inventoryItem);
    }
}

// Добавляет новую ячейку в inventory-items.
function addInventoryBlockItem(count = 1) {
    let inventoryItem = `<div class="inventory-block-item"></div>`.trim();

    for (let i = 0; i < count; i++) {
        $('.inventory-items').append(inventoryItem);
    }
}

// Возвращает элемент-предмет или FALSE.
function createItemOrFalse(key) {
    const item = findItemByItemKeyOrFalse(key);
    if (!item) {
        return false;
    }

    const itemKey = item.key;
    const name = item.name;
    const description = item.description;
    const image = item.image;
    const width = item.width ? item.width : '100%';
    const height = item.height ? item.height : '100%';


    return `
    <div 
        class="item"
        data-item-key="${itemKey}" 
        data-item-name="${name}"
        data-item-description="${description}"
        data-item-image="${image}"
        style="background-image: url('images/${image}')"
    >
    </div>`.trim();
}

//<img src="images/${image}" style="width: ${width}; height: ${height}">

// Добавляет предмет внутрь ячейки inventory-block-item.
function addItemInBlockItem(key, index) {
    let $blockItems = $('.inventory-block-item');
    
    if (index >= $blockItems.length - 1) {
        return console.log(`addItemInBlockItem -> Не получилось получить элемент по индексу ${index}.`);
    }

    const item = findItemByItemKeyOrFalse(key);
    if (!item) {
        return console.log('addItemInBlockItem -> Такого предмета нет!');
    }

    // Если предмет получен.
    if (item) {
        // Обнуляет ячейку.
        $blockItems.eq(index).text('');
        // Добавляет предмет в ячейку.
        const createdItem = createItemOrFalse(key);
        
        // $('.all-items').append(createdItem);
        $blockItems.eq(index).append(createdItem);
    }
}

// Возвращает объект предмета или FALSE.
function findItemByItemKeyOrFalse(key) {
    const item = getItems().find(item => item.key === key);
    if (item) {
        return item;
    }
    return false;
}

// Возвращает массив объектов предметов с описанием.
function getItems() {
    return [
        {
            key: 'item_ak47',
            name: 'AK-47',
            description: 'ak-47 top gun',
            image: '126.png',
            width: '50px',
            height: '50px',
        },
        {
            key: 'item_baseball',
            name: 'Бита',
            description: 'Пиздить по ебалу нужно',
            image: '183.png',
            width: '50px',
            height: '50px',
        }
    ];
}