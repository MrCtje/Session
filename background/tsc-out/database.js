"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Database {
    constructor() {
        this.db = new Dexie("SessionStorage");
        this.db.version(1).stores({ session: "++id,name,date,windows" });
        this.sessionTable = this.db.table("session");
    }
    getSessionModel(id) {
        return this.sessionTable.get(id);
    }
    getAllSessionModels() {
        return this.sessionTable.toArray();
    }
    addSessionModel(session) {
        return this.sessionTable.add(session);
    }
    addSessionsModel(sessions) {
        return this.sessionTable.bulkAdd(sessions);
    }
    removeSession(session) {
        return this.sessionTable.delete(session.id);
    }
    removeSessions(sessions) {
        return this.sessionTable.bulkDelete(sessions.map((s) => s.id));
    }
    updateSession(session) {
        const updateModel = { ...session };
        delete updateModel.id;
        return this.sessionTable.update(session.id, updateModel);
    }
}
exports.Database = Database;
//# sourceMappingURL=database.js.map