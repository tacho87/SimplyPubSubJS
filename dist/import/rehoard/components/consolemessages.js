"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ConsoleMessages = function () {
    function ConsoleMessages() {
        var production = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        (0, _classCallCheck3.default)(this, ConsoleMessages);

        this.production = production;
    }

    (0, _createClass3.default)(ConsoleMessages, [{
        key: "changeEnviroment",
        value: function changeEnviroment() {
            var production = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            this.production = production;
        }
    }, {
        key: "error",
        value: function error(text) {
            if (this.production) return;
            console.error(text);
        }
    }, {
        key: "warn",
        value: function warn(text) {
            if (this.production) return;
            console.error(text);
        }
    }, {
        key: "info",
        value: function info(text) {
            if (this.production) return;
            console.error(text);
        }
    }, {
        key: "log",
        value: function log(text) {
            if (this.production) return;
            console.error(text);
        }
    }, {
        key: "debug",
        value: function debug(text) {
            if (!this.production) return;
            console.error(text);
        }
    }]);
    return ConsoleMessages;
}();

exports.default = ConsoleMessages;