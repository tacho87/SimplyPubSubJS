
import ReHoard from './rehoard/rehoard.js';

export default ((settings) => {
    if (!window.StateHub) {
        return new StateHubInt(settings);
    } else {
        return window.StateHub;
    }
})();
