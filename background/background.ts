import { browser, Tabs, Windows } from "webextension-polyfill-ts";
import { Database } from "./database";
import { SessionModel } from "./types/session";
import { TabModel } from "./types/tab";
import { WindowModel } from "./types/window";

const database = new Database();

const api = {
    setCookie: async function ({ url, key, value, storeId }) {
        browser.cookies.set({ url: url, name: key, value: value.toString(), storeId: storeId.toString() });
    },
    getCookie: async function ({ details }) {
        return browser.cookies.get(details);
    },
    getContextStoreId: async function ({ }, { tab }): Promise<string> {
        return browser.cookies.getAllCookieStores().then((stores) => {
            const res = stores.find(store => store.tabIds.indexOf(tab?.id) > -1);
            return res?.id as string;
        });
    },
    updateTab: async function ({ tabProps }, { tab }) {
        browser.tabs.update(tab.id, tabProps);
    },
    getAllWindows: async function (): Promise<Windows.Window[]> {
        return browser.windows.getAll({ populate: true });
    },
    getAllSessions: async function(): Promise<SessionModel[]> {
        return database.getAllSessionModels()
    },
    getCurrentSession: async function(): Promise<SessionModel> {
        const windows = (await api.getAllWindows()).map((realWindow) => {
            const windowModel: WindowModel = {} as WindowModel;
            windowModel.focused = realWindow.focused;
            windowModel.height = realWindow.height;
            windowModel.id = realWindow.id;
            windowModel.incognito = realWindow.incognito;
            windowModel.left = realWindow.left;
            windowModel.state = realWindow.state;
            windowModel.tabs = realWindow.tabs.map((realTab) => {
                const tabModel: TabModel = {} as TabModel;
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
        
        return {id: null, date: new Date(), name: "", windows };
    },
    storeSession: async function ({ sessionModel }) {
        return database.addSessionModel(sessionModel);
    },
    restoreSession: async function ({ sessionId }) {
        database.getSessionModel(sessionId)
            .then((sessionModel: SessionModel) => {
                sessionModel.windows.forEach(windowModel => {
                    browser.windows.create({
                        left: windowModel.left,
                        top: windowModel.top,
                        width: windowModel.width,
                        height: windowModel.height,
                        incognito: windowModel.incognito,
                        type: windowModel.type as Windows.CreateType,
                        state: windowModel.state,
                        focused: windowModel.focused
                    }).then(window => {
                        windowModel.tabs
                            .sort((a, b) => a.index - b.index)
                            .forEach(tabModel => {
                                browser.tabs.create({
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

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (!request.func) {
        sendResponse({ error: "API Error: No function name passed." });
        return;
    }

    const func = api[request.func];
    if (func) {
        delete request.func;
        func.apply(null, [request, sender]).then(d =>
            sendResponse(d)
        );
    } else {
        sendResponse({ error: "API Error: No such function exists: " + request.func });
        return;
    }
    return true;
} as any);


