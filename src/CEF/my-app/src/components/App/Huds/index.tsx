import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { UIState } from "../../../reducers/UIReducer";
import { makeStyles } from "@material-ui/core";
import { CircularLine } from "./CircularLine";
import { setHudsData, HudType } from "../../../actions/hudsDataActions";
import { HudsMenuData } from "./HudsMenuData";
import { FaHamburger } from "react-icons/fa";
import { HealthHud } from "./HealthHud";
import { EatHud } from "./EatHud";
import { TemperatureHud } from "./TemperatureHud";
import { DehydrationHud } from "./DehydrationHud";
import CircularSlider from 'react-circular-slider-svg';
import { CircularHudWithImage } from "./CircularHudWithImage";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

function Huds(props) {
    const state: UIState = useSelector((state: any) => state.UI || []);
    const dispatch = useDispatch();
    const health = state.hudsData.health;
    const armor = state.hudsData.armor;
    const isBleeding = state.hudsData.isBleeding;
    const temperature = state.hudsData.temperature;
    const hunger = state.hudsData.hunger;
    const dehydration = state.hudsData.dehydration;

    const hudStyles: CSSProperties = {
        position: 'absolute',
        bottom: '1rem',
        right: '1rem',
    };

    let healthStyles = {};
    if (health <= 80) healthStyles = {filter: 'hue-rotate(-30deg)'};
    if (health <= 60) healthStyles = {filter: 'hue-rotate(-40deg)'};
    if (health <= 40) healthStyles = {filter: 'hue-rotate(-50deg)'};
    if (health <= 20) healthStyles = {filter: 'hue-rotate(-60deg)'};
    if (health <= 0) healthStyles = {filter: 'hue-rotate(-70deg)'};

    let eatStyles = {};
    if (hunger < 80) eatStyles = {filter: 'hue-rotate(-30deg)'};
    if (hunger < 60) eatStyles = {filter: 'hue-rotate(-40deg)'};
    if (hunger < 40) eatStyles = {filter: 'hue-rotate(-50deg)'};
    if (hunger < 20) eatStyles = {filter: 'hue-rotate(-60deg)'};
    if (hunger < 1) eatStyles = {filter: 'hue-rotate(-70deg)'};

    let dehydrationStyles = {};
    if (dehydration < 70) dehydrationStyles = {filter: 'hue-rotate(-30deg)'};
    if (dehydration < 40) dehydrationStyles = {filter: 'hue-rotate(-40deg)'};
    if (dehydration < 10) dehydrationStyles = {filter: 'hue-rotate(-50deg)'};
    if (dehydration < 1) dehydrationStyles = {filter: 'hue-rotate(-60deg)'};

    let temperatureStyles = {};
    if (temperature < 80) temperatureStyles = {filter: 'hue-rotate(45deg)'};
    if (temperature < 60) temperatureStyles = {filter: 'hue-rotate(60deg)'};
    if (temperature < 40) temperatureStyles = {filter: 'hue-rotate(75deg)'};
    if (temperature < 20) temperatureStyles = {filter: 'hue-rotate(90deg)'};
    if (temperature < 1) temperatureStyles = {filter: 'hue-rotate(100deg)'};

    return (
        <div className="huds">
            <HudsMenuData health={ health } armor={ armor } hunger={ hunger } dehydration={ dehydration } temperature={ temperature } />

            <CircularHudWithImage value={ health } style={ {...hudStyles, ...healthStyles, right: '15.2rem'} } size={ '' } hud={ <HealthHud health={ health } /> } />
            <CircularHudWithImage value={ hunger } style={ {...hudStyles, ...eatStyles, right: '10.2rem'} } size={ '' } hud={ <EatHud hunger={ hunger } /> } />
            <CircularHudWithImage value={ dehydration } style={ {...hudStyles, ...dehydrationStyles, right: '5.2rem'} } size={ '' } hud={ <DehydrationHud dehydration={ dehydration } /> } />
            <CircularHudWithImage value={ temperature } style={ {...hudStyles, ...temperatureStyles, right: '.2rem'} } size={ '' } hud={ <TemperatureHud temperature={ temperature } /> } />

            <div style={ {textShadow: 'rgba(0, 0, 0, 0.37) 0px 0px 7px', position: 'absolute', bottom: '10rem', right: '2rem', color: '#000'} }>
                <div>[TAB] Инвентарь:</div>
                <div>[G] Зайти в инвентарь машины:</div>
                <div>[F6] HUDS:</div>
            </div>
{/* 
            <button onClick={ () => dispatch(setHudsData(HudType.SET_HEALTH_HUDS, health - 5)) }>-</button>
            <button onClick={ () => dispatch(setHudsData(HudType.SET_HEALTH_HUDS, health + 5)) }>+</button>

            <button onClick={ () => dispatch(setHudsData(HudType.SET_ARMOR_HUDS, armor - 5)) }>-</button>
            <button onClick={ () => dispatch(setHudsData(HudType.SET_ARMOR_HUDS, armor + 5)) }>+</button>

            <button onClick={ () => dispatch(setHudsData(HudType.SET_HUNGER_HUDS, hunger - 5)) }>-</button>
            <button onClick={ () => dispatch(setHudsData(HudType.SET_HUNGER_HUDS, hunger + 5)) }>+</button>
            
            <button onClick={ () => dispatch(setHudsData(HudType.SET_DEHYDRATION_HUDS, dehydration - 5)) }>-</button>
            <button onClick={ () => dispatch(setHudsData(HudType.SET_DEHYDRATION_HUDS, dehydration + 5)) }>+</button>

            <button onClick={ () => dispatch(setHudsData(HudType.SET_TEMPERATURE_HUDS, temperature - 5)) }>-</button>
            <button onClick={ () => dispatch(setHudsData(HudType.SET_TEMPERATURE_HUDS, temperature + 5)) }>+</button>  */}
        </div>
    );
}

export {
    Huds,
}