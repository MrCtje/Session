import { Injectable } from "@angular/core";
import { SessionModel } from 'src/types/session';
import { browser } from 'webextension-polyfill-ts';
import { WindowModel } from 'src/types/window';

@Injectable({providedIn: "root"})
export class SessionController {
    saveSession(session: SessionModel): Promise<number> {
        return browser.runtime.sendMessage({ func: "storeSession", sessionModel: session});
    }

    getAllSessions() {
        return browser.runtime.sendMessage({ func: "getAllSessions" });
    }

    getCurrentSession() {
        return browser.runtime.sendMessage({ func: "getCurrentSession" })
    }

    restoreSession(id: number) {
        return browser.runtime.sendMessage({ func: "restoreSession", sessionId: id });
    }

    restoreWindow(id: number, windowId: number) {
        return browser.runtime.sendMessage({ func: "restoreWindow", sessionId: id, windowId });
    }

    restoreWindowWith(id: number, windowId: number, propertyChanges: Partial<WindowModel>) {
        return browser.runtime.sendMessage({ func: "restoreWindowWith", sessionId: id, windowId, propertyChanges });
    }

    updateWindow(id: number, windowId: number, propertyChanges: Partial<WindowModel>) {
        return browser.runtime.sendMessage({ func: "updateWindow", sessionId: id, windowId, propertyChanges });
    }

    focusWindow(windowId: number) {
        return browser.runtime.sendMessage({ func: "focusWindow", windowId });
    }

    deleteSession(id: number) {
        return browser.runtime.sendMessage({ func: "deleteSession", sessionId: id });
    }

    deleteTab(sessionId: number, windowId: number, tabId: number) {
        return browser.runtime.sendMessage({ func: "deleteTab", sessionId, windowId, tabId });
    }

    updateSession(session: Partial<SessionModel> & Pick<SessionModel, "id">) {
        return browser.runtime.sendMessage({ func: "updateSession", sessionModel: session });
    }
}
