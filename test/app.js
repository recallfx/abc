casper.options.viewportSize = { width: 1200, height: 800 };

casper.test.begin('Client pages can be opened', 14, function(test) {
    casper.start('index.html', function() {
        this.click('a[href$=about]');
    });

    casper.then(function() {
        this.waitUntilVisible("#aboutPageRegion",
            function pass () {
                this.wait(100);

                test.pass('About page loaded');
                casper.capture('screenshots/about-page.png');

                test.assertExists('#aboutPageRegion a');
                test.assertVisible('#aboutPageRegion a');

                this.click('#nav-contacts');
                test.assertUrlMatch(/#$/, 'Contacts list nav');
            },
            function fail () {
                test.fail("About page did not load");
                casper.capture('screenshots/about-page-error.png');
            }
        );
    });

    casper.then(function() {
        this.waitUntilVisible("#contactsRegion",
            function pass () {
                this.wait(100);

                test.pass("Contacts list page loaded");
                casper.capture('screenshots/contacts-page.png');

                test.assertExists('#contactsRegion div');
                test.assertVisible('#contactsRegion div');

                this.click('a[href$=new]');
                test.assertUrlMatch(/#new$/, 'New contact nav');
            },
            function fail () {
                test.fail("Contacts list page did not load");
                casper.capture('screenshots/contacts-page-error.png');
            }
        );
    });

    casper.then(function() {
        this.waitUntilVisible("#contactFormRegion",
            function pass () {
                this.wait(100);

                test.pass("Contact new form page loaded");
                casper.capture('screenshots/contact-new-page.png');

                test.assertExists('#contactFormRegion div');
                test.assertVisible('#contactFormRegion div');

                test.assertSelectorHasText('#ctc-title', 'New contact');

                this.click('#ctc-save');
                test.assertUrlMatch(/#new$/, 'Still new contact nav');
                test.assertSelectorHasText('.help-block', 'Required field');
            },
            function fail () {
                test.fail("Contact new form page did not load");
                casper.capture('screenshots/contact-new-page-error.png');
            }
        );
    });

    casper.run(function() {
        test.done();
    });
});