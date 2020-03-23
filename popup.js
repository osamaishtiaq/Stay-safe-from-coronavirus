$(function () {
    $('#locationsDDL').select2();
    $('#locationsDDL').on('change', handleLocationChange)
    selectLocationInDDL();

    updateStats();

    // Setup Storage Change listener
    chrome.storage.onChanged.addListener(function (changes, storageName) {
        if (changes.hasOwnProperty('coronaLocation')) {
            selectLocationInDDL();
            setPlaceHolderStats();
        }
        else if (changes.hasOwnProperty('coronaStats')) {
            updateStats();
        }
    });
});

function setPlaceHolderStats(location) {
    const resultData = {
        deaths: 'loading...',
        activeCases: 'loading...',
        recovered: 'loading...',
        location: location
    };
    chrome.storage.sync.set({ coronaStats: resultData }, function () {
        console.log("Temporary Location Set. Updating data");
    });
}

function selectLocationInDDL() {
    var $ddl = $('#locationsDDL');

    chrome.storage.sync.get(['coronaLocation'], function (result) {
        let location = result.coronaLocation;
        $ddl.val(location);
        $ddl.trigger('change');
    });
}

function updateStats() {
    chrome.storage.sync.get(['coronaStats'], function (result) {
        let data = result.coronaStats;
        $('#deaths').text(data.deaths == "" ? 0 : data.deaths);
        $('#activeCases').text(data.activeCases == "" ? 0 : data.activeCases);
        $('#recovered').text(data.recovered == "" ? 0 : data.recovered);
        $('#location').text(data.location);

        if (data.activeCases == "loading...") {
            chrome.browserAction.setBadgeText({ "text": "..." });
            chrome.browserAction.setBadgeBackgroundColor({ "color": "green" });
        }
        else {
            chrome.browserAction.setBadgeText({ "text": data.activeCases.replace(",", "").toString() });
            chrome.browserAction.setBadgeBackgroundColor({ "color": "red" });
        }
    });
}

function handleLocationChange(ev) {
    const location = ev.target.value;
    $('#location').text(location);

    chrome.storage.sync.set({ coronaLocation: location }, function () {
        console.log('Location Updated!');
    });
}