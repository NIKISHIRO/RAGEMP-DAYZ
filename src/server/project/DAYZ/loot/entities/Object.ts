import { Item } from "project/DAYZ/types";

export class EObject {
    static destroy(objId: number): boolean {
        if (mp.objects.exists(objId)) {
            mp.objects.at(objId).destroy();
            return true;
        } 

        return false;
    }
};