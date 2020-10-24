import Dexie from "dexie";
import { SessionModel } from "./types/session";

export class Database {
    private db: Dexie;
    private sessionTable: Dexie.Table<SessionModel, number>;

    constructor() {
        this.db = new Dexie("SessionStorage");
        this.db.version(1).stores({ session: "++id,name,type,date" });

        this.sessionTable = this.db.table("session");
    }

    public getSessionModel(id: number): Promise<SessionModel> {
        return this.sessionTable.get(id).then((session) => {
            session.windows = JSON.parse(session.windows as any);
            return session;
        });
    }

    public getAllSessionModels(): Promise<SessionModel[]> {
        return this.sessionTable.toArray()
            .then((sessionList) => {
                sessionList.forEach(s => s.windows = JSON.parse(s.windows as any));
                return sessionList;
            });
    }

    public async addSessionBackupModel(session: SessionModel): Promise<number> {
        session.type = "Backup";
        const addModel = { ...session };
        delete addModel.id;
        addModel.windows = JSON.stringify(addModel.windows) as any;

        return this.db.transaction("rw", this.sessionTable, async (tx) => {
            const count = await this.sessionTable
                .where({ type: session.type })
                .count();

            if (count >= 5) {
                const sortedTable = await this.sessionTable
                    .where({ type: session.type })
                    .reverse()
                    .sortBy("id");

                this.removeSessions(sortedTable.slice(4, sortedTable.length));
            }

            return this.sessionTable.add(addModel);
        });
    }

    public addSessionModel(session: SessionModel): Promise<number> {
        const addModel = { ...session };
        delete addModel.id;
        addModel.windows = JSON.stringify(addModel.windows) as any;
        return this.sessionTable.add(addModel);
    }

    public addSessionsModel(sessions: SessionModel[]): Promise<number> {
        const addModels = JSON.parse(JSON.stringify(sessions)) as SessionModel[];
        addModels.forEach(addModel => {
            addModel.windows = JSON.stringify(addModel.windows) as any;
        });
        return this.sessionTable.bulkAdd(addModels);
    }

    public removeSession(id: number): Promise<void> {
        return this.sessionTable.delete(id);
    }

    public removeTab(sessionId: number, windowId: number, tabId: number): Promise<void> {
        return this.db.transaction("rw", this.sessionTable, async () => {
            const sessionModel = await this.getSessionModel(sessionId);
            const window = sessionModel.windows.find(x => x.id === windowId);
            if (!window)
                return null;

            window.tabs = window.tabs.filter(t => t.id !== tabId);

            return this.updateSession(sessionModel) as any;
        });
    }

    public removeSessions(sessions: SessionModel[]): Promise<void> {
        return this.sessionTable.bulkDelete(sessions.map((s) => s.id));
    }

    public updateSession(session: SessionModel): Promise<number> {
        const updateModel = { ...session };
        delete updateModel.id;
        if (updateModel.windows) {
            updateModel.windows = JSON.stringify(updateModel.windows) as any;
        }
        return this.sessionTable.update(session.id, updateModel);
    }
}