/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!************************!*\
  !*** ./src/rehoard.js ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _rehoard = __webpack_require__(/*! ./rehoard/rehoard.js */ 1);
	
	var _rehoard2 = _interopRequireDefault(_rehoard);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	module.exports = function () {
	    try {
	        window.ReHoard = _rehoard2.default;
	        return window.ReHoard;
	    } catch (e) {
	        return _rehoard2.default;
	    }
	}();

/***/ },
/* 1 */
/*!********************************!*\
  !*** ./src/rehoard/rehoard.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _rehoardpubsub = __webpack_require__(/*! ./components/rehoardpubsub.js */ 2);
	
	var _rehoardpubsub2 = _interopRequireDefault(_rehoardpubsub);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ReHoard = function () {
	    function ReHoard() {
	        _classCallCheck(this, ReHoard);
	
	        this._reHoardPubSub = new _rehoardpubsub2.default();
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
	
	
	    _createClass(ReHoard, [{
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
	
	        // Prints all states
	
	    }, {
	        key: "getStatesNames",
	        value: function getStatesNames() {
	            return this._reHoardPubSub.getStatesNames();
	        }
	    }]);
	
	    return ReHoard;
	}();
	
	exports.default = ReHoard;

/***/ },
/* 2 */
/*!*************************************************!*\
  !*** ./src/rehoard/components/rehoardpubsub.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _consolemessages = __webpack_require__(/*! ./consolemessages.js */ 3);
	
	var _consolemessages2 = _interopRequireDefault(_consolemessages);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ReHoardPubSub = function () {
	    function ReHoardPubSub() {
	        _classCallCheck(this, ReHoardPubSub);
	
	        this.changeSettings(null);
	        this._states = {};
	        this._actions_history = [];
	        this._storageName = "ReHoard";
	        this._persistanceLoad();
	        this._willSubscribeWhenAlive = [];
	        this._debug;
	    }
	
	    _createClass(ReHoardPubSub, [{
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
	
	                if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
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
	                this._debug.warn("getCurrentState failed to find state, check your state name");
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
	
	            state.typeOfElement = typeof stateValue === "undefined" ? "undefined" : _typeof(stateValue);
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
	                if (state.typeOfElement !== (typeof stateValue === "undefined" ? "undefined" : _typeof(stateValue))) {
	                    this._debug.error("Error, mutability violated for: " + state.name);
	                    return;
	                }
	            } else {
	                state.typeOfElement = typeof stateValue === "undefined" ? "undefined" : _typeof(stateValue);
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
	                        storage.setItem(this._storageName, JSON.stringify(data));
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
	
	                                var s = Object.assign({}, data.states);
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
	                    state: Object.assign({}, state),
	                    date: new Date()
	                });
	            }
	        }
	    }]);
	
	    return ReHoardPubSub;
	}();
	
	exports.default = ReHoardPubSub;

/***/ },
/* 3 */
/*!***************************************************!*\
  !*** ./src/rehoard/components/consolemessages.js ***!
  \***************************************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ConsoleMessages = function () {
	    function ConsoleMessages() {
	        var production = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	
	        _classCallCheck(this, ConsoleMessages);
	
	        this.production = production;
	    }
	
	    _createClass(ConsoleMessages, [{
	        key: "changeEnviroment",
	        value: function changeEnviroment() {
	            var production = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	
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

/***/ }
/******/ ]);
//# sourceMappingURL=rehoard.js.map