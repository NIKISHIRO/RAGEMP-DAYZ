import React, { useState } from "react";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { useHover } from '@umijs/hooks';

type Props = {
    onLeftClick: () => any;
    onRightClick: () => any;
    topText?: string;
    value: any;
};

function AnySelect(props: Props) {
    const { onLeftClick, onRightClick, value, topText } = props;
    const [isHoverLeft, hoverLeftRef] = useHover<HTMLDivElement>();
    const [isHoverRight, hoverRightRef] = useHover<HTMLDivElement>();
    // const [isHovering, hoverRef] = useHover<HTMLDivElement>();

    const cssSelectContainer: any = {
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '13rem',
        textAlign: 'center',
        margin: '0 auto',
    }
    
    const cssSelectHeadArrowLeft = {
        fontSize: '3rem',
        color: '#34c3ff',
        verticalAlign: 'middle',
        opacity: isHoverLeft ? .5 : 1,

    }
    const cssSelectHeadArrowRight = {
        fontSize: '3rem',
        color: '#34c3ff',
        verticalAlign: 'middle',
        opacity: isHoverRight ? .5 : 1,
    }

    const cssSelectHeadValue = {
        width: '10rem',
        fontSize: '1.5rem'
    }

    const cssTopText: any = {
        textAlign: 'center',
        position: 'absolute',
        top: '-0.2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        color: '#fff',
        textShadow: '0px 2px 9px #000000',
    };

    return (
        <div style={ cssSelectContainer }>
            <div style={ cssTopText }>
                { topText }
            </div>

            <div style={ cssSelectHeadArrowLeft } onClick={ onLeftClick } ref={ hoverLeftRef }>
                <FaLongArrowAltLeft style={ {verticalAlign: 'middle'} } />
            </div>
            <div style={ cssSelectHeadValue }>
                { value }
            </div>
            <div style={ cssSelectHeadArrowRight } onClick={ onRightClick } ref={ hoverRightRef }>
                <FaLongArrowAltRight style={ {verticalAlign: 'middle'} } />
            </div>
        </div>
    );
}

export {
    AnySelect,
}