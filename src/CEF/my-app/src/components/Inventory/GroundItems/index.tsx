import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../reducers";
import { InventoryCell } from "../InventoryCell";
import shortid from 'shortid';

function GroundItems() {
    const state = useSelector((state: State) => state || []);
    const { groundItems } = state.inventory;

    return (
        <div>
            <div className="ground-items__title">
                Содержимое
            </div>
            <div className='inventory-cells'>
                { groundItems.map((item, idx) => item
                    ?
                    <span key={ item.data.shortid }><InventoryCell itemsType='groundItems' item={ item } id={ idx } /></span>
                    :
                    <span key={ shortid.generate() }><InventoryCell itemsType='groundItems' item={ item } id={ idx } /></span>
                )}
            </div>
        </div>
    );
}

export {
    GroundItems,
}