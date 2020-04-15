export class EObject {
    static destroy(objId: number): boolean {
        const obj: ObjectMp = mp.objects.at(objId)
        if (mp.objects.exists(obj)) {
            obj.destroy();
            return true;
        } 

        return false;
    }
};