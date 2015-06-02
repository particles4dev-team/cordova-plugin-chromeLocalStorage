/**
 * exports
 */
// https://developer.chrome.com/extensions/storage
// http://taoofcode.net/promise-anti-patterns/
// http://taoofcode.net/promise-anti-patterns/
// http://stackoverflow.com/questions/20100245/how-can-i-execute-array-of-promises-in-sequential-order
// https://github.com/tildeio/rsvp.js/blob/master/test/extension-test.js
CHROME_LOCAL_STORAGE = {};
(function(){
    var self = this;
    var isLocalStorageReady = false;
    var ready = new ReactiveVar(false);
    /**
     * 
     * @param {String} key
     * @return {Any}
     */
    self.get = function(key){
        var promise = new RSVP.Promise(function(resolve, reject) {
            if(!self.isReady(true))
                reject(new Error('chrome.storage.local is not ready yet'));
            chrome.storage.local.get(key, function(obj) {
                if(_.isObject(obj))
                    resolve(obj[key]);
                // https://github.com/MobileChromeApps/cordova-plugin-chrome-apps-storage/blob/master/storage.js#L90
                else
                    reject(new Error('there was an error when trying get value'));
            });
        });
        return promise;
    };
    /**
     * 
     * @param {String} key
     * @param {Any} value
     * @return {Boolean}
     */
    self.set = function(key, value){
        var obj = {};
        obj[key] = value;
        var promise = new RSVP.Promise(function(resolve, reject) {
            if(!self.isReady(true))
                reject(new Error('chrome.storage.local is not ready yet'));
            chrome.storage.local.set(obj, function(err) {
                if(err == 0)
                    resolve(true);
                // https://github.com/MobileChromeApps/cordova-plugin-chrome-apps-storage/blob/master/storage.js#L121
                else
                    reject(err);
            });
        });
        return promise;
    };
    /**
     * 
     * @param {Boolean} nonReactive
     * @return {Boolean}
     */
    self.isReady = function(nonReactive){
        if(!nonReactive)
            return ready.get();
        return isLocalStorageReady;
    };
    /**
     *
     * @param 
     * @return 
     */
    self.clearAll = function () {
        var promise = new RSVP.Promise(function(resolve, reject) {
            if(!self.isReady(true))
                reject(new Error('chrome.storage.local is not ready yet'));
            chrome.storage.local.clear(function(err) {
                if(err == 0)
                    resolve(true);
                // https://github.com/MobileChromeApps/cordova-plugin-chrome-apps-storage/blob/master/storage.js#L121
                else
                    reject(err);
            });
        });
        return promise;
    };
    /**
     * 
     * @param {String} key
     * @return {Boolean}
     */
    self.remove = function(key) {
        var promise = new RSVP.Promise(function(resolve, reject) {
            if(!self.isReady(true))
                reject(new Error('chrome.storage.local is not ready yet'));
            chrome.storage.local.remove(key, function(err) {
                if(err == 0)
                    resolve(true);
                else
                    reject(new Error('there was an error when trying remove value'));
            });
        });
        return promise;
    };
    /**
     * startup
     */
    Meteor.startup(function(){
        if(!chrome || !chrome.storage || !chrome.storage.local) {
            console.error('not found chrome.storage.local');
            return;
        }
        ready.set(true);
        isLocalStorageReady = true;
        chrome.storage.onChanged.addListener(function(changes, namespace) {
            for (key in changes) {
                var storageChange = changes[key];
                console.log('Storage key "%s" in namespace "%s" changed. ' +
                        'Old value was "%s", new value is "%s".',
                        key,
                        namespace,
                        storageChange.oldValue,
                        storageChange.newValue);
            }
        });
    });
}).apply(CHROME_LOCAL_STORAGE);