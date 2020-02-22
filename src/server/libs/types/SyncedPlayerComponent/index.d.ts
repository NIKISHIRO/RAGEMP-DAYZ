interface PlayerMp_SyncPlrComp {
    changeClothes(componentId: number, drawable: number, texture: number, save?: boolean, sync?: boolean): void;   
    resetClothes(): void; 
}

