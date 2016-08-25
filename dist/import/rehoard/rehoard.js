"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _rehoardpubsub = require("./components/rehoardpubsub.js");

var _rehoardpubsub2 = _interopRequireDefault(_rehoardpubsub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReHoard = function () {
    function ReHoard() {
        (0, _classCallCheck3.default)(this, ReHoard);

        this._reHoardPubSub = new _rehoardpubsub2.default();
        window.StateHub = this;
    }

    (0, _createClass3.default)(ReHoard, [{
        key: "changeSettings",
        value: function changeSettings(settings) {
            this._reHoardPubSub.changeSettings(settings);
        }
    }, {
        key: "dispatch",
        value: function dispatch(stateName, stateValue) {
            var actionReference = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];

            return this._reHoardPubSub.dispatch(stateName, stateValue, actionReference);
        }
    }, {
        key: "subscribe",
        value: function subscribe(stateName, listener) {
            return this._reHoardPubSub.subscribe(stateName, listener);
        }
    }, {
        key: "subscribeWhenBecomesAlive",
        value: function subscribeWhenBecomesAlive(stateName, listener, unSubscribeCB) {
            return this._reHoardPubSub.subscribeWhenBecomesAlive(stateName, listener, unSubscribeCB);
        }
    }, {
        key: "getCurrentState",
        value: function getCurrentState(stateName) {
            return this._reHoardPubSub.getCurrentState(stateName);
        }
    }, {
        key: "deleteState",
        value: function deleteState(stateName) {
            return this._reHoardPubSub.deleteState(stateName);
        }
    }, {
        key: "redo",
        value: function redo(stateName) {
            return this._reHoardPubSub.redo(stateName);
        }
    }, {
        key: "undo",
        value: function undo(stateName) {
            return this._reHoardPubSub.undo(stateName);
        }
    }]);
    return ReHoard;
}();

exports.default = ReHoard;