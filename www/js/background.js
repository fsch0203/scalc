chrome.action.onClicked.addListener(function(tab) {
    chrome.windows.create({
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      left: 500,
      top: 50,
      width: 640,
      height: 610
    }, function(win) {
      // win represents the Window object from windows API
      // Do something after opening
    });
  });
