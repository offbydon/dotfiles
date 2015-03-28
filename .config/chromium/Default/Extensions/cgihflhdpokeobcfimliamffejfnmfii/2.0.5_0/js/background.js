"use strict";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.cmd === 'download') {
    MarketSession.download(request.data.packageName, request.data.versionCode, sender.tab.id);
  }
});

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === "update") {
    chrome.tabs.create({
      url: "http://codekiem.com/apk-downloader",
      active: false
    });
  }
});