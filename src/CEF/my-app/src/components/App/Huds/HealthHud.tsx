import React from 'react';
import styled, { keyframes } from 'styled-components';
import { pulse, jello} from 'react-animations';
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

    const isLowHP = health <= 50;

    // Pulse animation
    const pulseAnimation = keyframes`${pulse}`;
    const HealthPulseDiv = styled.div`
        animation: ${ isLowHP ? '.95s' : '3s' } infinite ${ pulseAnimation };
    `;

    let healthImage = image_blood_100;
    if (health <= 80) {
        healthImage = image_blood_80;
    }
    if (health <= 60) {
        healthImage = image_blood_60;
    }
    if (health <= 40) {
        healthImage = image_blood_40;
    }
    if (health <= 20) { 
        healthImage = image_blood_20;
    }
    if (health <= 0) {
        healthImage = image_blood_empty;
    }

    return (
        <HealthPulseDiv>
            <div className="huds-health">
                <img src={ healthImage } style={ styles } />
            </div>
        </HealthPulseDiv>
    );
}

export {
    HealthHud,
}