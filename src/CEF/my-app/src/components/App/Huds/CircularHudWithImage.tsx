import React, { CSSProperties } from "react";
import { CircularLine } from "./CircularLine";

type Props = {
    hud: any;
    style: CSSProperties;
    size: string;
    value: number;
};

function CircularHudWithImage(props: Props) {
    const styles = {...props.style, width: props.size};
    const hudStyle: any = { 
        position: 'absolute',
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    };
    return (
        <div className='CircularHudWithImage' style={ styles }>
            <CircularLine value={ props.value } maxValue={ 100 } />
            <div style={hudStyle}>{ props.hud }</div>
        </div>
    );
}

export {
    CircularHudWithImage,
}