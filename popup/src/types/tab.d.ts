import { Tabs } from "webextension-polyfill-ts";

type TabModel = Pick<Tabs.Tab,
    "index"
    | "windowId"
    | "url"
    | "active"
    | "pinned"
    | "discarded"
    | "title"
    | "isInReaderMode"
    | "favIconUrl"
>
