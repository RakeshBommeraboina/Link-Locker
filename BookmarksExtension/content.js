console.log("✅ content.js injected on:", location.href);
console.log("✅ content.js is running on:", location.href);

window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (event.data.type === "MEMORY_AUTH_TOKEN") {
    chrome.runtime.sendMessage({
      type: "SET_TOKEN",
      token: event.data.token
    });
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action !== "CAPTURE") return;

  if (msg.captureType === "page") {
    const text = document.body.innerText
      .replace(/\s+/g, " ")
      .slice(0, 5000);

    sendResponse({
      type: "page",
      url: location.href,
      title: document.title,
      html: document.documentElement.outerHTML.slice(0, 200000),
      content: text,
      selectedText: window.getSelection().toString(),
      timestamp: Date.now()
    });
  }

  if (msg.captureType === "selection") {
    sendResponse({
      type: "selection",
      url: location.href,
      title: document.title,
      selectedText: window.getSelection().toString(),
      timestamp: Date.now()
    });
  }
});
