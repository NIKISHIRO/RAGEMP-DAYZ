export class Blip {
    static destroy(blipIid: number): boolean {
        const blip: BlipMp = mp.blips.at(blipIid)
        if (mp.blips.exists(blip)) {
            blip.destroy();
            return true;
        } 

        return false;
    }
}