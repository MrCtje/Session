import { WindowModel } from "./window";

interface SessionModel {
    id: number;
    name: string;
    type: "Backup" | "Saved";
    date: Date;
    windows: WindowModel[];
}
