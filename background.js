chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "sendVideo",
        title: "Send video",
        contexts: ["video"]
    });
});

function notify(title, message) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: title,
        message: message
    })
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "sendVideo") {
        chrome.storage.sync.get(["token", "chat_id"], function (data) {
            console.log(data)
            if (!data.token || !data.chat_id) {
                throw new Error("Token or chat_id not found");
            }

            fetch(`https://api.telegram.org/bot${data.token}/sendVideo`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: data.chat_id,
                    video: info.srcUrl.replace(".webm", ".mp4")
                })
            })
                .then(response => {
                    if (!response.ok) {
                        notify("Error", "Network response was not ok")
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then(data => {
                    notify("Success", "Video sent successfully to chat")
                })
                .catch((error) => {
                    notify("Error", error.message)
                });
        });
    }
});
