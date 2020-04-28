import React from "react"

import img_icon_100 from '../../../assets/huds/dehydration/100.svg';
import img_icon_70 from '../../../assets/huds/dehydration/70.svg';
import img_icon_40 from '../../../assets/huds/dehydration/40.svg';
import img_icon_10 from '../../../assets/huds/dehydration/10.svg';
import img_icon_empty from '../../../assets/huds/dehydration/empty.svg';

type Props = {
    dehydration: number;
}

function DehydrationHud(props: Props) {
    const { dehydration } = props;
    let styles = {};

    let imgIcon = img_icon_100;
    if (dehydration < 70) {
        imgIcon = img_icon_70;
        styles = {filter: 'hue-rotate(-30deg)'};
    }    
    if (dehydration < 40) {
        imgIcon = img_icon_40;
        styles = {filter: 'hue-rotate(-40deg)'};
    }
    if (dehydration < 10) {
        imgIcon = img_icon_10;
        styles = {filter: 'hue-rotate(-50deg)'};
    }
    if (dehydration < 1) {
        imgIcon = img_icon_empty;
        styles = {filter: 'hue-rotate(-60deg)'};
    }

    return (
        <div className="huds-dehydration">
            <img src={ imgIcon } style={ styles } />
        </div>
    )
}

export {
    DehydrationHud,
}