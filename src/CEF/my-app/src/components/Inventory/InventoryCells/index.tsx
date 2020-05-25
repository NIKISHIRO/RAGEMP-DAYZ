import React from "react";
import '../inventory.css';
import { State } from "../../../reducers";
import { useSelector, useDispatch } from "react-redux";
import { InventoryCell } from "../InventoryCell";
import { useDrop } from "react-dnd";
import shortid from 'shortid';
import { selectInvItem } from "../../../actions/inventoryActions";
import { useClickAway } from "@umijs/hooks";
import { Animation } from 'rsuite';
import { getItemImage } from "../../../helpers/getImages";
import { ItemType } from "../../../types";
const { Fade } = Animation;

function InventoryCells() {
    const dispatch = useDispatch();
    const state = useSelector((state: State) => state || []);
    const { inventoryItems } = state.inventory;
    const selectInventoryItem = state.inventory.selectInventoryItem

    const ref = useClickAway(() => {
        dispatch(selectInvItem(null));
    });

    const onSelectItem = (item) => {
        console.log(item);
        dispatch(selectInvItem(item));
    };

    const getDescr = () => {
        if (!selectInventoryItem) return <div></div>;
        const { name, description, type } = selectInventoryItem.data;

        const getDescrByType = () => {
            switch (type) {
                case ItemType.CLOTHES: {
                    return (
                        <div>Данные предмет типа CLOTHES.</div>
                    );
                }
                case ItemType.ARMOR: {
                    return (
                        <div>Данные предмет типа ARMOR.</div>
                    );
                }
                case ItemType.WEAPON: {
                    return (
                        <div>Данные предмет типа WEAPON.</div>
                    );
                }
                case ItemType.COMMON: {
                    return (
                        <div>Данные предмет типа COMMON.</div>
                    );
                }
                default: {
                    return <div></div>
                }
            }
        };

        return (
            <div>
                <div className="inventory-items__descr-title">
                    { name }
                </div>
                <div className="inventory-items__descr-image">
                    <img src={ getItemImage(selectInventoryItem.key) } style={{width: '3rem'}} draggable={false} />
                </div>
                <div className='inventory-items__descr-descr'>
                    <div>
                        { getDescrByType() }
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className='inventory-items'>
            <div className="inventory-items__descr">
                { getDescr() }
            </div>

            <div className="inventory-items__title">
                Инвентарь
            </div>

            <div className='inventory-cells'>
                { inventoryItems.map((item, idx) => item
                    ?
                    <span key={ item.data.shortid } ref={ ref } onClick={ () => onSelectItem(item) }><InventoryCell itemsType='inventoryItems' item={ item } id={ idx } /></span>
                    :
                    <span key={ shortid.generate() }><InventoryCell itemsType='inventoryItems' item={ item } id={ idx } /></span>
                )}
            </div>
        </div>
    );
}

export {
    InventoryCells,
};