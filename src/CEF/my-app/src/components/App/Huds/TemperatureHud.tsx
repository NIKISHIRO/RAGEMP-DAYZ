import React from "react"

import img_icon_100 from '../../../assets/huds/temperature/100.svg';
import img_icon_80 from '../../../assets/huds/temperature/80.svg';
import img_icon_60 from '../../../assets/huds/temperature/60.svg';
import img_icon_40 from '../../../assets/huds/temperature/40.svg';
import img_icon_20 from '../../../assets/huds/temperature/15.svg';
import img_icon_empty from '../../../assets/huds/temperature/empty.svg';

type Props = {
    temperature: number;
}
function TemperatureHud(props: Props) {
    const { temperature } = props;
    let styles = {};

    let imgIcon = img_icon_100;
    if (temperature < 80) {
        imgIcon = img_icon_80;
        styles = {filter: 'hue-rotate(45deg)'};
    }    
    if (temperature < 60) {
        imgIcon = img_icon_60;
        styles = {filter: 'hue-rotate(60deg)'};
    }
    if (temperature < 40) {
        imgIcon = img_icon_40;
        styles = {filter: 'hue-rotate(75deg)'};
    }
    if (temperature < 20) {
        imgIcon = img_icon_20;
        styles = {filter: 'hue-rotate(90deg)'};
    }
    if (temperature < 1) {
        imgIcon = img_icon_empty;
        styles = {filter: 'hue-rotate(100deg)'};
    }

    return (
        <div className="huds-temperature">
            <img src={ imgIcon } style={ styles } />
        </div>
    )
}

export {
    TemperatureHud,
}