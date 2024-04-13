document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form");
    const button = document.getElementById("button");
    const token = document.getElementById("token");
    const chat_id = document.getElementById("chat_id");

    if (form) {
        [token, chat_id].forEach(function (element) {
            element.addEventListener("input", function () {
                button.disabled = false;
                button.innerText = "Save";
            })
        })

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            chrome.storage.sync.set({ token: token.value, chat_id: chat_id.value }, function () {
                button.disabled = true;
                button.innerText = "Saved";
            });
        });

        // govnoi vonyaet
        chrome.storage.sync.get(["token", "chat_id"], function (data) {
            if (data.token) {
                token.value = data.token;
            }
            if (data.chat_id) {
                chat_id.value = data.chat_id;
            }
        });
    }
});
