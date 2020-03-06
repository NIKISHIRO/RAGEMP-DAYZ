mp.keys.bind(0x47, true, function() {
    mp.events.callRemote('keypress:G');
});

function testFunction(a, b) {
    mp.gui.chat.push(b);
}