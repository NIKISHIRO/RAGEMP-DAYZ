import { CircularProgress, makeStyles } from "@material-ui/core";
import React from "react";
import { useDispatch } from "react-redux";


type Props = {
    value: number;
    maxValue: number
};

function CircularLine(props: Props) {
    const percent = props.maxValue / 100; // 1%;
    const value = percent * props.value;

    return (
        <div>
            <CircularProgress color='secondary' variant="static" value={ value } size={ 50 } />
        </div>
    );
}

export {
    CircularLine,
}