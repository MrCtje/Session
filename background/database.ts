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

    public removeSession(session: SessionModel): Promise<void> {
        return this.sessionTable.delete(session.id);
    }

    public removeSessions(sessions: SessionModel[]): Promise<void> {
        return this.sessionTable.bulkDelete(sessions.map((s) => s.id));
    }

    public updateSession(session: SessionModel) {
        const updateModel = { ...session };
        delete updateModel.id;
        updateModel.windows = JSON.stringify(updateModel.windows) as any;
        return this.sessionTable.update(session.id, updateModel);
    }
}