chrome.runtime.onInstalled.addListener(() => {
  console.log("Memory Capture extension installed");
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "SET_TOKEN") {
    chrome.storage.local.set({ memory_token: msg.token }, () => {
      console.log("✅ Token saved in extension");
      sendResponse({ success: true });
    });
    return true; // IMPORTANT
  }
});
