import { Injectable } from "@angular/core";
import { SessionModel } from 'src/types/session';
import { browser } from 'webextension-polyfill-ts';
import { promise } from 'protractor';

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

    focusWindow(windowId: number) {
        return browser.runtime.sendMessage({ func: "focusWindow", windowId });
    }

    deleteSession(id: number) {
        return browser.runtime.sendMessage({ func: "deleteSession", sessionId: id });
    }

    updateSession(session: Partial<SessionModel> & Pick<SessionModel, "id">) {
        return browser.runtime.sendMessage({ func: "updateSession", sessionModel: session });
    }
}
