mp.events.addCommand("lesson", (player, fullText, weapon, ammo) => {
	var weaponHash = mp.joaat(weapon);
	player.giveWeapon(weaponHash, parseInt(ammo) || 10000);
});