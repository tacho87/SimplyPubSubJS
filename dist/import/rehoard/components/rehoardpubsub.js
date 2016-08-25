"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _consolemessages = require("./consolemessages.js");

var _consolemessages2 = _interopRequireDefault(_consolemessages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReHoardPubSub = function () {
    function ReHoardPubSub() {
        (0, _classCallCheck3.default)(this, ReHoardPubSub);

        this.changeSettings(null);
        this._states = {};
        this._actions_history = [];
        this._storageName = "ReHoard";
        this._persistanceLoad();
        this._willSubscribeWhenAlive = [];
        this._debug;
    }

    (0, _createClass3.default)(ReHoardPubSub, [{
        key: "changeSettings",
        value: function changeSettings(settings) {

            this._settings = {
                persistance: {
                    persist: settings && settings.persist ? settings.persist : true,
                    session: settings && settings.session ? settings.session : true,
                    timeAlive: settings && settings.timeAlive ? settings.timeAlive : 1
                },
                undoRedo: settings && settings.undoRedo ? settings.undoRedo : true,
                actionsHistory: settings && settings.actionsHistory ? settings.actionsHistory : true,
                actionsHistoryLimit: settings && settings.actionsHistoryLimit ? settings.actionsHistoryLimit : 100,
                typeMutable: settings && settings.typeMutable ? settings.typeMutable : false,
                production: settings && settings.production ? settings.production : true
            };
            this._debug = new _consolemessages2.default(this._settings.production);
        }
    }, {
        key: "dispatch",
        value: function dispatch(stateName, stateValue) {
            var actionReference = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];

            var success = false;

            if (!stateName || !stateValue) {
                this._debug.error("Null parameters dispatched ");
                return success;
            }
            if (typeof actionReference !== "string") {
                this._debug.error("An action must be a string type");
                return success;
            }

            if (this._states.hasOwnProperty(stateName)) {
                var state = this._states[stateName];

                this._update(state, stateName, stateValue, actionReference);
                this._notifysubscribers(state);

                success = true;
            } else {

                this._create(stateName, stateValue, actionReference);

                success = true;
            }

            this._persistanceSave();

            return success;
        }
    }, {
        key: "subscribeWhenBecomesAlive",
        value: function subscribeWhenBecomesAlive(stateName, listener, unSubscribeCB) {
            if (this._states.hasOwnProperty(stateName) && listener) {
                return this.subscribe(stateName, listener);
            } else {
                return this._willSubscribeWhenAlive.push({ name: stateName, listener: listener, unSubscribeCB: unSubscribeCB });
            }
        }
    }, {
        key: "subscribe",
        value: function subscribe(stateName, listener) {
            var _this = this;

            if (this._states.hasOwnProperty(stateName) && listener) {
                var _ret = function () {

                    var state = _this._states[stateName];
                    var index = state.subscribers.push({
                        listener: listener,
                        unSubscribeCB: undefined
                    });
                    _this._a_history(state, "Listener Subscribed");
                    _this._notifysubscribers(state);
                    return {
                        v: {
                            unSubscribe: function unSubscribe() {
                                _this._unSubscribe(stateName, index);
                            }
                        }
                    };
                }();

                if ((typeof _ret === "undefined" ? "undefined" : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
            } else {
                this._debug.warn(stateName + " does not exits yet... Cannot subscribe... :(");
                return false;
            }
        }
    }, {
        key: "getCurrentState",
        value: function getCurrentState(stateName) {
            var success = false;
            if (this._states.hasOwnProperty(stateName)) {
                var state = this._states[stateName];
                this._notifysubscribers(state);
                success = true;
            } else {
                this._debug.warn("getCurrentState failed to find state, check your state name");
            }
            return success;
        }
    }, {
        key: "deleteState",
        value: function deleteState(stateName) {
            var success = false;
            if (this._states.hasOwnProperty(stateName)) {
                this._a_history(this._states[stateName], "State Deleted");
                this._persistanceSave();
                delete this._states[stateName];
                success = !this._states[stateName];
            } else {
                this._debug.error(stateName + " does not exits yet... Cannot delete");
            }
            return success;
        }
    }, {
        key: "redo",
        value: function redo(stateName) {
            var success = false;
            if (this._settings.undoRedo && stateName && this._states.hasOwnProperty(stateName)) {
                var state = this._states[stateName];
                if (state.redoStack.length > 0) {
                    state.undoStack.push({ value: state.value, action: state.actionReference });
                    var s = state.redoStack.pop();
                    state.value = s.value;
                    state.actionReference = s.actionReference;
                    this._a_history(state, "Redo");
                    this.getCurrentState(stateName);
                    this._persistanceSave();
                    success = true;
                }
            }
            return success;
        }
    }, {
        key: "undo",
        value: function undo(stateName) {
            var success = false;
            if (this._settings.undoRedo && stateName && this._states.hasOwnProperty(stateName)) {
                var state = this._states[stateName];
                if (state.undoStack.length > 0) {
                    state.redoStack.push({ value: state.value, action: state.actionReference });
                    var s = state.undoStack.pop();
                    state.value = s.value;
                    state.actionReference = s.actionReference;
                    this._a_history(state, "Undo");
                    this.getCurrentState(stateName);
                    this._persistanceSave();
                    success = true;
                }
            }
            return success;
        }

        //Private

    }, {
        key: "_unSubscribe",
        value: function _unSubscribe(stateName, index) {
            var success = false;
            if (this._states.hasOwnProperty(stateName) && stateName && index) {
                var state = this._states[stateName];
                state.subscribers[index - 1] = null;
                this._a_history(state, "unSubcribed");
                success = true;
            } else {
                this._debug.warn(stateName + " does not exits yet... Cannot unSubcribe... :(");
            }
            return success;
        }
    }, {
        key: "_create",
        value: function _create(stateName, stateValue, actionReference) {
            var state = this._states[stateName] = {};

            state.typeOfElement = typeof stateValue === "undefined" ? "undefined" : (0, _typeof3.default)(stateValue);
            state.name = stateName;
            state.value = stateValue;
            if (this._willSubscribeWhenAlive.length > 0) {
                this._willSubscribeCore(state);
            } else {
                state.subscribers = [];
            }
            state.action = actionReference;

            if (this._settings.undoRedo) {
                state.undoStack = [];
                state.redoStack = [];
            }
            this._notifysubscribers(state);
            this._a_history(state, "Created");
        }
    }, {
        key: "_update",
        value: function _update(state, stateName, stateValue, actionReference) {
            if (!this._settings.typeMutable) {
                if (state.typeOfElement !== (typeof stateValue === "undefined" ? "undefined" : (0, _typeof3.default)(stateValue))) {
                    this._debug.error("Error, mutability violated for: " + state.name);
                    return;
                }
            } else {
                state.typeOfElement = typeof stateValue === "undefined" ? "undefined" : (0, _typeof3.default)(stateValue);
            }
            if (this._settings.undoRedo) {
                if (state.undoStack.length >= 100) {
                    state.undoStack.splice(parseInt(0, parseInt(state.undoStack.length / 2)));
                }
                state.undoStack.push({ value: state.value, action: state.actionReference });
                state.redoStack = [];
            }
            state.value = stateValue;
            state.action = actionReference;
            this._a_history(state, "Updated");
        }
    }, {
        key: "_willSubscribeCore",
        value: function _willSubscribeCore(state) {
            var _this2 = this;

            //TODO: Refactor, 4X O(N)

            //Extract will subcribe for this instance
            var jedis = this._willSubscribeWhenAlive.filter(function (e) {
                return e.name === state.name;
            });

            //Remove jedis and update new queue
            this._willSubscribeWhenAlive = this._willSubscribeWhenAlive.filter(function (e) {
                return jedis.indexOf(e) < 0;
            });

            //Append to subscriber
            state.subscribers = jedis.map(function (e) {
                return {
                    listener: e.listener,
                    unSubscribeCB: e.unSubscribeCB
                };
            });
            //Notify new unsubcribe method.
            state.subscribers.forEach(function (e, i) {
                try {
                    if (e.unSubscribeCB) {
                        e.unSubscribeCB({
                            unSubscribe: function unSubscribe() {
                                _this2._unSubscribe(e.name, i);
                            }
                        });
                    }
                } catch (o) {
                    _this2._debug.warn(o);
                }
            });
        }
    }, {
        key: "_notifysubscribers",
        value: function _notifysubscribers(state) {
            if (state && state.subscribers.length > 0) {
                for (var i = 0; i < state.subscribers.length; i++) {
                    try {
                        if (state.subscribers[i] && state.subscribers[i].listener !== null) {
                            state.subscribers[i].listener(state.value);
                        }
                    } catch (e) {
                        this._debug.warn(state.subscribers[i].listener + " No longer in scope");
                    }
                }
                this._a_history(state, "Notified Subscribers");
            }
        }
    }, {
        key: "_persistanceSave",
        value: function _persistanceSave() {
            if (this._settings.persistance.persist) {
                var storage = void 0;
                if (this._settings.persistance.session) {
                    storage = sessionStorage;
                } else {
                    storage = localStorage;
                }
                try {
                    var data = {
                        date: new Date(),
                        states: this._states
                    };
                    storage.setItem(this._storageName, (0, _stringify2.default)(data));
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }, {
        key: "_persistanceLoad",
        value: function _persistanceLoad() {
            if (this._settings.persistance.persist) {
                var storage = void 0;
                if (this._settings.persistance.session) {
                    storage = sessionStorage;
                } else {
                    storage = localStorage;
                }
                try {
                    var results = storage.getItem(this._storageName);
                    if (results) {
                        var data = JSON.parse(results);
                        var date = new Date(data.date);
                        date.setDate(date.getDate() + this._settings.timeAlive);
                        if (date < new Date()) {
                            storage.removeItem(this._storageName);
                        } else {

                            var s = (0, _assign2.default)({}, data.states);
                            for (var x in s) {
                                s[x].subscribers = [];
                            }
                            this._states = s;
                        }
                    }
                } catch (e) {
                    this._debug.log(e);
                }
            }
        }
    }, {
        key: "_a_history",
        value: function _a_history(state, action) {
            if (this._settings.actionsHistory) {
                if (this._actions_history.length >= this._settings.actionsHistoryLimit) {
                    this._actions_history.splice(parseInt(0, parseInt(this._actions_history.length / 2)));
                }
                this._actions_history.push({
                    action: action,
                    state: (0, _assign2.default)({}, state),
                    date: new Date()
                });
            }
        }
    }]);
    return ReHoardPubSub;
}();

exports.default = ReHoardPubSub;