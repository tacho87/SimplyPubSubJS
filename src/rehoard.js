
import ReHoard from './rehoard/rehoard.js';


module.exports = (() => {
    try {
        window.ReHoard = ReHoard;
        return window.ReHoard;
    } catch (e) {
        return ReHoard;
    }
})();


