/* ============================================================
   API 桩：签名、延迟、返回结构都按真实接口设计。
   接后端时把实现换成 fetch 即可，页面不用改。
   ============================================================ */

const delay = (ms) => new Promise(r => setTimeout(r, ms));

const API = {
  /* POST /api/scan/recognize  body:{ imageMeta }  → { taskId, pages } */
  async recognize() {
    await delay(900);
    return { code: 0, data: { taskId: 'task_1023_01', pages: 1 } };
  },

  /* POST /api/grade  body:{ taskId }  → { batch } */
  async grade(taskId) {
    await delay(1200);
    return { code: 0, data: { batchId: 'b1' } };
  },

  /* POST /api/explain/video  body:{ problemId, errorStep }  → { videoId, status } */
  async generateVideo(problemId) {
    await delay(1500);
    return { code: 0, data: { videoId: 'v_' + problemId, status: 'ready', provider: 'script+tts+template' } };
  },

  /* GET /api/review/today  → { plan } */
  async fetchReviewPlan() {
    await delay(450);
    return { code: 0, data: window.DB.reviewPlan };
  },

  /* POST /api/review/submit  body:{ typeId, questionId, answer }  → { correct, streak, mastered } */
  async submitAnswer(payload) {
    await delay(250);
    return { code: 0, data: { correct: payload.correct, streak: payload.streak } };
  },

  /* GET /api/stats/wrong  → { total, byType, mastery } */
  async fetchStats() {
    await delay(300);
    return { code: 0, data: { total: 0 } };
  }
};

window.API = API;
