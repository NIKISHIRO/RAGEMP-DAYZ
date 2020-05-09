import React from "react";
import ReactSlider from "react-slider";

type Props = {
    onChange: (p1: number) => any;
    min: number;
    max: number;
    step: number;
    defVal?: number;
    value?: number;
};

function CharacterSlider(props: Props) {
    const { step, min, max, value, onChange } = props;
    
    return (
        <div>
            <ReactSlider
                className="character-slider"
                thumbClassName="character-thumb"
                trackClassName="character-track"
                min={ min }
                max={ max }
                step={ step }
                value={ value }
                renderThumb={(props, state) => <div {...props}></div>}
                onChange={ (val: any) => onChange(val) }
            />
        </div>
    );
}

export {
    CharacterSlider,
}