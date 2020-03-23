$(function () {

    chrome.storage.sync.get(['updateTimeInMinutes'], function (result) {
        const currentDuration = result.updateTimeInMinutes;
        $('input[name="updateDuration"][value="' + currentDuration + '"]').prop('checked', true);
    });

    $("#saveOptions").click(function () {
        const confi = confirm("Are you sure you want to update the refresh duration?");

        if (!confi) return;
        const newDuratoin = $('input[name="updateDuration"]:checked').val();
        chrome.storage.sync.set({ updateTimeInMinutes: newDuratoin }, function () {
            console.log("Duration Updated!");
        });
    });
});
