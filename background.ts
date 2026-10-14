chrome.runtime.onMessage.addListener(async (message) => {
  const tabs = await chrome.tabs.query({
    url: 'https://app.roll20.net/*',
  })

  for (const tab of tabs) {
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, message)
    }
  }
})
