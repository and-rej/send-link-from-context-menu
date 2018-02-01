'use strict';

function shareLink(url, title) {
    const mailtoUrl = new URL('mailto:');
    mailtoUrl.searchParams.set('body', url);
    let mailtoString = mailtoUrl.toString();

    if (title) {
        mailtoString += `&subject=${title.split(' ').join('%20')}`;
    }
    browser.tabs.getCurrent().then(
        tab => browser.tabs.update({url: mailtoString})
    );
}

browser.contextMenus.create({
    type: 'normal',
    title: browser.i18n.getMessage('emailLinkContextMenu'),
    contexts: ['link'],
    onclick: (info) => shareLink(info.linkUrl),
});

browser.contextMenus.create({
    type: 'normal',
    title: browser.i18n.getMessage('emailPageLinkContextMenu'),
    contexts: ['page', 'tab'],
    onclick: async (info) => {
        const url = info.pageUrl;
        const tabs = await browser.tabs.query({url: url});
        if (tabs.length > 0) {
            shareLink(url, tabs[0].title);
        } else {
            shareLink(url);
        }
    },
});

browser.contextMenus.create({
    type: 'normal',
    title: browser.i18n.getMessage('emailFrameLinkContextMenu'),
    contexts: ['frame'],
    onclick: (info) => shareLink(info.frameUrl),
});

browser.contextMenus.create({
    type: 'normal',
    title: browser.i18n.getMessage('emailImageLinkContextMenu'),
    contexts: ['image'],
    onclick: (info) => shareLink(info.srcUrl),
});

browser.contextMenus.create({
    type: 'normal',
    title: browser.i18n.getMessage('emailAudioLinkContextMenu'),
    contexts: ['audio'],
    onclick: (info) => shareLink(info.srcUrl),
});

browser.contextMenus.create({
    type: 'normal',
    title: browser.i18n.getMessage('emailVideoLinkContextMenu'),
    contexts: ['video'],
    onclick: (info) => shareLink(info.srcUrl),
});
