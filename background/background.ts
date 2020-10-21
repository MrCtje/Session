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

        return { id: null, date: new Date(), name: "", windows };
    },
    storeSession: async function ({ sessionModel }) {
        return database.addSessionModel(sessionModel);
    },
    restoreSession: async function ({ sessionId }) {
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

        database.getSessionModel(sessionId)
            .then((sessionModel: SessionModel) => {
                sessionModel.windows.forEach(windowModel => {
                    const b = getBrowser();

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
                            windowModel.tabs
                                .sort((a, b) => a.index - b.index)
                                .forEach(tabModel => {
                                    const tabCreateData: Tabs.CreateCreatePropertiesType = {
                                        windowId: result.window.id,
                                        active: tabModel.active,
                                        index: tabModel.index,
                                        pinned: tabModel.pinned,
                                        url: tabModel.url,
                                    };

                                    if (tabModel.discarded) {
                                        tabCreateData.discarded = tabModel.discarded;
                                        tabCreateData.title = tabModel.title;
                                    }

                                    const b = getBrowser();
                                    if (b === "Firefox") {
                                        tabCreateData.openInReaderMode = tabModel.isInReaderMode; // firefox
                                    }

                                    browser.tabs.create(tabCreateData).catch((e) => {
                                        console.log("Failed to create tab: " + e)
                                    });
                                });

                            browser.tabs.remove(result.tabToRemove);
                        });
                });
            });
    },
    deleteSession: async function({sessionId}) {
        return database.removeSession({id: sessionId});
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


