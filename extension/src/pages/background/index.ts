import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';

reloadOnUpdate('pages/background');
chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  if (request.action === 'getStorage') {
    chrome.storage.local.get([request.key], function (result) {
      sendResponse(result[request.key]);
    });
  }
  return true;
});
/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');

console.log('background loaded');
