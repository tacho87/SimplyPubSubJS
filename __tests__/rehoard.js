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
        let rehoard = new window.ReHoard();
        expect(rehoard.subscribe).not.toBe(undefined);
    });
});


describe('ReHoard Should have multiple instances when calling ReHoard', () => {
    it('Should be more than one instance', () => {
        let rehoard = new window.ReHoard();
        let rehoard2 = new window.ReHoard();
        
        rehoard.dispatch("IntanceTest", 1, "One Intance Test");

        rehoard2.dispatch("IntanceTest", 2, "One Intance Test");

        rehoard2.subscribe("IntanceTest", (value) => {
            expect(value).toBe(2);
        })
        rehoard.subscribe("IntanceTest", (value) => {
            expect(value).toBe(1);
        })
    });
});


describe('Test multiple ReHoard.subscribers', () => {
    it('All subscribers should get the correct value', () => {
        let rehoard = new window.ReHoard();
        rehoard.dispatch("MultipleSubscribers", "yes", "Initial Dispatch");

        for (var i = 0; i < 100; i++) {
            rehoard.subscribe("MultipleSubscribers", (value) => {
                expect(value).toBe("yes");
                total++;
            });
        }
        rehoard.dispatch("MultipleSubscribers", "yes", "Second dispatch");
    });
});



describe('Stress Test multiple ReHoard.subscribers', () => {
    it('All subscribers should get the correct value', () => {
        let rehoard = new window.ReHoard();
        rehoard.dispatch("StressMultipleSubscribers", "yes", "Initial Dispatch");

        for (var i = 0; i < 10000; i++) {
            rehoard.subscribe("StressMultipleSubscribers", (value) => {
                expect(value).toBe("yes");
            });
        }
        rehoard.dispatch("StressMultipleSubscribers", "yes", "Second dispatch");
        rehoard.dispatch("StressMultipleSubscribers2", "yes", "Initial dispatch");

        for (var i = 0; i < 10000; i++) {
            rehoard.subscribe("StressMultipleSubscribers2", (value) => {
                expect(value).toBe("yes");
            });
        }
        rehoard.dispatch("StressMultipleSubscribers2", "yes", "Second dispatch");




        rehoard.dispatch("StressMultipleSubscribers3", "yes", "Initial Dispatch");

        for (var i = 0; i < 10000; i++) {
            rehoard.subscribe("StressMultipleSubscribers3", (value) => {
                expect(value).toBe("yes");
            });
        }
        rehoard.dispatch("StressMultipleSubscribers3", "yes", "Second dispatch");
        rehoard.dispatch("StressMultipleSubscribers4", "yes", "Initial dispatch");

        for (var i = 0; i < 10000; i++) {
            rehoard.subscribe("StressMultipleSubscribers4", (value) => {
                expect(value).toBe("yes");
            });
        }
        rehoard.dispatch("StressMultipleSubscribers4", "yes", "Second dispatch");
    });
});

/**Todo tests */