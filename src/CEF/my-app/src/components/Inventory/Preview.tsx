import { DragLayer } from "react-dnd";
import React from "react";

const defaultStyle = (item, currentOffset): any => ({
    left: currentOffset.x,
    top: currentOffset.y,
    position: 'fixed',
    color: '#000',
    height: item.imgSize,
    weight: item.imgSize,
});

const DragPreview = (props) => {
    const { isDragging, currentOffset, item } = props;
    return !isDragging || !currentOffset || !item
    ?
    null
    :
    <span style={defaultStyle(item, currentOffset)}>
        <img src={ item.src } />
        <span style={ {position: 'absolute', right: '-.1rem', bottom: '-.6rem', color: '#fff'} }>{item.amount}</span>
    </span>
};

const Preview = DragLayer((monitor) => {
    return {
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
    }
})(DragPreview);

export {
    Preview,
}