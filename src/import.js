
import ReHoard from './rehoard/rehoard.js';

export default ((settings) => {
    if (!window.ReHoard) {
        return new ReHoard(settings);
    } else {
        return window.ReHoard;
    }
})();
