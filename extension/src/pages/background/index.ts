chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  if (request.action === 'getStorage') {
    chrome.storage.local.get([request.key], function (result) {
      sendResponse(result[request.key]);
    });
  }
  return true;
});

console.log('background loaded');
