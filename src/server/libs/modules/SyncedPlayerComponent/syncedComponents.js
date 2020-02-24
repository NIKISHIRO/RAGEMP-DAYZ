/**
 * Possible componentIds, see: https://wiki.rage.mp/index.php?title=Clothes
 * @type {number[]}
 */
const validComponents = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

mp.events.add('playerJoin', (player) => {
	/**
	 * The client will listen for changes on this variable (mp.events.addDataHandler)
	 * @type {boolean | object}
	 */
	player.data.__componentSync = false;
	
	/**
	 * The variable that holds the player's saved components and variations
	 */
	player.data.outfit = {};
	
	/**
	 * Change the player's component + variation
	 * Based on the parameter 'sync', you may decide if
	 * it should only be shown on the local client or on
	 * all clients (synchronized)
	 * @param componentId
	 * @param drawable
	 * @param texture
	 * @param palette
	 * @param save
	 * @param sync
	 */
	player.changeClothes = function (componentId, drawable, texture, save = false, sync = true) {
		componentId = parseInt(componentId);
		drawable = parseInt(drawable);
		texture = parseInt(texture);
		
		// Validate the parameters
		if (isNaN(componentId))
			throw "'componentId' must be a number!";
		if (isNaN(drawable))
			throw "'drawable' must be a number!";
		if (isNaN(texture))
			throw "'texture' must be a number!";
		
		/**
		 *  Mainly used with https://rage.mp/files/file/50-gtao-outfits/
		 *  If componentId 0 is set to -1 then the player's facial customization
		 *  should be removed because this means that it could clip with the headgear
		 */
		if (componentId === 0 && drawable === -1)
			console.warn("Changing componentId 0 (head) to -1 means you should remove the player's facial customization!");
		
		if (!validComponents.includes(componentId))
			return;
		
		let componentValues = {
			'drawable': drawable,
			'texture': texture
		};
		
		let clothes = player.data.outfit;
		if (player.data.__componentSync !== false)
			clothes = JSON.parse(player.data.__componentSync);
		
		if (save)
			player.data.outfit[componentId] = componentValues;
		
		if (sync) {
			clothes[componentId] = componentValues;
			
			player.data.__componentSync = JSON.stringify(clothes);
		} else {
			player.call("setComponentVariation", [
				componentId, drawable, texture
			]);
		}
	};
	
	player.resetClothes = function () {
		if (!player.data.outfit.length) player.data.__componentSync = false;
		player.data.__componentSync = JSON.stringify(player.data.outfit);
	};
});
