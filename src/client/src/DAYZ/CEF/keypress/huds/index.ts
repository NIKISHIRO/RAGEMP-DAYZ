import { setDisplayInterface } from "../../displayUI";

// F6
let flag = true;
mp.keys.bind(0x75, true, function() {
    if (!mp.players.local.getVariable('isAuth')) return;
  
    flag = !flag;
    mp.gui.chat.push(JSON.stringify(flag));
    setDisplayInterface('huds', flag);
});