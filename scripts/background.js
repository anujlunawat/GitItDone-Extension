let api = isChrome() ? chrome : isFirefox() ? browser : undefined;

api.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    // Allow persistent stats to sync on repo link
    api.storage.local.set({ sync_stats: true }, () => {
      console.log('Sync stats enabled.');
    });
  }
});

api.runtime.onMessage.addListener(handleMessage);

function handleMessage(request, sender, sendResponse) {
  try {
    if (request && request.closeWebPage === true && request.isSuccess === true) {
      /* Set username */
      api.storage.local.set({ gititdone_username: request.username });
      /* Set token */
      api.storage.local.set({ gititdone_token: request.token });
      /* Close pipe */
      api.storage.local.set({ pipe_gititdone: false }, () => {
        console.log('Closed pipe.');
      });
      /* Close the current tab */
      closeCurrentTab();
      /* Go to onboarding for UX */
      openOnboardingTab();
    } else if (request && request.closeWebPage === true && request.isSuccess === false) {
      alert('Something went wrong while trying to authenticate your profile!');
      closeCurrentTab();
    } else if (request.type === 'LEETCODE_SUBMISSION') {
      handleLeetCodeSubmission(request, sendResponse);
    }
  } catch (error) {
    console.error('Error in handleMessage:', error);
  }
  return true;
}

function closeCurrentTab() {
  api.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    const tab = tabs[0];
    if (tab) {
      api.tabs.remove(tab.id);
    }
  });
}

function openOnboardingTab() {
  const urlOnboarding = api.runtime.getURL('welcome.html');
  api.tabs.create({ url: urlOnboarding, active: true }); // creates new tab
}

function handleLeetCodeSubmission(request, sendResponse) {
  api.webNavigation.onHistoryStateUpdated.addListener(
    (details) => {
      console.log("details", details);
      const match = details.url.match(/\/submissions\/(\d+)\//);
      if (match) {
        const submissionId = match[1];
        console.log("submissionId", submissionId);
        sendResponse({ submissionId });
        api.webNavigation.onHistoryStateUpdated.removeListener(() => {});
      }
    },
    { url: [{ hostSuffix: 'leetcode.com' }, { pathContains: 'submissions' }] }
  );
}

function isChrome() {
  return typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined';
}

function isFirefox() {
  return typeof browser !== 'undefined' && typeof browser.runtime !== 'undefined';
}