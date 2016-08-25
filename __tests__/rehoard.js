jest.unmock('../src/rehoard.js');


const ReHoard = require('../src/rehoard.js');


describe('ReHoard Global load check', () => {
    it('window.ReHoard && ReHoard have to exits globally', () => {
        expect(window.ReHoard).not.toBe(undefined);
        expect(ReHoard).not.toBe(undefined);

    });
});


describe('ReHoard initialized check', () => {
    it('should exist', () => {
        expect(window.ReHoard.subscribe).not.toBe(undefined);
    });
});


describe('ReHoard Should have one instance when calling ReHoard', () => {
    it('Should be one instance', () => {
        ReHoard.dispatch("IntanceTest", 1, "One Intance Test");
        const ReHoard2 = require('../src/rehoard.js');
        ReHoard2.dispatch("IntanceTest", 1, "One Intance Test");

        ReHoard2.subscribe("IntanceTest", (value) => {
            expect(value).toBe(1);
        })
        ReHoard.subscribe("IntanceTest", (value) => {
            expect(value).toBe(1);
        })
    });
});


describe('Test multiple ReHoard.subscribers', () => {
    it('All subscribers should get the correct value', () => {
        ReHoard.dispatch("MultipleSubscribers", "yes", "Initial Dispatch");

        for (var i = 0; i < 100; i++) {
            ReHoard.subscribe("MultipleSubscribers", (value) => {
                expect(value).toBe("yes");
                total++;
            });
        }
        ReHoard.dispatch("MultipleSubscribers", "yes", "Second dispatch");
    });
});



describe('Stress Test multiple ReHoard.subscribers', () => {
    it('All subscribers should get the correct value', () => {
        ReHoard.dispatch("StressMultipleSubscribers", "yes", "Initial Dispatch");

        for (var i = 0; i < 10000; i++) {
            ReHoard.subscribe("StressMultipleSubscribers", (value) => {
                expect(value).toBe("yes");
            });
        }
        ReHoard.dispatch("StressMultipleSubscribers", "yes", "Second dispatch");
        ReHoard.dispatch("StressMultipleSubscribers2", "yes", "Initial dispatch");

        for (var i = 0; i < 10000; i++) {
            ReHoard.subscribe("StressMultipleSubscribers2", (value) => {
                expect(value).toBe("yes");
            });
        }
        ReHoard.dispatch("StressMultipleSubscribers2", "yes", "Second dispatch");




        ReHoard.dispatch("StressMultipleSubscribers3", "yes", "Initial Dispatch");

        for (var i = 0; i < 10000; i++) {
            ReHoard.subscribe("StressMultipleSubscribers3", (value) => {
                expect(value).toBe("yes");
            });
        }
        ReHoard.dispatch("StressMultipleSubscribers3", "yes", "Second dispatch");
        ReHoard.dispatch("StressMultipleSubscribers4", "yes", "Initial dispatch");

        for (var i = 0; i < 10000; i++) {
            ReHoard.subscribe("StressMultipleSubscribers4", (value) => {
                expect(value).toBe("yes");
            });
        }
        ReHoard.dispatch("StressMultipleSubscribers4", "yes", "Second dispatch");
    });
});

/**Todo tests */