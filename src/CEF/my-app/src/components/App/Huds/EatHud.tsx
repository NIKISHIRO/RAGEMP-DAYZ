import React, { CSSProperties } from "react";
import img_icon_100 from '../../../assets/huds/eat/100.svg';
import img_icon_80 from '../../../assets/huds/eat/80.svg';
import img_icon_60 from '../../../assets/huds/eat/60.svg';
import img_icon_40 from '../../../assets/huds/eat/40.svg';
import img_empty from '../../../assets/huds/eat/empty.svg';

type Props = {
    hunger: number;
};

function EatHud(props: Props) {
    const { hunger } = props;
    let styles = {};
    
    let imgIcon = img_icon_100;
    if (hunger < 80) {
        imgIcon = img_icon_80;
    }    
    if (hunger < 60) {
        imgIcon = img_icon_60;
    }
    if (hunger < 40) {
        imgIcon = img_icon_40;
    }
    if (hunger < 20) {
        imgIcon = img_icon_40;
    }
    if (hunger < 1) {
        imgIcon = img_empty;
    }
    
    return (
        <div className='huds-eat'>
            <img src={ imgIcon } style={ styles } />
        </div>
    );
}

export {
    EatHud,
}