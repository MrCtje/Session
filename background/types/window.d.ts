import { Windows } from "webextension-polyfill-ts";
import { TabModel } from "./tab";

type WindowModel = Pick<Windows.Window,
    "id"
    | "focused"
    | "top"
    | "left"
    | "width"
    | "height"
    | "incognito"
    | "type"
    | "state"
    | "title"
> & { tabs: TabModel[] };


