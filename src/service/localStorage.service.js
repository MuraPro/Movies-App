const SESSION_ID = 'sessionId';

export function setSessionId(sessionId) {
  localStorage.setItem(SESSION_ID, sessionId);
}
export function getSessionId() {
  return localStorage.getItem(SESSION_ID);
}

export function removeSessionId() {
  localStorage.removeItem(SESSION_ID);
}
