import React from "react";
import { connect } from "react-redux";
import { State } from "../../../../reducers";
import { ClothesState } from "../../../../reducers/clothesReducer";
import { ClothesCell } from "./ClothesCell";
import { Animation } from 'rsuite';

const { Bounce } = Animation;

type Props = {
    isShow: boolean;
    clothes: ClothesState;
}

function Clothes(props: Props) {
    const { clothes } = props;
    
    return (
        <Bounce in={clothes.isShow}>
            <div className='ui clothes'>
                <div className="ui-top clothes-top">
                    <span className="inventory-top-text">
                        Одежда
                    </span>
                </div>

                <div className="clothes-body">
                    <ClothesCell />
                </div>
            </div>
        </Bounce>
    );
}

const mapStateToProps = (state: State) => {
    return {
        clothes: state.clothes,
    };
};

const clothesConnect = connect(
    mapStateToProps,
)(Clothes);

export {
    clothesConnect as Clothes,
}