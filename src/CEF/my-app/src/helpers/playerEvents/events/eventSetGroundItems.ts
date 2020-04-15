import { Item } from "../../../types";
import { emitter } from "../../emitter";

const eventSetGroundItems = (items: Item[]) => {
    emitter.emit('eventSetGroundItems', items);
};

const eventSetInventorySlots = (slots: number) => {
    emitter.emit('eventSetInventorySlots', slots);
};

export {
    eventSetGroundItems,
    eventSetInventorySlots,
}