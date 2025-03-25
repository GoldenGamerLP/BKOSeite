import { Collection, CollectionInfo, ObjectId } from "mongodb";
import database from "./DBUtils";
import { Session, User } from "~/types/User";

export const sessionCookieName = "auth_session";
export const expireAfterSeconds = 60 * 60 * 24 * 7; // 1 week
const users = database.collection("users") as Collection<User>;
const sessions = database.collection("sessions") as Collection<Session>;

//Create index for session ttl
sessions.createIndex(
  { expires_at: 1 },
  {
    expireAfterSeconds: 3600,
    background: true,
    partialFilterExpression: { user_id: { $exists: true } }
  }
);

export function userNameToId(userMail: string) {
  return users.findOne({
    mail: userMail,
  });
}

export const registerLogin = async (
  user: User,
  ip: string | undefined
): Promise<Session> => {
  await setLastLogin(user._id, ip);
  return createSession(user._id, ip);
};

const setLastLogin = (userId: string, ip: string | undefined) => {
  return users.updateOne(
    { _id: userId },
    { $set: { last_login: new Date().toUTCString(), last_IP: ip } }
  );
};

export async function createUser(
  email: string,
  password: string,
  name: string,
  lastname: string
) {
  const user: User = {
    _id: new ObjectId().toHexString(),
    mail: email.toLowerCase(),
    password_hash: await hashPassword(password),
    name: name,
    lastname: lastname,
    last_login: new Date().toUTCString(),
    last_IP: "",
    roles: [],
    created_at: new Date().toUTCString(),
  };

  const response = await users.insertOne(user);
  return { insertedId: response.insertedId, user };
}

export async function invalidateSession(sessionId: string) {
  return sessions.deleteOne({ _id: sessionId });
}

function verifyHash(hashedPassword: number, password: string) {
  return cyrb53(password) === hashedPassword;
}

function hashPassword(password: string) {
  return cyrb53(password);
}

export const findSession = async (sessionId: string) => {
  return sessions.findOne({ _id: sessionId });
};

export async function getUserById(userId: string): Promise<User | null> {
  return users.findOne({ _id: userId });
}

export async function createSession(
  userIdentity: string,
  currentIp: string | undefined
) {
  // Delete any existing sessions for this user
  await sessions.deleteMany({ user_id: userIdentity });

  const session: Session = {
    _id: new ObjectId().toHexString(),
    user_id: userIdentity,
    ip: currentIp,
    expires_at: new Date(Date.now() + expireAfterSeconds * 1000),
  };

  await sessions.insertOne(session);
  return session;
}

export async function createSessionCookie(sessionId: string) {
  return {
    name: sessionCookieName,
    value: sessionId,
    attributes: {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      expires: new Date(Date.now() + expireAfterSeconds * 1000),
    },
  };
}

export const verifyPassword = async (
  mail: string,
  password: string
): Promise<User | null> => {
  const user = await users.findOne({ mail: mail.toLowerCase() });
  if (!user) return null;

  if (!verifyHash(user.password_hash, password)) return null;

  return user;
};

export function usernameToUserIdentity(mail: string) {
  return users.findOne({ mail: mail.toLowerCase() });
}

const cyrb53 = (str: string, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
