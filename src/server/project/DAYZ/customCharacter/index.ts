import './commands';
import './events';
import './character'

export interface Character {
    hair: number
    face: {
        Blemishes: number,
        FacialHair: number,
        Eyebrows: number,
        Ageing: number,
        Makeup: number,
        Blush: number,
        Complexion: number,
        SunDamage: number,
        Lipstick: number,
        Moles: number,
        ChestHair: number,
        BodyBlemishes: number,
        AddBodyBlemishes: boolean
    }
}
