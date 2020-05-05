import { setDisplayInterface } from "../../displayUI";

// F6
let flag = false;
mp.keys.bind(0x75, true, function() {
    flag = !flag;
    mp.gui.chat.push(JSON.stringify(flag));
    setDisplayInterface('huds', flag);
});