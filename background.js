browser.contextMenus.create({
    type: 'normal',
    title: browser.i18n.getMessage('emailLinkContextMenu'),
    contexts: ['link'],
    onclick: (info) => {
        browser.tabs.create({url: `mailto:?body=${info.linkUrl}`, active: false})
            .then(tab => browser.tabs.remove(tab.id));
    },
});

