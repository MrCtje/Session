import { SessionModel } from 'src/types/session';

export function countTabs(session: SessionModel) {
    return session.windows
        .map((w) => w.tabs.length)
        .reduce((accum, current) => accum + current);
}
