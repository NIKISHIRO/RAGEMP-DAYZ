const outfitPresets = {
	default: {
		"1": {
			"drawable": 0,
			"texture": 0,
			"palette": 2
		},
		"3": {
			"drawable": 8,
			"texture": 0,
			"palette": 2
		},
		"4": {
			"drawable": 4,
			"texture": 4,
			"palette": 2
		},
		"5": {
			"drawable": -1,
			"texture": -1,
			"palette": 2
		},
		"6": {
			"drawable": 4,
			"texture": 1,
			"palette": 2
		},
		"7": {
			"drawable": 0,
			"texture": 0,
			"palette": 2
		},
		"8": {
			"drawable": 15,
			"texture": 0,
			"palette": 2
		},
		"9": {
			"drawable": 0,
			"texture": 0,
			"palette": 2
		},
		"10": {
			"drawable": 0,
			"texture": 0,
			"palette": 2
		},
		"11": {
			"drawable": 38,
			"texture": 0,
			"palette": 2
		}
	},
	police: {
		"1": {
			"drawable": 0,
			"texture": 0,
		},
		"3": {
			"drawable": 0,
			"texture": 0,
		},
		"4": {
			"drawable": 35,
			"texture": 0,
		},
		"6": {
			"drawable": 51,
			"texture": 0,
		},
		"7": {
			"drawable": 0,
			"texture": 0,
		},
		"8": {
			"drawable": 58,
			"texture": 0,
		},
		"10": {
			"drawable": 0,
			"texture": 0
		},
		"11": {
			"drawable": 55,
			"texture": 0,
		}
	},
	firefighter: {
		"1": {
			"drawable": 0,
			"texture": 0,
			"palette": 2
		},
		"3": {
			"drawable": 4,
			"texture": 0,
			"palette": 2
		},
		"4": {
			"drawable": 120,
			"texture": 1,
			"palette": 2
		},
		"5": {
			"drawable": -1,
			"texture": -1,
			"palette": 2
		},
		"6": {
			"drawable": 51,
			"texture": 0,
			"palette": 2
		},
		"7": {
			"drawable": 0,
			"texture": 0,
			"palette": 2
		},
		"8": {
			"drawable": 15,
			"texture": 0,
			"palette": 2
		},
		"9": {
			"drawable": 0,
			"texture": 0,
			"palette": 2
		},
		"10": {
			"drawable": 64,
			"texture": 0,
			"palette": 2
		},
		"11": {
			"drawable": 314,
			"texture": 1,
			"palette": 2
		}
	},
	noose: {
		"1": {
			"drawable": 52,
			"texture": 0,
			"palette": 2
		},
		"3": {
			"drawable": 17,
			"texture": 0,
			"palette": 2
		},
		"4": {
			"drawable": 121,
			"texture": 0,
			"palette": 2
		},
		"5": {
			"drawable": -1,
			"texture": -1,
			"palette": 2
		},
		"6": {
			"drawable": 24,
			"texture": 0,
			"palette": 2
		},
		"7": {
			"drawable": 0,
			"texture": 0,
			"palette": 2
		},
		"8": {
			"drawable": 15,
			"texture": 0,
			"palette": 2
		},
		"9": {
			"drawable": 0,
			"texture": 0,
			"palette": 2
		},
		"10": {
			"drawable": 70,
			"texture": 0,
			"palette": 2
		},
		"11": {
			"drawable": 320,
			"texture": 0,
			"palette": 2
		}
	}
};
let sync = true, save = false;

mp.events.add("playerJoin", (player) => {
	player.data.outfit = JSON.parse(JSON.stringify(outfitPresets.default));
	player.resetClothes();
});

mp.events.addCommand("reset", (player) => {
	player.resetClothes();
});

mp.events.addCommand("sync", (player, fullText) => {
	sync = !sync;
	player.outputChatBox(`Outfit syncing has been turned ${sync === true ? '!{#00ff00}on' : '!{#ff0000}off'}`);
});

mp.events.addCommand("save", (player, fullText) => {
	save = !save;
	player.outputChatBox(`Outfit saving has been turned ${save === true ? '!{#00ff00}on' : '!{#ff0000}off'}`);
});

mp.events.addCommand("outfit", (player, index) => {
	if (isNaN(parseInt(index)) || parseInt(index) - 1 >= Object.keys(outfitPresets).length || parseInt(index) - 1 < 0)
		return player.outputChatBox(`Usage: /outfit [1-${Object.keys(outfitPresets).length}]`);
	
	const outfitPreset = outfitPresets[Object.keys(outfitPresets)[parseInt(index) - 1]];
	mp.players.forEach((_player) => {
		for (const componentId in outfitPreset) {
			_player.changeClothes(componentId, outfitPreset[componentId].drawable, outfitPreset[componentId].texture, save, sync);
		}
	});
});
