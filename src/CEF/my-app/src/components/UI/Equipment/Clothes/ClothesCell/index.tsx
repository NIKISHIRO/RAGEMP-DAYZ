import React from "react";

function ClothesCell(props) {
    const { item } = props;
    
    // const [{ isOver, canDrop, didDrop, getDropResult }, drop] = useDrop({
    //     accept: ItemTypes.ITEM,
    //     drop: (dropItem: any, monitor) => {
    //         console.log('dropItem', dropItem);
    //     },
    //     collect: (monitor) => ({
    //       isOver: !!monitor.isOver(),
    //       canDrop: !!monitor.canDrop(),
    //       didDrop: monitor.didDrop(),
    //       getDropResult: monitor.getDropResult(), 
    //     }),
    //     // canDrop: (item, monitor) => true,
    // });

    return (
        <div className='cells-cell clothes-cell'></div>
    );
}

export {
    ClothesCell,
}