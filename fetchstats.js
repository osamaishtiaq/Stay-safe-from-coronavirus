const fetchStats = {
    Url: 'https://www.worldometers.info/coronavirus/',
    FetchInfo: function () {
        chrome.storage.sync.get(['coronaLocation'], function (result) {
            let location = result.coronaLocation;

            $.get(fetchStats.Url, (response) => {
                const resultData = fetchStats.parseHtml(response, location);

                // set data to sync storage
                chrome.storage.sync.set({ coronaStats: resultData }, function () {
                    console.log("Stats Updated.");
                });
            });
        });
    },
    parseHtml: function (html, location) {
        const resultData = {
            deaths: 'loading...',
            activeCases: 'loading...',
            recovered: 'loading...',
            location: 'loading...'
        };

        if (location == "Default") {

            resultData.activeCases = $($(html).find('div.maincounter-number')[0]).text().trim();
            resultData.deaths = $($(html).find('div.maincounter-number')[1]).text().trim();
            resultData.recovered = $($(html).find('div.maincounter-number')[2]).text().trim();
            resultData.location = "Global";

        }
        else {
            const tableRows = $(html).find('tr:contains(' + location + ')').first().text().trim().split('\n');

            resultData.activeCases = tableRows[8].replace(/\s/g, '');
            resultData.deaths = tableRows[3].replace(/\s/g, '');
            resultData.recovered = tableRows[6].replace(/\s/g, '');
            resultData.location = location;
        }

        return resultData;

    },
    MinutestoMilliseconds: function (minutes) {
        return minutes * 60 * 1000;
    }
};