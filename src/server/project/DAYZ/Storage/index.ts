import { Item, ItemKey, ItemType, ItemRarity } from "../types"
import { EventEmitter } from "events";
import { CommonItem } from "../loot/Item/Item";

type Storage = {
    _slots: number;
    _storage: Item[];

    getFirstEmptySlotIndex: () => number;
    getStorage: () => Item[];
    getEmptySlots: () => number;
    putItem: (item: Item, idx: number) => void;
    setEmptyCells: (slots: number) => void;
};

type Result = {
    result: boolean;
    rest: number;
};

class InventoryScript extends EventEmitter {
    _items: any;

    constructor() {
        super();
        this._items = {};
    }

    addItem(
        key: string, 
        name: string, 
        description: string, 
        onUse: (player: PlayerMp, idx: number, itemKey: string, itemData: any) => void, 
    ) {
        if (typeof key !== "string" || key.length < 1) {
            console.error("addItem: Key was not a string/was an empty string.");
            return null;
        } else if (typeof name !== "string" || name.length < 1) {
            console.error(`addItem: Name was not a string/was an empty string. (${key})`);
            return null;
        } else if (typeof description !== "string") {
            console.error(`addItem: Description was not a string. (${key})`);
            return null;
        } else if (this._items.hasOwnProperty(key)) {
            console.error(`addItem: Item (${key}) already exists.`);
            return null;
        }
        
        this._items[key] = {
            name: name,
            description: description,
            onUse: onUse,
        };

        this.emit("itemDefined", key, name, description);
        return this._items[key];
    }

    /**
     * Returns whether the specified key is a registered or not.
     * @param  {string}  key Item identifier, such as "item_medkit".
     * @return {Boolean}     True if registered, false otherwise.
     */
    hasItem(key) {
        return this._items.hasOwnProperty(key);
    }

    /**
     * Returns the specified item.
     * @param  {string} key Item identifier, such as "item_medkit".
     * @return {object}     The item at the specified key, will be undefined if the key isn't registered.
     */
    getItem(key) {
        return this._items[key];
    }

    /**
     * Returns all registered item identifiers.
     * @return {string[]} An array of registered item identifiers.
     */
    getAllItems() {
        return Object.keys(this._items);
    }

    /**
     * Returns the human readable name of the specified item.
     * @param  {string} key Item identifier, such as "item_medkit".
     * @param  {string} [data] Optional - An object that has item attributes.
     * @return {string}     Human readable item name.
     */
    getItemName(key, data) {
        return this.hasItem(key) ? (typeof this._items[key].nameFunc === "function" ? this._items[key].nameFunc(data) : this._items[key].name) : "Invalid Item";
    }
}

const storageScript = new InventoryScript();
storageScript.on("itemDefined", (key, name, description) => {
    console.log(`Item defined, key: ${key} | name: ${name} | description: ${description}`);
});

const storage: Storage = {
    _slots: 10,
    _storage: [],
    getStorage: function() {
        return this._storage;
    },
    getFirstEmptySlotIndex: function() {
        return this._storage.findIndex(i => !i);
    },
    getEmptySlots: function() {
        return this._storage.reduce((acc, val) => {
            if (!val) {
                return acc + 1;
            }

            return 0;
        }, 0);
    },
    setEmptyCells: function(slots: number) {
        this._storage = new Array(slots).fill(null);
    },
    putItem: function(item: Item, cellIdx: number): Result {
        const putItem = this._storage[cellIdx];
        const newItem = {...item};

        // Кладем в пустую ячейку.
        if (!putItem) {
            console.log('Кладем в пустую ячейку');
            this._storage[cellIdx] = newItem;
            return { result: true, rest: 0 };
        }

        // Если предметы разные - ничего не делать.
        if (item.key != putItem.key) {
            console.log('предметы разные.');
            return { result: false, rest: 0 };
        }

        // Если предметы 1-го типа.
        if (item.key == putItem.key) {
            console.log('Предметы 1-го типа.');
            
            if (!item.data.hasOwnProperty('maxStackCount')) {
                console.log('item не имеет maxStackCount.');
                return { result: false, rest: 0 };
            }
            
            const msc = item.data.maxStackCount;
            const sum = item.amount + putItem.amount;

            if (msc <= 1) {
                console.log('msc <= 1.');
                return { result: false, rest: 0 };
            }
            else if (sum > msc) {
                console.log('sum > msc.');
                newItem.amount = msc;
                this._storage[cellIdx] = newItem;
                return { result: true, rest: sum - msc };
            }
            else if (sum <= msc) {
                console.log('sum <= msc.');
                this._storage[cellIdx] = newItem;
                return { result: true, rest: 0 };
            }
        }

        return { result: false, rest: 0 };
    }
};

mp.events.add('playerJoin', (player: PlayerMp) => {
    player.setEmptyCells(player._slots);
    console.log('getEmptySlots()', player.getEmptySlots()); 
});

// Установка методов и св-в хранилища сущностям.
const setEntitiesPrototype = () => {
    // Общие.
    ['Player', 'Vehicle']
    .forEach(entity => {
        mp[entity].prototype._slots = storage._slots;
        mp[entity].prototype._storage = storage._storage;
        mp[entity].prototype.getStorage = storage.getStorage;
        mp[entity].prototype.getEmptySlots = storage.getEmptySlots;
        mp[entity].prototype.getFirstEmptySlotIndex = storage.getFirstEmptySlotIndex;
        mp[entity].prototype.setEmptyCells = storage.setEmptyCells;
        mp[entity].prototype.putItem = storage.putItem;
    });

    mp.Player.prototype.useItem = function(idx: number): boolean {
        if (this._storage[idx] && this._storage[idx].amount > 0) {
            const item = {...this._storage[idx]};
            const itemDef = storageScript.getItem(item.key);
            itemDef.onUse(this, idx, item.key, item.data);
            storageScript.emit("itemUsed", this, idx, item.key, item.data);
            return true;
        }

        return false;
    };
}

setEntitiesPrototype();

export {
    storageScript,
}