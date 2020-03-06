export class Label {
    static destroy(labelId: number): boolean {
        const label: TextLabelMp = mp.labels.at(labelId)
        if (mp.labels.exists(label)) {
            label.destroy();
            return true;
        } 

        return false;
    }
}