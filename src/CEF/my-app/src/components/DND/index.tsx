import React, { useEffect } from "react";
import { DndProvider, useDrop, useDrag } from 'react-dnd'

function DND() {

    const [{ opacity }, dragRef] = useDrag({
        item: { type: 'item' },
        collect: monitor => ({
            opacity: monitor.isDragging() ? 0.5 : 1,
        }),
    });

    const onDrop = (e) => {
        console.log(e);
    };

    const [{ isOver, canDrop }, drop] = useDrop({
        accept: 'item',
        drop: (e) => onDrop(e),
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
          canDrop: !!monitor.canDrop(),
        }),
      })
      
    return (
        <div ref={ dragRef }>
            <div style={ {color: 'red'} } className='dnd-drag'>dnd-drag</div>
        </div>
    );
}

export {
    DND,
}