'use strict';

var _rehoard = require('./rehoard/rehoard.js');

var _rehoard2 = _interopRequireDefault(_rehoard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
    if (!window.ReHoard) {
        window.ReHoard = new _rehoard2.default();
        return window.ReHoard;
    } else {
        return window.ReHoard;
    }
}();