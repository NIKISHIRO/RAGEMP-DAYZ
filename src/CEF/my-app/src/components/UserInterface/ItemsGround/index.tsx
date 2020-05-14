import React from "react";
import { ItemsGroundCells } from "./ItemsGroundCells";
import { State } from "../../../reducers";
import { useSelector } from "react-redux";

const ItemsGround = () => {
    const state = useSelector((state: State) => state || []);

    const cssEmpty: any = {
        display: 'block',
        fontSize: '1.7rem',
        textAlign: 'center',
    };

    return (
        <div>
            <div className="items-ground">
                <div className="ui-top">Содержимое</div>
                <div className="items-ground-middle">
                    { state.UI.ground.items.length ? <ItemsGroundCells /> : <div style={cssEmpty}>Пусто</div> }
                </div>
            </div>
        </div>
    );
};

export {
    ItemsGround,
}