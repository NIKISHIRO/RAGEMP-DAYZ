import React from "react";
import { MdDescription, MdClose } from "react-icons/md";
import { GiBrokenAxe, GiFist } from "react-icons/gi";
import { Progress, Animation } from 'rsuite';
import { ItemLine } from "./ItemLine";
import { Item } from "../../../../../types/item";
import { closeSelectItem } from "../../../../../actions/inventoryActions";
import { connect } from "react-redux";

const { Bounce } = Animation;

type Props = {
    item: Item;
    closeSelectItem: () => void;
}

function SelectItem(props: Props) {
    const { item, closeSelectItem } = props;

    const onCloseSelectItem = (e) => {
        closeSelectItem();
    };

    return (
        <Bounce in={true}>
            <div className="inventory-select-item">
                <div className="icon-close" onClick={ onCloseSelectItem }>
                    <MdClose />
                </div>
                <div className="select-item">
                    <div className='item-data-name'>{ item.data.name }</div>
                    <div className="item-text">
                        <span>
                            <MdDescription />
                        </span>
                        <span className='item-text-description'>
                            <div>
                                -&nbsp;<span>Кол-во: { item.amount }</span>
                            </div>
                            <div>
                                -&nbsp;<span>Макс. стак: { item.data.maxStackCount }</span>
                            </div>
                            <div>
                                -&nbsp;<span>{ item.data.description }</span>
                            </div>
                        </span>
                    </div>
                    <div className="item-text">
                        <ItemLine type={ item.data.type } percent={ 55 } />
                    </div>
                </div>        
            </div>    
        </Bounce>
    );
}

const mapDispatchToPropse = (dispatch) => ({
    closeSelectItem: () => dispatch(closeSelectItem()),
});

const SelectItemConnect = connect(
    null,
    mapDispatchToPropse,
)(SelectItem);

export {
    SelectItemConnect as SelectItem,
}