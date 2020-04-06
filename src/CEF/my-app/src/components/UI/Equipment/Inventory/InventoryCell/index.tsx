import React from "react";
import { InventoryItem } from "../InventoryItem";
import { Item } from "../../../../../types/item";

type Props = {
    cellIdx: number;
    item: Item;
}

function InventoryCell(props: Props) {
    const { item, cellIdx } = props;

    // Устанавливаю индекс ячейки предмету в которой он лежит.
    if (item !== null) {
        item.data['cellIdx'] = cellIdx;
    }

    const dropData = { cellIdx };
    
    return (
        <div className="cells-cell">
            { item ? <InventoryItem item={ item } /> : null }
        </div>
    );
}

export {
    InventoryCell,
}