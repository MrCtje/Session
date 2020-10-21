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
}