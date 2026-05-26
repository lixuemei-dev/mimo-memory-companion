/**
 * Session Cohesion Analyzer
 * Tracks conversation flow, continuity, and drift detection
 */

class SessionCohesionAnalyzer {
  constructor() {
    this.sessions = new Map();
  }

  startSession(sessionId) {
    this.sessions.set(sessionId, {
      messages: [],
      contextSwitches: 0,
      memoryUsage: 0,
      startTime: Date.now(),
    });
  }

  recordMessage(sessionId, message) {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    session.messages.push({
      role: message.role,
      content: message.content,
      timestamp: Date.now(),
      memoryUsed: message.memoryUsed || 0,
    });
    if (message.memoryUsed > 0) session.memoryUsage += message.memoryUsed;
    if (session.messages.length > 1) {
      const prev = session.messages[session.messages.length - 2];
      if (this.detectDrift(prev.content, message.content)) {
        session.contextSwitches++;
      }
    }
  }

  detectDrift(prev, current) {
    const prevWords = new Set(prev.toLowerCase().split(/\s+/));
    const currWords = new Set(current.toLowerCase().split(/\s+/));
    const overlap = [...currWords].filter(w => prevWords.has(w)).length;
    const similarity = overlap / Math.max(prevWords.size, currWords.size, 1);
    return similarity < 0.15;
  }

  getSessionReport(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    const duration = Date.now() - session.startTime;
    return {
      sessionId,
      messageCount: session.messages.length,
      duration,
      contextSwitches: session.contextSwitches,
      cohesionScore: Math.max(0, 1 - session.contextSwitches * 0.1),
      memoryEfficiency: session.memoryUsage / Math.max(session.messages.length, 1),
    };
  }
}

module.exports = SessionCohesionAnalyzer;
