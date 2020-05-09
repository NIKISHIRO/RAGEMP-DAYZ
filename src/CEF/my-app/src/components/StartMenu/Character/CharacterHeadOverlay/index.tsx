import React from "react";
import { AnySelect } from "../../../shared/AnySelect";
import { range } from "../../../../helpers/helps";
import { setCharacterHeadOverlay } from "../../../../helpers/playerEvents/rpcCall";
import { useSelector, useDispatch } from "react-redux";
import { State } from "../../../../reducers";
import { setHeadOverlayProp } from "../../../../actions/characterActions";


function CharacterHeadOverlay() {
    const state = useSelector((state: State) => state || []);
    const dispatch = useDispatch();

    // state.character.headOverlay[1].overlayId
 
    const getIndex = (overlayId, index) => {
        switch (overlayId) {
            case 0: {
                return range(index, 0, 23);
            }
            case 1: {
                return range(index, 0, 28);
            }
            case 2: {
                return range(index, 0, 33);
            }
            case 3: {
                return range(index, 0, 14);
            }
            case 4: {
                return range(index, 0, 74);
            }
            case 5: {
                return range(index, 0, 6);
            }
            case 6: {
                return range(index, 0, 11);
            }
            case 7: {
                return range(index, 0, 10);
            }
            case 8: {
                return range(index, 0, 9);
            }
            case 9: {
                return range(index, 0, 17);
            }
            case 10: {
                return range(index, 0, 16);
            }
            case 11: {
                return range(index, 0, 11);
            }
            case 12: {
                return range(index, 0, 1);
            }
            default: {
                return -1;
            }
        }
    };

    const onLeft = (overlayId: number, index: number) => {
        index = getIndex(overlayId, --index);
        dispatch(
            setHeadOverlayProp(overlayId, getIndex(overlayId, index))
        );
        setCharacterHeadOverlay(overlayId, index);
    };

    const onRight = (overlayId: number, index: number) => {
        index = getIndex(overlayId, ++index);
        dispatch(
            setHeadOverlayProp(overlayId, getIndex(overlayId, index))
        );
        setCharacterHeadOverlay(overlayId, index);
    };

    const getData = () => {
        return state.character.headOverlay.map(i => {
            const { index, overlayId } = state.character.headOverlay[i.overlayId];
            
            let value: any = index;

            if (overlayId === 12) {
                value = index === 1 ? 'Да' : 'Нет';
            }

            return (
                <div key={ `${i.name}_${i.index}` }>
                    <AnySelect 
                        onLeftClick={ () => onLeft(i.overlayId, i.index) } 
                        onRightClick={ () => onRight(i.overlayId, i.index) } 
                        value={ value } 
                        topText={ i.name } 
                    />
                </div>
            )
        });
    };

    return (
        <div className='character-head-overlay'>
            { getData() }
        </div>
    );
}

export {
    CharacterHeadOverlay,
}