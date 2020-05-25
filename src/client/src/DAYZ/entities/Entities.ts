const pLocal = mp.players.local;

// Получает расстояние между 2 сущностями
function get2EntitiesRange(ent1: EntityMp, ent2: EntityMp) {
    const ent1Pos = ent1.position;
    const ent2Pos = ent2.position;
    const vec1 = new mp.Vector3(ent1Pos.x, ent1Pos.y, ent1Pos.z)
    const vec2 = new mp.Vector3(ent2Pos.x, ent2Pos.y, ent2Pos.z)
    return vec1.subtract(vec2).length();
};

export {
    get2EntitiesRange,
}