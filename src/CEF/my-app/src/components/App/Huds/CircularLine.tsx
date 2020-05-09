import { CircularProgress, makeStyles } from "@material-ui/core";
import React from "react";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },
}));

type Props = {
    value: number;
    maxValue: number
    rootClass: string;
};

function CircularLine(props: Props) {
    const classes = useStyles();

    const percent = props.maxValue / 100; // 1%;
    const value = percent * props.value;

    return (
        <div className={ classes.root }>
            <CircularProgress variant="static" value={ value } size={ 70 } classes={ { root: 'circular-color' } } />
        </div>
    );
}

export {
    CircularLine,
}