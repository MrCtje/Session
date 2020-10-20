import { WindowModel } from "./window";

interface SessionModel {
    id: number;
    name: string;
    date: Date;
    windows: WindowModel[];
}