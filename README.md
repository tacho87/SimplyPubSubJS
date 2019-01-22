# REHOARD

## Introduction

**Rehoard (simply pub/sub)** is a project built in 2015 as an alternative to redux for **internal use only** (never meant to be used by others, so bug and untested parts might exists).

It is a **simply pub/sub** for **ReactJs**,  **Vanilla JS** and **NodeJs**. It support local/session storage with redo/undo of actions. 

### *Some features*
* **Web browser**, it will save everything by default using **sessionStorage** in case of accidental web refresh. (check settings, for changing from **sessionStorage** to **localstorage** or **off**)
* Allows **redo/undo** up to 100 values. You may increase the size and should not affect performance. Note: this is only for state value and not the subcribers. Any subscriber which is not longer subcribed, will not get the changes. 
* **Nodejs**, storage is **off** by default, also no window object.
* The code tries to be LOOKUP **O(1)** and broadcast **O(N)**. Note, in order to get O(N) all callbacks get assigned to a **setTimout** to avoid stack fragmentation so plan accordingly and do not overload with complex operations on each callback. 
* Due to queuing up each callback after the broadcast happened, if your code changes the state value too fast, you might have a delayed effect on updates (You should get all messages in order)

---
## Class methods



```javascript
class ReHoard {

    constructor() {
        this._reHoardPubSub = new ReHoardPubSub();
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
    changeSettings(settings) {
        this._reHoardPubSub.changeSettings(settings);
    }

    // Allows to create the state in a more explict way, a value must be passed to determine its type.
    // Dispatch will handle creation, so this is not needed.
    create(stateName, stateValue) {
        return this._reHoardPubSub._create(stateName, stateValue, "CREATION");
    }


    // dispatch changes, this will broadcast to any subscribers.
    // If state does not exists, it will create it, otherwise, it will update its value. 
    dispatch(stateName, stateValue, actionReference = "") {
        return this._reHoardPubSub.dispatch(stateName, stateValue, actionReference);
    }

    // subcribes to an existing state, if it does not exists it will throw an exception. 
    subscribe(stateName, listener, unSubscribeCB) {
        return this._reHoardPubSub.subscribe(stateName, listener, unSubscribeCB);
    }

    // will subscribe if the state exists, otherwise will queue it up once it is created. 
    subscribeWhenBecomesAlive(stateName, listener, unSubscribeCB) {
        return this._reHoardPubSub.subscribeWhenBecomesAlive(stateName, listener, unSubscribeCB);
    }

    // force a broadcast of the current value to everyone
    broadcastState(stateName) {
        return this._reHoardPubSub.broadcastState(stateName);
    }

    // returns current value of the state sync. No broadcasting happens
    getCurrentState(stateName) {
        return this._reHoardPubSub.getCurrentValue(stateName);
    }

    // Delete the current state and its listeners.
    deleteState(stateName) {
        return this._reHoardPubSub.deleteState(stateName);
    }

    // Redo the value state + action 
    redo(stateName) {
        return this._reHoardPubSub.redo(stateName);
    }

    // Undo the value to previous one
    undo(stateName) {
        return this._reHoardPubSub.undo(stateName);
    }

    // Prints all states
    getStatesNames(){
        return this._reHoardPubSub.getStatesNames();
    }
}
```


---

## Installation
```javascript
npm install rehoard --save
```
or 
```javascript
 <script src="dist/js/rehoard.min.js"></script>
```
---
## Usage

### ES6
```javascript
import Rehoard from 'Rehoard';

const rehoard = new Rehoard();
```


### WWW -- HEAD SCRIPT FIRST
```javascript
var rehoard = new window.Rehoard();
```

---
## Code Samples

## Example 1
```javascript
rehoard.create("testOne", 1);

const listener1 = rehoard.subscribe("testOne", function(value) {
    console.log(value);
});

rehoard.dispatch("testOne", 100); //console -> 100
rehoard.dispatch("testOne", 1000); //console -> 1000
rehoard.dispatch("testOne", 10000); //console -> 10000

listener1.unSubscribe();

rehoard.dispatch("testOne", 10); // nothing happens
```

## Example 2 -- SUBCRIBE TO A FUTURE STATE
*You may subscribe to a state which do not exists at that moment (data coming from other api's). This allows you to setup everything and respond once it exists accordingly*
```javascript
rehoard.subscribeWhenBecomesAlive("testOne", function(value) {
    console.log(value);
});

rehoard.create("testOne", 1);

rehoard.dispatch("testOne", 100); //console -> 100
rehoard.dispatch("testOne", 1000); //console -> 1000
rehoard.dispatch("testOne", 10000); //console -> 10000
```


## Example 3 -- DISPATCH
*Dispatch will create or update the state implicitly, so **Reahord.create()** is useful to mark where we create the initial state if needed* 
```javascript
rehoard.subscribeWhenBecomesAlive("testOne", function(value) {
    console.log(value);
});

rehoard.dispatch("testOne", 100); //console -> 100
rehoard.dispatch("testOne", 1000); //console -> 1000
rehoard.dispatch("testOne", 10000); //console -> 10000

```

## Example 4 -- REDO/UNDO

```javascript
rehoard.subscribeWhenBecomesAlive("testOne", function(value) {
    console.log(value);
});

rehoard.dispatch("testOne", 100); //console -> 100
rehoard.dispatch("testOne", 1000); //console -> 1000
rehoard.dispatch("testOne", 10000); //console -> 10000

rehoard.undo("testOne"); //console --> 1000
rehoard.undo("testOne"); //console --> 100
rehoard.undo("TestOne"); // Nothing
rehoard.redo("TestOne"); // console --> 100
```

## Example 5 -- INMUTABILITY
*By default, types cannot be mutaded. If behaviour is needed, you may change them in the settings*
```javascript
rehoard.subscribeWhenBecomesAlive("testOne", function(value) {
    console.log(value);
});

rehoard.dispatch("testOne", 100); //console -> 100
rehoard.dispatch("testOne", "hola"); // console --> Error if type inmutability is ON, otherwise "hola" 
```

## Example 5 -- ACTION MESSAGES
*You may pass Action messages to keep a history of what changed the data*
```javascript
rehoard.subscribeWhenBecomesAlive("testOne", function(value) {
    console.log(value);
});

rehoard.dispatch("testOne", 100, "Initial"); //console -> 100
rehoard.dispatch("testOne", 1000, "New value"); //console -> 1000
rehoard.dispatch("testOne", 10000, "Last value"); //console -> 10000
```


---
***Note 1:** I hate the name*

***Note 2:** Not responsible for any damage or bug, it was never intended to be used by other people*

***Note 3:** Tests are busted at the moment, no async check. Will fix them later.*