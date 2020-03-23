chrome.runtime.onInstalled.addListener(function () {

  chrome.storage.sync.set({ coronaLocation: 'Default' }, function () {
    console.log("Extention is installed. Current location is set to 'Default'");
  });

  chrome.storage.sync.set({ updateTimeInMinutes: 1 }, function () {
    console.log("Extention is installed. updateTimeInMinutes is set to 1");
  });

  SetupInterval();

  chrome.storage.onChanged.addListener(function (changes, storageName) {
    if (changes.hasOwnProperty('coronaLocation')) {
        fetchStats.FetchInfo();
    }
  });
});

// Get Duration Time and run in that duration
function SetupInterval() {
  chrome.storage.sync.get(['updateTimeInMinutes'], function (result) {

    // Run the first time
    fetchStats.FetchInfo();

    let duration = fetchStats.MinutestoMilliseconds(result.updateTimeInMinutes);
    const interValId = setInterval(() => {
      // Fetch data
      fetchStats.FetchInfo();

      // Check New Duration if it is diffrent then destroy this interval and use the new one
      chrome.storage.sync.get(['updateTimeInMinutes'], function (result2) {

        let newDuration = fetchStats.MinutestoMilliseconds(result2.updateTimeInMinutes);

        if (newDuration != duration) {
          chrome.storage.sync.get(['fetchIntervalId'], function(intervalResp) {
            clearInterval(intervalResp.fetchIntervalId);
            SetupInterval();
            return;
          });
        }

      });
    }, duration);

    // Set Interval Id
    chrome.storage.sync.set({ fetchIntervalId: interValId }, () => console.log("Interval Id Set to " + interValId));
  });
}