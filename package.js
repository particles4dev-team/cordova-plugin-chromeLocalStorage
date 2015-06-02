Package.describe({
    summary: "Use the chrome.storage API to store, retrieve, and track changes to user data",
    version: "1.0.0",
    name: "particle4dev:chrome-local-storage",
    git: "https://github.com/particles4dev-team/cordova-plugin-chromeLocalStorage"
});

// meteor test-packages ./
var both        = ['client', 'server'];
var client      = ['client'];
var server      = ['server'];
var cordova     = ['web.cordova'];
var browser     = ['web.browser'];
Cordova.depends({
    'org.chromium.storage':'1.0.3'
});

// Npm.depends({
    //'debug': '0.7.3', // DEBUG
// });

// Package.registerBuildPlugin({
//     name: 'configuration',
//     use: [
//         'check'
//     ],
//     sources: [
//         'plugin/push.configuration.js'
//     ]
// });

Package.on_use(function(api) {
    api.versionsFrom('1.0');

    // import packages
    api.use(['underscore'], both);
    api.use('particle4dev:rsvpjs@3.0.18', 'client');
    

    // add files
    api.addFiles('lib/chromeLocalStorage.js', 'web.cordova');
    if (typeof api.export !== 'undefined') {
        api.export('CHROME_LOCAL_STORAGE', 'web.cordova');
    }
});

Package.on_test(function (api) {
    api.use(['test-helpers', 'tinytest', 'particle4dev:chrome-local-storage']);

    // api.add_files([
    //     'tests/test.js',
    // ], client);
});
