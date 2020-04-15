import React from "react";
import { InventoryCell } from "../Inventory/InventoryCell";
import { ItemsGroundCells } from "./ItemsGroundCells";

const ItemsGround = () => {
    
    return (
        <div>
            <div className="items-ground">
                <div className="ui-top">items-ground-top</div>
                <div className="items-ground-middle">
                    <ItemsGroundCells />
                </div>
            </div>
        </div>
    );
};

export {
    ItemsGround,
}