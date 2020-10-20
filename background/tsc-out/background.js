"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webextension_polyfill_ts_1 = require("webextension-polyfill-ts");
const database_1 = require("./database");
const database = new database_1.Database();
const api = {
    setCookie: async function ({ url, key, value, storeId }) {
        webextension_polyfill_ts_1.browser.cookies.set({ url: url, name: key, value: value.toString(), storeId: storeId.toString() });
    },
    getCookie: async function ({ details }) {
        return webextension_polyfill_ts_1.browser.cookies.get(details);
    },
    getContextStoreId: async function ({}, { tab }) {
        return webextension_polyfill_ts_1.browser.cookies.getAllCookieStores().then((stores) => {
            const res = stores.find(store => store.tabIds.indexOf(tab?.id) > -1);
            return res?.id;
        });
    },
    updateTab: async function ({ tabProps }, { tab }) {
        webextension_polyfill_ts_1.browser.tabs.update(tab.id, tabProps);
    },
    getAllWindows: async function () {
        return webextension_polyfill_ts_1.browser.windows.getAll({ populate: true });
    },
    getAllSessions: async function () {
        return database.getAllSessionModels();
    },
    getCurrentSession: async function () {
        const windows = (await api.getAllWindows()).map((realWindow) => {
            const windowModel = {};
            windowModel.focused = realWindow.focused;
            windowModel.height = realWindow.height;
            windowModel.id = realWindow.id;
            windowModel.incognito = realWindow.incognito;
            windowModel.left = realWindow.left;
            windowModel.state = realWindow.state;
            windowModel.tabs = realWindow.tabs.map((realTab) => {
                const tabModel = {};
                tabModel.active = realTab.active;
                tabModel.discarded = realTab.discarded;
                tabModel.index = realTab.index;
                tabModel.isInReaderMode = realTab.isInReaderMode;
                tabModel.pinned = realTab.pinned;
                tabModel.title = realTab.title;
                tabModel.url = realTab.url;
                tabModel.windowId = realTab.windowId;
                tabModel.favIconUrl = realTab.favIconUrl;
                return tabModel;
            });
            windowModel.title = realWindow.title;
            windowModel.top = realWindow.top;
            windowModel.type = realWindow.type;
            windowModel.width = realWindow.width;
            return windowModel;
        });
        return { id: null, date: new Date(), name: "", windows };
    },
    storeSession: async function ({ sessionModel }) {
        database.addSessionModel(JSON.parse(sessionModel));
    },
    restoreSession: async function ({ sessionId }) {
        database.getSessionModel(sessionId)
            .then((sessionModel) => {
            sessionModel.windows.forEach(windowModel => {
                webextension_polyfill_ts_1.browser.windows.create({
                    left: windowModel.left,
                    top: windowModel.top,
                    width: windowModel.width,
                    height: windowModel.height,
                    incognito: windowModel.incognito,
                    type: windowModel.type,
                    state: windowModel.state,
                    focused: windowModel.focused
                }).then(window => {
                    windowModel.tabs
                        .sort((a, b) => a.index - b.index)
                        .forEach(tabModel => {
                        webextension_polyfill_ts_1.browser.tabs.create({
                            windowId: window.id,
                            active: tabModel.active,
                            discarded: tabModel.discarded,
                            index: tabModel.index,
                            openInReaderMode: tabModel.isInReaderMode,
                            pinned: tabModel.pinned,
                            url: tabModel.url,
                            title: tabModel.title
                        });
                    });
                });
            });
        });
    }
};
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (!request.func) {
        sendResponse({ error: "API Error: No function name passed." });
        return;
    }
    const func = api[request.func];
    if (func) {
        delete request.func;
        func.apply(null, [request, sender]).then(d => sendResponse(d));
    }
    else {
        sendResponse({ error: "API Error: No such function exists: " + request.func });
        return;
    }
    return true;
});
//# sourceMappingURL=background.js.map