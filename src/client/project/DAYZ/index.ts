mp.keys.bind(0x71, true, function() {
    mp.events.callRemote('car'); 
    mp.gui.chat.push('F2 key is pressed.');
});