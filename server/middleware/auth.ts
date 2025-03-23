import { findSession, getUserById } from '~/server/utils/authUtils';
import { sessionCookieName } from '~/server/utils/authUtils';
import type { Session, User } from '~/types/User';

export default defineEventHandler(async (event) => {
  // Origin verification
  if (event.method !== "GET") {
    const originHeader = getHeader(event, "Origin") ?? null;
    const hostHeader = getHeader(event, "Host") ?? null;
    if (!originHeader || !hostHeader) {
      return event.node.res.writeHead(403).end();
    }
  }

  const sessionId = getCookie(event, sessionCookieName) ?? null;
  if (!sessionId) {
    event.context.session = null;
    event.context.user = null;
    return;
  }

  // Get session with roles
  const session = await findSession(sessionId);
  if (!session || session.expires_at < new Date()) {
    setCookie(event, sessionCookieName, "", { expires: new Date(0) });
    event.context.session = null;
    event.context.user = null;
    return;
  }

  // Get user data
  const user = await getUserById(session.user_id);
  if (!user) {
    setCookie(event, sessionCookieName, "", { expires: new Date(0) });
    event.context.session = null;
    event.context.user = null;
    return;
  }

  event.context.session = session;
  event.context.user = user;
});

declare module "h3" {
	interface H3EventContext {
		user: User | null;
		session: Session | null;
	}
}