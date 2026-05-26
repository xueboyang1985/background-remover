// AI Background Remover - Service Worker
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'remove-bg',
    title: 'Remove background with AI',
    contexts: ['image']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'remove-bg' && info.srcUrl) {
    // Open popup and pass the image URL
    chrome.action.openPopup();
    // Store the image URL for the popup to read
    chrome.storage.local.set({ pendingImageUrl: info.srcUrl });
  }
});
