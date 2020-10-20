import { Dexie as DexieT } from "dexie";
import { SessionModel } from "./types/session";

declare var Dexie;

export class Database {
    private db;
    private sessionTable: DexieT.Table<SessionModel, number>;

    constructor() {
        this.db = new Dexie("SessionStorage");
        this.db.version(1).stores({ session: "++id,name,date,windows" });

        this.sessionTable = this.db.table("session");
    }

    public getSessionModel(id: number): Promise<SessionModel> {
        return this.sessionTable.get(id);
    }

    public getAllSessionModels(): Promise<SessionModel[]> {
        return this.sessionTable.toArray();
    }

    public addSessionModel(session: SessionModel): Promise<number> {
        return this.sessionTable.add(session);
    }

    public addSessionsModel(sessions: SessionModel[]): Promise<number> {
        return this.sessionTable.bulkAdd(sessions);
    }

    public removeSession(session: SessionModel): Promise<void> {
        return this.sessionTable.delete(session.id);
    }

    public removeSessions(sessions: SessionModel[]): Promise<void> {
        return this.sessionTable.bulkDelete(sessions.map((s) => s.id));
    }

    public updateSession(session: SessionModel) {
        const updateModel = {...session};
        delete updateModel.id;
        return this.sessionTable.update(session.id, updateModel);
    }
}