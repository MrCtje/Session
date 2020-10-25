import { browser, Tabs, Windows } from "webextension-polyfill-ts";
import { Database } from "./database";
import { SessionModel } from "./types/session";
import { TabModel } from "./types/tab";
import { WindowModel } from "./types/window";

const database = new Database();

declare var getBrowser: () => "Firefox" | "Chrome" | "Edge";

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
    getAllSessions: async function (): Promise<SessionModel[]> {
        return database.getAllSessionModels()
    },
    getCurrentSession: async function (): Promise<SessionModel> {
        const windows = (await api.getAllWindows())
            .filter(w => !w.tabs.every(t => t.url.startsWith("about:") && t.url !== "about:newtab"))
            .map((realWindow) => {
                const windowModel: WindowModel = {} as WindowModel;
                windowModel.focused = realWindow.focused;
                windowModel.height = realWindow.height;
                windowModel.id = realWindow.id;
                windowModel.incognito = realWindow.incognito;
                windowModel.left = realWindow.left;
                windowModel.state = realWindow.state;
                windowModel.tabs = realWindow.tabs
                    .filter(x => !x.url.startsWith("about:") || x.url === "about:newtab")
                    .map((realTab) => {
                        const tabModel: TabModel = {} as TabModel;
                        tabModel.id = realTab.id;
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

        return { id: null, date: new Date(), name: "", windows } as SessionModel;
    },
    storeSession: async function ({ sessionModel }) {
        return database.addSessionModel(sessionModel);
    },
    updateSession: async function ({ sessionModel }) {
        return database.updateSession(sessionModel);
    },
    restoreSession: async function ({ sessionId }) {
        return database.getSessionModel(sessionId)
            .then((sessionModel: SessionModel) => {
                sessionModel.windows.forEach(restoreWindow);
            });
    },
    restoreWindow: async function ({ sessionId, windowId }) {
        return database.getSessionModel(sessionId)
            .then((sessionModel: SessionModel) => {
                const windowModel = sessionModel.windows.find(w => w.id === windowId);
                restoreWindow(windowModel);
            });
    },
    restoreWindowWith: async function ({ sessionId, windowId, propertyChanges }) {
        return database.getSessionModel(sessionId)
            .then((sessionModel: SessionModel) => {
                const windowModel = sessionModel.windows.find(w => w.id === windowId);
                Object.getOwnPropertyNames(propertyChanges).forEach(p => windowModel[p] = propertyChanges[p]);
                restoreWindow(windowModel);
            });
    },
    updateWindow: async function ({ sessionId, windowId, propertyChanges }) {
        return database.getSessionModel(sessionId)
            .then((sessionModel: SessionModel) => {
                const windowModel = sessionModel.windows.find(w => w.id === windowId);
                Object.getOwnPropertyNames(propertyChanges).forEach(p => windowModel[p] = propertyChanges[p]);
                return api.updateSession({sessionModel});
            });
    },
    focusWindow: async function ({ windowId }) {
        return browser.windows.update(windowId, { focused: true });
    },
    deleteSession: async function ({ sessionId }) {
        return database.removeSession(sessionId);
    },
    deleteTab: async function ({ sessionId, windowId, tabId }) {
        return database.removeTab(sessionId, windowId, tabId);
    }
};

function restoreWindow(windowModel) {
    const b = getBrowser();
    const dimensionIfInCorrectState = (state: Windows.WindowState, v: number) => {
        switch (state) {
            case "fullscreen":
            case "minimized":
            case "maximized":
                return undefined;
            default:
                return v;
        }
    };
    const windowCreateData: Windows.CreateCreateDataType = {
        left: dimensionIfInCorrectState(windowModel.state, windowModel.left),
        top: dimensionIfInCorrectState(windowModel.state, windowModel.top),
        width: dimensionIfInCorrectState(windowModel.state, windowModel.width),
        height: dimensionIfInCorrectState(windowModel.state, windowModel.height),
        incognito: windowModel.incognito,
        type: windowModel.type as Windows.CreateType,
    };

    if (b === "Chrome") {
        windowCreateData.focused = windowModel.focused;
    } else if (b === "Firefox") {
        windowCreateData.state = windowModel.state;
    }

    browser.windows.create(windowCreateData)
        .then(window => ({ window: window, tabToRemove: window.tabs[0].id }))
        .then((result) => {

            const restoredPromise = windowModel.tabs
                .sort((a, b) => a.index - b.index)
                .map(tabModel => {
                    const tabCreateData: Tabs.CreateCreatePropertiesType = {
                        windowId: result.window.id,
                        active: tabModel.active,
                        index: tabModel.index,
                        pinned: tabModel.pinned,
                        url: tabModel.url,
                    };

                    const b = getBrowser();
                    if (b === "Firefox") {
                        tabCreateData.openInReaderMode = tabModel.isInReaderMode; // firefox

                        if (tabModel.discarded) {
                            tabCreateData.discarded = tabModel.discarded;
                            tabCreateData.title = tabModel.title;
                        }
                    }

                    if (tabCreateData.url.startsWith('chrome-extension://')) {
                        const tCopy = { ...tabCreateData };
                        tCopy.url = null;
                        return browser.tabs.create(tCopy).then(realTab => {
                            return browser.tabs.update(realTab.id, { url: tabCreateData.url });
                        });
                    }

                    return browser.tabs.create(tabCreateData).catch((e) => {
                        console.log("Failed to create tab: " + e)
                    });
                });

            Promise.all(restoredPromise)
                .then(() => browser.tabs.remove(result.tabToRemove));
        });
}

browser.runtime.onMessage.addListener(function (request, sender) {
    if (!request.func) {
        return new Promise((_, rej) => rej("API Error: No function name passed."));
    }

    const func = api[request.func];
    if (func) {
        delete request.func;
        return func.apply(null, [request, sender]);
    } else {
        return new Promise((_, rej) => rej("API Error: No such function exists: " + request.func));
    }
    // return true;
});

setInterval(() => {
    api.getCurrentSession().then((cs) => {
        database.addSessionBackupModel(cs);
    });
},
    1000 * 60 * 3
);


