import React from "react";
import { Item } from "../../../../types";
import { Popover } from "@material-ui/core";
import { useToggle } from "@umijs/hooks";
import { TabSplitComponent } from "../SelectedInventoryItem/TabSplitComponent";

type Props = {
    anchorEl: any;
    item: Item;
    isInventory: boolean;
    onPopClose: () => any;
}

function SelectedGroundItem(props: Props) {
    const { item, anchorEl, onPopClose } = props;
    const { state, toggle } = useToggle(0);
    
    function Tab1() {
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
            </div>
        </Popover>
    );
}

export {
    SelectedGroundItem,
}