import React from 'react';
import image_blood_100 from '../../../assets/huds/health/100.svg';
import image_blood_80 from '../../../assets/huds/health/80.svg';
import image_blood_60 from '../../../assets/huds/health/60.svg';
import image_blood_40 from '../../../assets/huds/health/40.svg';
import image_blood_20 from '../../../assets/huds/health/20.svg';
import image_blood_empty from '../../../assets/huds/health/empty.svg';

type Props = {
    health: number;
}

function HealthHud(props: Props) {
    const { health } = props;
    let styles = {};

    let healthImage = image_blood_100;
    if (health <= 80) {
        healthImage = image_blood_80;
        styles = {filter: 'hue-rotate(-30deg)'};
    }
    if (health <= 60) {
        healthImage = image_blood_60;
        styles = {filter: 'hue-rotate(-40deg)'};
    }
    if (health <= 40) {
        healthImage = image_blood_40;
        styles = {filter: 'hue-rotate(-50deg)'};
    }
    if (health <= 20) { 
        healthImage = image_blood_20;
        styles = {filter: 'hue-rotate(-60deg)'};
    }
    if (health <= 10) {
        healthImage = image_blood_empty;
        styles = {filter: 'hue-rotate(-70deg)'};
    }

    return (
        <div className="huds-health">
            <img src={ healthImage } style={ styles } />
        </div>
    );
}

export {
    HealthHud,
}