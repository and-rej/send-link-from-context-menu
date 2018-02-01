'use strict';

function shareLink(data) {
    const mailtoUrl = new URL('mailto:');
    if (data.url && data.text) {
        mailtoUrl.searchParams.set('body', `${data.url}\n${data.text}`);
    } else {
        mailtoUrl.searchParams.set('body', data.url);
    }

    let mailtoString = mailtoUrl.toString();
    if (data.subject) {
        mailtoString += `&subject=${encodeURIComponent(data.subject)}`;
    }

    browser.tabs.getCurrent().then(
        tab => browser.tabs.update({url: mailtoString})
    );
}

async function addContextMenus(browserInfo) {
    browser.contextMenus.create({
        type: 'normal',
        title: browser.i18n.getMessage('emailLinkContextMenu'),
        contexts: ['link'],
        onclick: (info) => shareLink({url: info.linkUrl}),
    });

    const pageLinkContexts = ['page', 'selection'];
    if (browserInfo && browserInfo.vendor === 'Mozilla') {
        pageLinkContexts.push('tab');
    }

    browser.contextMenus.create({
        type: 'normal',
        title: browser.i18n.getMessage('emailPageLinkContextMenu'),
        contexts: pageLinkContexts,
        onclick: async (info) => {
            const data = {};
            data.url = info.pageUrl;
            data.text = info.selectionText;

            const tabs = await browser.tabs.query({url: data.url});
            if (tabs.length > 0) {
                data.subject = tabs[0].title;
            }

            shareLink(data);
        },
    });

    browser.contextMenus.create({
        type: 'normal',
        title: browser.i18n.getMessage('emailFrameLinkContextMenu'),
        contexts: ['frame'],
        onclick: (info) => shareLink({url: info.frameUrl}),
    });

    browser.contextMenus.create({
        type: 'normal',
        title: browser.i18n.getMessage('emailImageLinkContextMenu'),
        contexts: ['image'],
        onclick: (info) => shareLink({url: info.srcUrl}),
    });

    browser.contextMenus.create({
        type: 'normal',
        title: browser.i18n.getMessage('emailAudioLinkContextMenu'),
        contexts: ['audio'],
        onclick: (info) => shareLink({url: info.srcUrl}),
    });

    browser.contextMenus.create({
        type: 'normal',
        title: browser.i18n.getMessage('emailVideoLinkContextMenu'),
        contexts: ['video'],
        onclick: (info) => shareLink({url: info.srcUrl}),
    });
}

async function addPageAction() {
    browser.tabs.query({}).then((tabs) =>
        tabs.forEach((tab) => chrome.pageAction.show(tab.id))
    );
    browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
        if (changeInfo.status === 'complete') {
            chrome.pageAction.show(tabId);
        }
    });
    browser.pageAction.onClicked.addListener((tab) =>
        shareLink({url: tab.url, subject: tab.title})
    );
}

(async function init() {
    let browserInfo;
    if (browser.runtime.getBrowserInfo) {
        browserInfo = await browser.runtime.getBrowserInfo();
    }
    addContextMenus(browserInfo);
    addPageAction();
})();
