export class Blip {
    private blip: BlipMp;

    constructor(blip: BlipMp) {
        this.blip = blip;
    }

    static findBlipById(blipId: number): BlipMp | false {
        const blip: BlipMp = mp.blips.at(blipId);
        if (mp.blips.exists(blip)) {
            return blip;
        }

        return false;
    }

    static destroy(blipId: number): boolean {
        if (mp.blips.exists(blipId)) {
            mp.blips.at(blipId).destroy();
            return true;
        }

        return false;
    }
}