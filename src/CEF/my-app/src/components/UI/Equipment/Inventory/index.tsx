import React from "react";
import { Animation } from 'rsuite';
import { connect } from 'react-redux';
import { InventoryState, createItemObject } from "../../../../reducers/inventoryReducer";
import { setInventoryItems, selectItem } from "../../../../actions/inventoryActions";
import { InventoryCells } from "./InventoryCells";
import { emitter } from "../../../../helpers/emitter";
import tshirt from '../../../../assets/items/tshirt.png';
import { setShow } from "../../../../actions/clothesActions";
import { State } from "../../../../reducers";
import { ClothesState } from "../../../../reducers/clothesReducer";
import { SelectItem } from "./SelectItem";
import { ItemType, Item } from "../../../../types/item";

const { Bounce } = Animation;

type Props = {
    inventory: InventoryState;
    clothes: ClothesState;
    setInventoryItems: (items: Item[]) => void;
    setShow: (bool: boolean) => void;
}

function Inventory(props: Props) {
    const { inventory, clothes, setShow } = props;
    let { items, selectCurrentItem } = inventory;

    const onClothesClick = (e) => {
        console.log(e);
        setShow(!clothes.isShow);
    };

    const onAddItem = (e) => {
        const item = createItemObject('item_weapon_ak47', 3, { type: ItemType.WEAPON, name: 'AK-47', maxStackCount: 5, condition: 95, description: 'adadada dadadada adadadada dadadad adadada' })
        emitter.emit('addInventoryItem', item);
    };

    return (
        <div className='ui inventory'>
            <span className='inventory-clothes-image'>
                <img
                    src={tshirt} 
                    style={{width: '30px', margin: '5px'}} 
                    onMouseDown={(e) => e.preventDefault()} 
                    onClick={(e) => onClothesClick(e)} 
                />
            </span>
            <div className="ui-top inventory-top">
                <span className="inventory-top-text">
                    Инвентарь
                </span>
            </div>
            <div className="inventory-body">
                <InventoryCells items={ items } />
                <button onClick={onAddItem}>BOOOM</button>
            </div>
            { selectCurrentItem && <SelectItem item={selectCurrentItem}  /> }
        </div>
    );
}

const mapStateToProps = (state: State) => ({
    inventory: state.inventory,
    clothes: state.clothes,
});

const mapDispatchToProps = (dispatch) => ({
    setInventoryItems: (items: Item[]) => dispatch(setInventoryItems(items)),
    setShow: (bool: boolean) => dispatch(setShow(bool)),
});

const inventoryConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Inventory);

export {
    inventoryConnect as Inventory,
}