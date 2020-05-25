import React from "react";
import { useDrag, useDrop } from 'react-dnd'
import './inventory.css';
import { InventoryCells } from "./InventoryCells";
import { GroundItems } from "./GroundItems";
import { Preview } from "./Preview";

function Inventory() {
    return (
        <div className="inventory-container">
            <div className='inventory'>
                <div className="inventory-clothes">
                    <div className="inventory-cells">
                        <div className="inventory-cell"></div>
                    </div>
                </div>

                <InventoryCells />

                <div className="inventory-storage">
                    <GroundItems />
                </div>
            </div>

            <Preview />
        </div>
    );
}

export {
    Inventory,
}