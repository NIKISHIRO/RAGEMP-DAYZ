import React, { useEffect, useState } from "react";
import { setLootCreateData, setPropLootCreateData, PropType } from "../../../actions/lootCreateDataActions";
import { useDispatch, useSelector } from "react-redux";
import { UIState } from "../../../reducers/UIReducer";
import { Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, Slider } from '@material-ui/core';
import { lootCreate, setLootCreateHash, setLootCreateRotation } from "../../../helpers/playerEvents/rpcCall";

export type Coords = {
    x: number, 
    y: number, 
    z: number,
};

enum SliderType {
    ROTATION = 'ROTATION',
    POSITION = 'POSITION',
}

function LootCreate() {
    const dispatch = useDispatch();
    const UI = useSelector((state: any): UIState => {
        return state.UI || [];
    });
    const { objectId, objectHash, position, rotation } = UI.lootCreate;
    
    const maxStepRotation = 180;
    const oneStepRotation = 10;
    const minStep = 0;

    console.log('objectHash', objectHash);

    // Пересоздает текущий объект на клиенте.
    const createObject = async () => {
        const data = await lootCreate(objectHash); // Отправляет на клиент хэш объекта для его создания.

        if (data) {
            const p = data.position;
            const r = data.rotation;
            dispatch(
                setLootCreateData({ objectId: data.objectId, objectHash: data.objectHash, position: [p[0], p[1], p[2]], rotation: [r[0], r[1], r[2]] })
            );
        }
    };

    const onHashChange = (event) => {
        dispatch(
            setPropLootCreateData(PropType.OBJECT_HASH, event.target.value)
        );

        // Изменить хэш объекта на клиенте.
        setLootCreateHash(event.target.value);
    }

    const onSliderChange = async (type: SliderType, coord: 'x' | 'y' | 'z', event: any, value: number) => {
        if (type === SliderType.ROTATION) {
            if (coord === 'x') {
                rotation[0] = value;
            }
            if (coord === 'y') {
                rotation[1] = value;
            }
            if (coord === 'z') {
                rotation[2] = value;
            }

            dispatch(
                setPropLootCreateData(PropType.ROTATION, rotation)
            );

            // Установка на клиенте вращения.
            await setLootCreateRotation(rotation);
        }
    };

    return (
        <div className='loot'>
            <div className="AI-content-inner__title">
                Создание точки с лутом
            </div>
            <div className="loot-create">
                <div className="loot-create__object">
                    <div className='loot-create__object-title'>Данные для объекта</div>
                    <div>
                        Hash:&nbsp;
                        <br/>
                        <br/>
                        <FormControl>
                            <InputLabel variant='outlined' id="loot-create__label">Хэш объекта:</InputLabel>
                            <Select
                                labelId="loot-create__label"
                                id="loot-create__select"
                                onChange={ onHashChange }
                                value={ objectHash }
                            >
                                <MenuItem value={ 'w_ar_assaultrifle' }>w_ar_assaultrifle</MenuItem>
                                <MenuItem value={ 'w_sg_pumpshotgun' }>w_sg_pumpshotgun</MenuItem>
                            </Select>
                        </FormControl>
                        <br/>
                        <br/>
                        <Button color='secondary' onClick={ createObject }>Создать</Button>
                    </div>
                    
                    <br />

                    <div>
                        Rotation: { rotation[0]} { rotation[1] } { rotation[2] }
                        <div>
                            <span>X:</span>
                                <Slider
                                    classes={ {root: 'loot-slider__root'} }
                                    step={ oneStepRotation }
                                    min={ minStep }
                                    max={ maxStepRotation }
                                    value={ rotation[0] } marks
                                    onChange={ (e: any, v: any) => onSliderChange(SliderType.ROTATION, 'x', e, v) }
                                />
                        </div>
                    </div>
                    <div>
                        <div>
                            <span>Y:</span>
                                <Slider
                                    classes={ {root: 'loot-slider__root'} }
                                    step={ oneStepRotation }
                                    min={ minStep }
                                    max={ maxStepRotation }
                                    value={ rotation[1] } marks
                                    onChange={ (e: any, v: any) => onSliderChange(SliderType.ROTATION, 'y', e, v) }
                                />
                        </div>
                    </div>
                    <div>
                        <div>
                            <span>Z:</span>
                                <Slider
                                    classes={ {root: 'loot-slider__root'} }
                                    step={ oneStepRotation }
                                    min={ minStep }
                                    max={ maxStepRotation }
                                    value={ rotation[2] } marks
                                    onChange={ (e: any, v: any) => onSliderChange(SliderType.ROTATION, 'z', e, v) }
                                />
                        </div>
                    </div>
                    
                    <br />

                    <div>Position: { position[0]} { position[1] } { position[2] }</div>
                    <br />

                </div>
            </div>
        </div>
    );
}

export {
    LootCreate,
}