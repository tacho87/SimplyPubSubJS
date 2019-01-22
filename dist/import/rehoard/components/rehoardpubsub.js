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

            try {
                var test = sessionStorage || localStorage;
            } catch (e) {
                this._settings.persist = false;
                this._settings.persist = false;
            }
            this._debug = new _consolemessages2.default(this._settings.production);
        }
    }, {
        key: "dispatch",
        value: function dispatch(stateName, stateValue) {
            var actionReference = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

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
        value: function subscribeWhenBecomesAlive(stateName, listener) {
            var unSubscribeCB = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;


            if (this._states.hasOwnProperty(stateName) && listener) return this.subscribe(stateName, listener, unSubscribeCB);else return this._willSubscribeWhenAlive.push({ name: stateName, listener: listener, unSubscribeCB: unSubscribeCB });
        }
    }, {
        key: "subscribe",
        value: function subscribe(stateName, listener, unSubscribeCB) {
            var _this = this;

            if (this._states.hasOwnProperty(stateName) && listener) {

                var state = this._states[stateName];

                var _uniqueId = Date.now();

                state.subscribers.push({
                    listener: listener,
                    unSubscribeCB: function unSubscribeCB() {
                        return _this._unSubscribe(stateName, _uniqueId);
                    },
                    uniqueId: _uniqueId
                });

                this._a_history(state, "Listener Subscribed");

                this._notifysubscribers(state);

                return {
                    unSubscribe: function unSubscribe() {
                        return _this._unSubscribe(stateName, _uniqueId);
                    }
                };
            } else {
                this._debug.warn(stateName + " does not exits yet... Cannot subscribe... :(");

                return false;
            }
        }
    }, {
        key: "broadcastState",
        value: function broadcastState(stateName) {

            var success = false;

            if (this._states.hasOwnProperty(stateName)) {
                var state = this._states[stateName];
                this._notifysubscribers(state);
                success = true;
            } else {
                this._debug.warn("broadcastState failed to find state, check your state name");
            }
            return success;
        }
    }, {
        key: "getCurrentValue",
        value: function getCurrentValue(stateName) {
            if (this._states.hasOwnProperty(stateName)) {
                var state = this._states[stateName];
                return state.value;
            } else {
                return null;
            }
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
                    this.broadcastState(stateName);
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
                    this.broadcastState(stateName);
                    this._persistanceSave();
                    success = true;
                }
            }
            return success;
        }
    }, {
        key: "getStatesNames",
        value: function getStatesNames() {
            var states = [];
            for (var property in this._states) {
                states.push(property);
            }
            return states;
        }

        //Private

    }, {
        key: "_unSubscribe",
        value: function _unSubscribe(stateName, uniqueId) {
            var success = false;
            if (this._states.hasOwnProperty(stateName) && stateName && uniqueId) {
                var state = this._states[stateName];
                state.subscribers = state.subscribers.filter(function (e) {
                    return e.uniqueId !== uniqueId;
                });
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

            //Remove jedis and update new queue.... BUG HERE
            // this._willSubscribeWhenAlive = this._willSubscribeWhenAlive.filter((e) => { return jedis.indexOf(e) < 0 })

            //Append to subscriber
            state.subscribers = jedis.map(function (e) {
                return {
                    listener: e.listener,
                    unSubscribeCB: e.unSubscribeCB,
                    uniqueId: Date.now()
                };
            });
            //Notify new unsubcribe method.
            state.subscribers.forEach(function (e, i) {
                try {
                    if (e.unSubscribeCB) {
                        e.unSubscribeCB({
                            unSubscribe: function unSubscribe() {
                                _this2._unSubscribe(e.name, uniqueId);
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
                    if (state.subscribers[i] && state.subscribers[i].listener !== null) {

                        setTimeout(function (opt, value) {
                            try {
                                opt.listener(value);
                            } catch (e) {
                                this._debug.error(e);
                            }
                        }.bind(this, state.subscribers[i], state.value), 0);
                    }
                }
            }
            this._a_history(state, "Notified Subscribers");
        }
    }, {
        key: "_persistanceSave",
        value: function _persistanceSave() {
            try {
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
                        this._debug.log(e);
                    }
                }
            } catch (e) {
                this._debug.log(e);
            }
        }
    }, {
        key: "_persistanceLoad",
        value: function _persistanceLoad() {
            try {
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
            } catch (e) {
                this._debug.log(e);
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