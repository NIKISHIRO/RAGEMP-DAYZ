export class Label {
    static destroy(labelId: number): boolean {
        if (mp.labels.exists(labelId)) {
            mp.labels.at(labelId).destroy();
            return true;
        } 

        return false;
    }
}