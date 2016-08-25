
import ReHoard from './rehoard/rehoard.js';
module.exports = ((settings) => {
    if (!window.ReHoard) {
        window.ReHoard = new ReHoard(settings);
        return window.ReHoard;
    } else {
        return window.ReHoard;
    }
})();
