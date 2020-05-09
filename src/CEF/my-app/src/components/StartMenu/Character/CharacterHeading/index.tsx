import React from "react";
import ReactSlider from "react-slider";
import { Animation } from 'rsuite';
import { setCharacterHeading, setCharacterCamera } from "../../../../helpers/playerEvents/rpcCall";
import { useDispatch } from "react-redux";

function CharacterHeading() {
    const { Bounce } = Animation;
    
    const onSliderHeadingChange = (value: any) => {
        if (typeof value === 'number') {
            setCharacterHeading(value)
        }
    };

    const onSliderCameraChange = (coord: 'x' | 'y' | 'z', n: number) => {
        if (typeof n === 'number') {
            setCharacterCamera(coord, n);
        }
    };

    const cssSlider: any = {
        textAlign: 'center', 
        fontSize: '1.5rem', 
        color: '#fff', 
        paddingBottom: '.5rem',
        textShadow: '0px 0px 7px rgba(0,0,0,0.37)'
    };
    
    return (
        <div className="character-heading">
        <Bounce in={ true }>
            <div>
                <div>
                    <span style={cssSlider}
                    >Направление камеры по вертикали</span>
                    <ReactSlider
                        className="heading-slider"
                        thumbClassName="heading-thumb"
                        trackClassName="heading-track"
                        min={ 15 }
                        max={ 16.5 }
                        step={ .1 }
                        defaultValue={ 16 }
                        renderThumb={(props, state) => <div {...props}></div>}
                        onChange={ (v: any) => onSliderCameraChange('z', v) }
                    />
                </div>
                <div>
                    <span style={cssSlider}
                    >Направление камеры по горизонтали</span>
                    <ReactSlider
                        className="heading-slider"
                        thumbClassName="heading-thumb"
                        trackClassName="heading-track"
                        min={ 5180 }
                        max={ 5181.7 }
                        step={ .1 }
                        defaultValue={ 5181 }
                        renderThumb={(props, state) => <div {...props}></div>}
                        onChange={ (v: any) => onSliderCameraChange('y', v) }
                    />
                </div>
                <div>
                    <span style={cssSlider}
                    >Направление персонажа</span>
                    <ReactSlider
                        className="heading-slider"
                        thumbClassName="heading-thumb"
                        trackClassName="heading-track"
                        min={ 1 }
                        max={ 360 }
                        defaultValue={ 180 }
                        renderThumb={(props, state) => <div {...props}></div>}
                        onChange={ onSliderHeadingChange }
                    />
                </div>
            </div>
        </Bounce>
        </div>
    );
}

export {
    CharacterHeading,
}