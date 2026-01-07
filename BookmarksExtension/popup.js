const BACKEND_URL = "http://localhost:3000/capture";

document.getElementById("capturePage").addEventListener("click", () => {
  capture("page");
});

document.getElementById("captureSelection").addEventListener("click", () => {
  capture("selection");
});

function capture(type) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    if (!tab || !tab.id) {
      setStatus("No active tab", true);
      return;
    }

    if (
      tab.url.startsWith("chrome://") ||
      tab.url.startsWith("chrome-extension://")
    ) {
      setStatus("This page cannot be captured", true);
      return;
    }

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ["content.js"]
      },
      () => {
        chrome.tabs.sendMessage(
          tab.id,
          { action: "CAPTURE", captureType: type },
          (response) => {
            if (chrome.runtime.lastError) {
              console.warn(chrome.runtime.lastError.message);
              setStatus("Capture failed", true);
              return;
            }

            if (!response) {
              setStatus("No content received", true);
              return;
            }

            // 🔑 GET TOKEN HERE (CORRECT PLACE)
            chrome.storage.local.get("memory_token", async (res) => {
              const token = res.memory_token;

              if (!token) {
                setStatus("Please login on website first", true);
                return;
              }

              try {
                await fetch(BACKEND_URL, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                  },
                  body: JSON.stringify(response)
                });

                setStatus("Saved successfully!");
              } catch (err) {
                console.error(err);
                setStatus("Backend not running", true);
              }
            });
          }
        );
      }
    );
  });
}

function setStatus(msg, isError = false) {
  const el = document.getElementById("status");
  el.textContent = msg;
  el.style.color = isError ? "red" : "green";
}
