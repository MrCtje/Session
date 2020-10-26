import { SessionModel } from 'src/types/session';

export function countTabs(session: SessionModel) {
    const tabCounts = session.windows
        .map((w) => w.tabs.length);
    return tabCounts.length > 0 ? tabCounts
        .reduce((accum, current) => accum + current) : 0;
}
