import { get2EntitiesRange } from "./Entities";

function getPlayersForEachInRange(ent: EntityMp, range: number) {
    const objects: ObjectMp[] = [];

    mp.objects.forEachFast((entity) => {
        const lengthPosition = get2EntitiesRange(entity, ent);

        if (lengthPosition <= range) {
            objects.push(entity);
        }
    });

    return objects;
}

export {
    getPlayersForEachInRange,
}