import React from "react";
import { InventoryCells } from "./InventoryCells";
import { useSelector } from "react-redux";
import { UIState } from "../../../reducers/UIReducer";
import { GiFullMotorcycleHelmet, GiTShirt, GiTrousers, GiSteeltoeBoots, GiBackpack } from "react-icons/gi";

function Inventory(props) {
    const state = useSelector((state: any): UIState => state.UI || []);
    const { inventory } = state;
    const { slots, items } = inventory;

    const inventoryWeight = items.reduce((acc, item) => acc + (item.data.weight * item.amount), 0);
    console.log('inventoryWeight', inventoryWeight);
    const inventoryFixWeight = Number.isInteger(inventoryWeight) ? inventoryWeight.toFixed(0) : inventoryWeight.toFixed(1);

    return (
        <div className="inventory">
            <div className="ui-top">
                Инвентарь ({ inventoryFixWeight }/{ slots })
            </div>
            <div className="inventory-middle">
                <div className="inventory-clothes">
                    <div className="clothes-item">
                        <div className="clothes-item-icon">
                            <GiFullMotorcycleHelmet />
                        </div>
                    </div>
                    <div className="clothes-item">
                        <div className="clothes-item-icon">
                            <GiBackpack />
                        </div>
                    </div>
                    <div className="clothes-item">
                        <div className="clothes-item-icon">
                            <GiTShirt />
                        </div>
                    </div>
                    <div className="clothes-item">
                        <div className="clothes-item-icon">
                            <GiTrousers />
                        </div>
                    </div>
                    <div className="clothes-item">
                        <div className="clothes-item-icon">
                            <GiSteeltoeBoots />
                        </div>
                    </div>
                </div>
                <div className="inventory-body-items">

                    <div className="inventory-body">
                        <InventoryCells />
                    </div>

                </div>    
            </div>            
        </div>
    );
};

export {
    Inventory,
}