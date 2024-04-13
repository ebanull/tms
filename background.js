function notify(title, message) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: title,
        message: message
    })
}


function normalize(url) {
    // 9gag.com
    if (url.includes("9gag")) {
        url = url.replace("av1", "");
    }

    // mb sdelat optionalno
    return url.replace(".webm", ".mp4");
}


chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "sendVideo",
        title: "Send video",
        contexts: ["video"]
    });
});


chrome.contextMenus.onClicked.addListener((info) => {

    chrome.storage.sync.get(null, function (items) {
        console.log(items);
    });

    if (info.menuItemId === "sendVideo") {
        chrome.storage.sync.get(["token", "chat_id"], function (data) {
            if (!data.token || !data.chat_id) {
                throw new Error("Token or chat_id not found");
            }

            fetch(`https://api.telegram.org/bot${data.token}/sendVideo`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: data.chat_id,
                    video: normalize(info.srcUrl)
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok!");
                    }
                    return response.json();
                })
                .then(() => {
                    notify("Success", "Video sent successfully to chat!")
                })
                .catch((error) => {
                    notify("Error", error.message)
                });
        });
    }
});
