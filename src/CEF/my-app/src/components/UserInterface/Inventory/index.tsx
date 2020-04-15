import React from "react";
import { InventoryCells } from "./InventoryCells";

type Props = {
    slots: number;
} 

const Inventory = (props: Props) => {
    const { slots } = props;

    return (
        <div className="inventory">
            <div className="ui-top">
                Инвентарь ({ slots })
            </div>
            <div className="inventory-middle">
                <div className="inventory-clothes">
                    <div className="clothes-item"></div>
                    <div className="clothes-item"></div>
                    <div className="clothes-item"></div>
                    <div className="clothes-item"></div>
                    <div className="clothes-item"></div>
                    <div className="clothes-item"></div>
                    <div className="clothes-item"></div>
                    <div className="clothes-item"></div>
                    <div className="clothes-item"></div>
                </div>
                <div className="inventory-body-items">

                    <div className="inventory-body-left">
                        <InventoryCells />
                    </div>

                    <div className="inventory-body-right">
                        inventory-body-right  
                    </div>

                </div>    
            </div>            
        </div>
    );
};

export {
    Inventory,
}