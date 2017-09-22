browser.contextMenus.create({
    type: 'normal',
    title: browser.i18n.getMessage('emailLinkContextMenu'),
    contexts: ['link'],
    onclick: (info) => {
        const mailtoUrl = new URL('mailto:');
        mailtoUrl.searchParams.set('body', info.linkUrl);
        browser.tabs.create({url: mailtoUrl.toString(), active: false})
            .then(tab => browser.tabs.remove(tab.id));
    },
});

