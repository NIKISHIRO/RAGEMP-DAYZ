import React from "react";
import { InventoryCell } from "../InventoryCell";
import { Item } from "../../../../../types/item";

type Props = {
    items: Item[]
}

function InventoryCells(props) {
    const { items } = props;
    
    const getItems = () => items.map((item, i) => <InventoryCell key={i} cellIdx={i} item={item} />);

    return (
        <div>
            <div className="body-cells">
                { getItems() }
            </div>
        </div>
    );
}

export {
    InventoryCells,
}