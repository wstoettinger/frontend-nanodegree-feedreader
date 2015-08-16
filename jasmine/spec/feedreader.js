/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function () {
    'use strict';

    /* This is our first test suite - a test suite just contains
     * a related set of tests. This suite is all about the RSS
     * feeds definitions, the allFeeds variable in our application.
     */
    describe('RSS Feeds', function () {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function () {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });

        // test if each feed has a name and the name is not empty
        it('testing names', function () {
            for (var i = 0; i < allFeeds.length; i++) {
                var feed = allFeeds[i];
                console.log(feed.name);
                expect(feed.name).toBeDefined();
                expect(feed.name.length).not.toBe(0);
            }
        });

        // test if each feed has an url and the url is not empty
        it('testing urls', function () {
            for (var i = 0; i < allFeeds.length; i++) {
                var feed = allFeeds[i];
                console.log(feed.url);
                expect(feed.url).toBeDefined();
                expect(feed.url.length).not.toBe(0);
            }
        });

        // run through each feed
        // for (var i = 0; i < allFeeds.length; i++) {
        //     // contrary to the reviewers suggestion of putting the tests in separate for loops (see commented code above), i solved the scope-problem by creating an anonymous function and executing it.
        //     (function testFeed(feed) {
        //         describe('Feed: ' + feed.name, function () {
        //             // test if each feed has a name and the name is not empty
        //             it('has Name', function () {
        //                 console.log(feed.name);
        //                 expect(feed.name).toBeDefined();
        //                 expect(feed.name.length).not.toBe(0);
        //             });
        //             // test if each feed has an url and the url is not empty
        //             it('has URL', function () {
        //                 console.log(feed.url);
        //                 expect(feed.url).toBeDefined();
        //                 expect(feed.url.length).not.toBe(0);
        //             });
        //         });
        //     })(allFeeds[i]);
        // }
    });

    /*
     *  Testing the menu
     */
    describe("The  menu", function () {
        var bdy = $('body');
        var menuIcon = $('.menu-icon-link');

        // this test ensures that the menu element is hidden by default
        it("is hidden", function () {
            expect(bdy.hasClass('menu-hidden')).toBe(true);
        });

        // this test ensures, that the menu element shows and hides on clicks
        it("displays and hides on click", function () {
            simulate(menuIcon[0], "click");
            expect(bdy.hasClass('menu-hidden')).toBe(false);

            simulate(menuIcon[0], "click");
            expect(bdy.hasClass('menu-hidden')).toBe(true);
        });
    });

    describe("Initial Entries", function () {
        // Quersion: why should the beforeEach function be used here????

        it("empty container", function () {
            var container = $(".feed");
            container.empty(); // empty container before testing the loadFeed function
            expect(container.children().length).toEqual(0);
        });

        it("loads initial entries", function (done) {
            function testLoadFeed() {
                loadFeed(0, function () {
                    var entries = $(".feed").children().filter(".entry-link");
                    if (entries.length === 0)
                        done.fail("no entries loaded");
                    else
                        done();
                });
            }
            expect(testLoadFeed).not.toThrow();
        });
    });

    describe("New Feed Selection", function () {
        it("content changes after feed loading", function (done) {

            function testLoadFeed() {
                function createTestCallback(done, content) {
                    return function () {
                        var newContent = $(".feed")[0].innerHTML;
                        if (content == newContent)
                            done.fail("content didn't change");
                        else
                            done();
                    };
                }

                // first load Feed number 1 and then number 0 again and compare if the content actully changed
                loadFeed(1, function () {
                    var content = $(".feed")[0].innerHTML;
                    loadFeed(0, createTestCallback(done, content));
                });
            }
            expect(testLoadFeed).not.toThrow();
        });
    });

    describe("Udacious Test", function () {
        it("feed header changes color", function (done) {

            function testLoadFeed() {
                function createTestCallback(done, color) {
                    return function () {
                        var newColor = $('.header')[0].style.background;
                        if (color == newColor)
                            done.fail("Udacious Test: color didn't change"); // this assumes that the two tested feeds have set a different color!
                        else
                            done();
                    };
                }

                // first load Feed number 1 and then number 0 again and compare if the color changed
                loadFeed(1, function () {
                    var color = $('.header')[0].style.background;
                    loadFeed(0, createTestCallback(done, color));
                });
            }
            expect(testLoadFeed).not.toThrow();
        });
    });
}());

// code to simulate events (e.g. a click event)
// adapted from http://stackoverflow.com/questions/6157929/how-to-simulate-a-mouse-click-using-javascript
function simulate(element, eventName) {
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers) {
        if (eventMatchers[name].test(eventName)) {
            eventType = name;
            break;
        }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent) {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents') {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
                options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
                options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}

function extend(destination, source) {
    for (var property in source)
        destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
};

var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
};