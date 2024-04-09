chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "sendVideo",
        title: "Send video",
        contexts: ["video"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "sendVideo") {
        chrome.storage.sync.get(["token", "chat_id"], function (data) {
            if (!data.token || !data.chat_id) {
                throw new Error("Token or chat_id not found");
            }

            fetch("https://api.telegram.org/bot${data.token}/sendVideo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chat_id: data.chat_id,
                    video: info.srcUrl
                })
            })
                .then(response => {
                    if (!response.ok) {
                        chrome.notifications.create({
                            type: "basic",
                            iconUrl: "icon.png",
                            title: "Error",
                            message: "Network response was not ok",
                        })
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then(data => {
                    chrome.notifications.create({
                        type: "basic",
                        iconUrl: "icon.png",
                        title: "Success",
                        message: "Video sent successfully to chat",
                    })
                })
                .catch((error) => {
                    chrome.notifications.create({
                        type: "basic",
                        iconUrl: "icon.png",
                        title: "Error",
                        message: error.message,
                    })
                });
        });
    }
});
