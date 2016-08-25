
import ReHoard from './rehoard/rehoard.js';


module.exports = (() => {
    if (!window.ReHoard) {
        window.ReHoard = new ReHoard();
        return window.ReHoard;
    } else {
        return window.ReHoard;
    }
})();


