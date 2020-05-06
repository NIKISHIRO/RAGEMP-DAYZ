import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import { GiHealthNormal, GiHealthDecrease, GiChestArmor, GiWaterDrop, GiWaterBottle } from "react-icons/gi";
import styled, { keyframes } from 'styled-components';
import { pulse, jello} from 'react-animations';
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

function Huds(props) {
    const state: UIState = useSelector((state: any) => state.UI || []);
    const dispatch = useDispatch();
    const health = state.hudsData.health;
    const armor = state.hudsData.armor;
    const isBleeding = state.hudsData.isBleeding;
    const temperature = state.hudsData.temperature;
    const hunger = state.hudsData.hunger;
    const dehydration = state.hudsData.dehydration;
    
    const isLowHP = health <= 50;

    // Pulse animation
    const pulseAnimation = keyframes`${pulse}`;
    const HealthPulseDiv = styled.div`
        animation: ${ isLowHP ? '.25s' : '3s' } infinite ${ pulseAnimation };
    `;

    return (
        <div className="huds">
            <HudsMenuData health={ health } armor={ armor } hunger={ hunger } dehydration={ dehydration } temperature={ temperature } />
            <HealthHud health={ health } />
            <EatHud hunger={ hunger } />
            <DehydrationHud dehydration={ dehydration } />
            <TemperatureHud temperature={ temperature } />

            {/* <button onClick={ () => dispatch(setHudsData(HudType.SET_HEALTH_HUDS, health - 5)) }>-</button>
            <button onClick={ () => dispatch(setHudsData(HudType.SET_HEALTH_HUDS, health + 5)) }>+</button>

            <button onClick={ () => dispatch(setHudsData(HudType.SET_ARMOR_HUDS, armor - 5)) }>-</button>
            <button onClick={ () => dispatch(setHudsData(HudType.SET_ARMOR_HUDS, armor + 5)) }>+</button>

            <button onClick={ () => dispatch(setHudsData(HudType.SET_HUNGER_HUDS, hunger - 5)) }>-</button>
            <button onClick={ () => dispatch(setHudsData(HudType.SET_HUNGER_HUDS, hunger + 5)) }>+</button>
            
            <button onClick={ () => dispatch(setHudsData(HudType.SET_DEHYDRATION_HUDS, dehydration - 5)) }>-</button>
            <button onClick={ () => dispatch(setHudsData(HudType.SET_DEHYDRATION_HUDS, dehydration + 5)) }>+</button>

            <button onClick={ () => dispatch(setHudsData(HudType.SET_TEMPERATURE_HUDS, temperature - 5)) }>-</button>
            <button onClick={ () => dispatch(setHudsData(HudType.SET_TEMPERATURE_HUDS, temperature + 5)) }>+</button> */}
        </div>
    );
}

export {
    Huds,
}