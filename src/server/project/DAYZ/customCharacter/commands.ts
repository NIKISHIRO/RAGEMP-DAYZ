import {Char} from './function';
mp.events.addCommand('color', (player: PlayerMp,fullText:string, a:string, b: string, c:string, i:string, j: string, k:string) => {
    player.setHeadBlend(
        parseInt(a), parseInt(i), 0,
        parseInt(b), parseInt(j), 0,
        parseFloat(c), parseFloat(k), 0)
})

mp.events.addCommand('face', (player: PlayerMp, ) => {
    for(let i = 0; i <= 19; i++){
        console.log(Char.random(-1, 1))
        player.setFaceFeature(i, Char.random(-1, 1));
    }
})


mp.events.addCommand('custom', (player: PlayerMp, fullText, MotherBlend, FatherBlend, fBlendShape, fBlendSkin, HairHighlight, HairColour) => {
    if(!fullText) return player.outputChatBox('number number number number number number number')
    var bGender = true;
    if(player.model != 1885233650) {
	    bGender = false;
    }


    var NoseWidth = 0, NoseHeight = 0, NoseLength = 0, NoseBridge = 0, NoseTip = 0, NoseBridgeShift = 0;
    var BrowHeight = 0, BrowWidth = 0, CBoneHeight = 0, CBoneWidth = 0, CheekWidth = 0, Eyes = 0, Lips = 0;
    var JawWidth = 0, jawHeight = 0, ChinLength = 0, ChinPos = 0, ChinWidth = 0, ChinShape = 0, NeckWidth = 0;

    player.setCustomization(bGender, parseInt(MotherBlend), parseInt(FatherBlend), 0, parseInt(MotherBlend), parseInt(FatherBlend), 0, parseInt(fBlendShape), parseInt(fBlendSkin), 0, 1, parseInt(HairColour), parseInt(HairHighlight), 
        [
            NoseWidth, NoseHeight, NoseLength, NoseBridge, NoseTip, NoseBridgeShift, 
            BrowHeight, BrowWidth, CBoneHeight, CBoneWidth, CheekWidth, Eyes, Lips,
            JawWidth, jawHeight, ChinLength, ChinPos, ChinWidth, ChinShape, NeckWidth
        ]
    );
})
let i = 0;
mp.events.add('previ', (player:PlayerMp) => {
    --i;
    var bGender = true;
if(player.model != 1885233650) {
	bGender = false;
}

var MotherBlend = 21, FatherBlend = 41, fBlendShape = 0.5, fBlendSkin = 0.5, HairHighlight = 0, HairColour = 0;

var NoseWidth = 0, NoseHeight = 0, NoseLength = 0, NoseBridge = 0, NoseTip = 0, NoseBridgeShift = 0;
var BrowHeight = 0, BrowWidth = 0, CBoneHeight = 0, CBoneWidth = 0, CheekWidth = 0, Eyes = 0, Lips = 0;
var JawWidth = 0, jawHeight = 0, ChinLength = 0, ChinPos = 0, ChinWidth = 0, ChinShape = 0, NeckWidth = 0;

player.setCustomization(bGender, MotherBlend, FatherBlend, 0, MotherBlend, FatherBlend, 0, fBlendShape, fBlendSkin, 0, 1, HairColour, HairHighlight, 
	[
		NoseWidth, NoseHeight, NoseLength, NoseBridge, NoseTip, NoseBridgeShift, 
		BrowHeight, BrowWidth, CBoneHeight, CBoneWidth, CheekWidth, Eyes, Lips,
		JawWidth, jawHeight, ChinLength, ChinPos, ChinWidth, ChinShape, NeckWidth
	]
);
})
mp.events.add('nexti', (player:PlayerMp) => {
    ++i;
    var bGender = true;
if(player.model != 1885233650) {
	bGender = false;
}

var MotherBlend = 21, FatherBlend = 41, fBlendShape = 0.5, fBlendSkin = 0.5, HairHighlight = 0, HairColour = 0;

var NoseWidth = 0, NoseHeight = 0, NoseLength = 0, NoseBridge = 0, NoseTip = 0, NoseBridgeShift = 0;
var BrowHeight = 0, BrowWidth = 0, CBoneHeight = 0, CBoneWidth = 0, CheekWidth = 0, Eyes = 0, Lips = 0;
var JawWidth = 0, jawHeight = 0, ChinLength = 0, ChinPos = 0, ChinWidth = 0, ChinShape = 0, NeckWidth = 0;

player.setCustomization(bGender, MotherBlend, FatherBlend, 0, MotherBlend, FatherBlend, 0, fBlendShape, fBlendSkin, 0, 1, HairColour, HairHighlight, 
	[
		NoseWidth, NoseHeight, NoseLength, NoseBridge, NoseTip, NoseBridgeShift, 
		BrowHeight, BrowWidth, CBoneHeight, CBoneWidth, CheekWidth, Eyes, Lips,
		JawWidth, jawHeight, ChinLength, ChinPos, ChinWidth, ChinShape, NeckWidth
	]
);
})
