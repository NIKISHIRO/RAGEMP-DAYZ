import React from "react";
import { Item } from "../../../../types";
import { Popover } from '@material-ui/core';
import { TabSplitComponent } from "./TabSplitComponent";
import { useToggle } from "@umijs/hooks";

type Props = {
    anchorEl: any;
    item: Item;
    onPopClose: () => any;
}

function SelectedItem(props: Props) {
    const { item, anchorEl, onPopClose } = props;
    const { state, toggle } = useToggle(0);

    function Tab1() {
        return (
            <div className='popover-select-tab'>
                <div onClick={ () => toggle(2) }>Инфо.</div>
                <div>Использовать</div>
                <div onClick={ () => toggle(1) }>Разделить</div>
                <div>Выбросить</div>
            </div>
        );
    }
    
    function Tab2() {
        return (
            <div className='cell-popover-content cell-popover-content-tab2'>
                <div className="cell-popover-content__data">
                    <strong>
                        { item.data.name } (&nbsp;{ item.amount }&nbsp;)
                    </strong>
                </div>
                <div className="cell-popover-content__change-data">
                    <TabSplitComponent onPopClose={ onPopClose } item={ item } />
                </div>
            </div>
        );
    }

    function Tab3() {
        return (
            <div className='cell-popover-content cell-popover-content-tab3'>
                <div className="cell-popover-content__change-data">
                    <div>Название: { item.data.name }</div>
                    <div>Кол-во: { item.amount }</div>
                    <div>Макс. стак: { item.data.maxStackCount }</div>
                    <div>вес: { item.data.weight }</div>
                    <div>Описание: { item.data.description }</div>
                    <div>Тип: { item.data.type }</div>
                </div>
            </div>
        );
    }

    return (
        <Popover
            classes={ { root: 'rootOverridePopover', paper: 'paperOverridePopover' } }
            id={ 'cell-popover' }
            open={ !!anchorEl }
            anchorEl={ anchorEl }
            onClose={ onPopClose }
            anchorOrigin={{
                vertical: "top",
                horizontal: "left"
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "left"
            }}
        >
            <div className="cell-popover">
                { state === 0 && <Tab1 /> }
                { state === 1 && <Tab2 /> }
                { state === 2 && <Tab3 /> }
            </div>
        </Popover>
    );
};

export {
    SelectedItem,
}