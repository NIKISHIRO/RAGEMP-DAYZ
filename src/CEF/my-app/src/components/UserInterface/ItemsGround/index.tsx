import React from "react";
import { ItemsGroundCells } from "./ItemsGroundCells";

const ItemsGround = () => {
    
    return (
        <div>
            <div className="items-ground">
                <div className="ui-top">Предметы на земле</div>
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