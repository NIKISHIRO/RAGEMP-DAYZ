import './equipment.css';
import { Inventory } from "./Inventory";
import { Clothes } from "./Clothes";
import React from "react";
import { Grid, Row, Col } from 'rsuite';

function Equipment() {
    return (
        <div className='equipment'>
            <div className="equipment-container">
                <Clothes isShow={true} />
                <Inventory />
            </div>
        </div>
    );
}

export {
    Equipment,
}