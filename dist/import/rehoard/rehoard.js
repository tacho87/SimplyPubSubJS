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

    /* Allow to change default settings. 
    settings = {
            persist : true,
            session : true,
            timeAlive : 1,
            undoRedo:  true,
            actionsHistory: true,
            actionsHistoryLimit:  100,
            typeMutable: false,
            production:  true
       };
    */


    (0, _createClass3.default)(ReHoard, [{
        key: "changeSettings",
        value: function changeSettings(settings) {
            this._reHoardPubSub.changeSettings(settings);
        }

        // Allows to create the state in a more explict way, a value must be passed to determine its type.
        // Dispatch will handle creation, so this is not needed.

    }, {
        key: "create",
        value: function create(stateName, stateValue) {
            return this._reHoardPubSub._create(stateName, stateValue, "CREATION");
        }

        // dispatch changes, this will broadcast to any subscribers.
        // If state does not exists, it will create it, otherwise, it will update its value. 

    }, {
        key: "dispatch",
        value: function dispatch(stateName, stateValue) {
            var actionReference = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];

            return this._reHoardPubSub.dispatch(stateName, stateValue, actionReference);
        }

        // subcribes to an existing state, if it does not exists it will throw an exception. 

    }, {
        key: "subscribe",
        value: function subscribe(stateName, listener) {
            return this._reHoardPubSub.subscribe(stateName, listener);
        }

        // will subscribe if the state exists, otherwise will queue it up once it is created. 

    }, {
        key: "subscribeWhenBecomesAlive",
        value: function subscribeWhenBecomesAlive(stateName, listener, unSubscribeCB) {
            return this._reHoardPubSub.subscribeWhenBecomesAlive(stateName, listener, unSubscribeCB);
        }

        // force a broadcast of the current value to everyone

    }, {
        key: "broadcastState",
        value: function broadcastState(stateName) {
            return this._reHoardPubSub.broadcastState(stateName);
        }

        // returns current value of the state sync. No broadcasting happens

    }, {
        key: "getCurrentState",
        value: function getCurrentState(stateName) {
            return this._reHoardPubSub.getCurrentValue(stateName);
        }

        // Delete the current state and its listeners.

    }, {
        key: "deleteState",
        value: function deleteState(stateName) {
            return this._reHoardPubSub.deleteState(stateName);
        }

        // Redo the value state + action 

    }, {
        key: "redo",
        value: function redo(stateName) {
            return this._reHoardPubSub.redo(stateName);
        }

        // Undo the value to previous one

    }, {
        key: "undo",
        value: function undo(stateName) {
            return this._reHoardPubSub.undo(stateName);
        }
    }]);
    return ReHoard;
}();

exports.default = ReHoard;