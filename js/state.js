(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.BDSMState = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  var STORAGE_KEY = 'bdsm-attribute-test-progress';

  function createEmptySnapshot() {
    return {
      started: false,
      currentIndex: 0,
      answers: {},
      completed: false,
      lastComputedAt: null,
    };
  }

  function getAnsweredCount(snapshot) {
    var source = snapshot && snapshot.answers && typeof snapshot.answers === 'object' && !Array.isArray(snapshot.answers)
      ? snapshot.answers
      : {};
    return Object.keys(source).length;
  }

  function updateAnswer(snapshot, questionId, value, totalQuestions) {
    var base = snapshot || createEmptySnapshot();
    var answers = Object.assign({}, base.answers || {});
    var safeTotal = Number.isInteger(totalQuestions) ? totalQuestions : 0;
    var boundedTotal = Math.max(0, safeTotal);
    var answeredCount;

    answers[questionId] = value;
    answeredCount = Object.keys(answers).length;

    return {
      started: true,
      currentIndex: boundedTotal > 0 ? Math.min(answeredCount, boundedTotal - 1) : 0,
      answers: answers,
      completed: boundedTotal > 0 && answeredCount >= boundedTotal,
      lastComputedAt: Object.prototype.hasOwnProperty.call(base, 'lastComputedAt') ? base.lastComputedAt : null,
    };
  }

  function saveSnapshot(storage, snapshot) {
    storage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }

  function normalizeAnswers(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }
    return value;
  }

  function normalizeCurrentIndex(value) {
    if (!Number.isInteger(value) || value < 0) {
      return 0;
    }
    return value;
  }

  function loadSnapshot(storage) {
    var raw = storage.getItem(STORAGE_KEY);
    var parsed;

    if (!raw) {
      return createEmptySnapshot();
    }

    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      return createEmptySnapshot();
    }

    return {
      started: Boolean(parsed && parsed.started),
      currentIndex: normalizeCurrentIndex(parsed && parsed.currentIndex),
      answers: normalizeAnswers(parsed && parsed.answers),
      completed: Boolean(parsed && parsed.completed),
      lastComputedAt: parsed && parsed.lastComputedAt ? parsed.lastComputedAt : null,
    };
  }

  function clearSnapshot(storage) {
    storage.removeItem(STORAGE_KEY);
  }

  return {
    STORAGE_KEY: STORAGE_KEY,
    createEmptySnapshot: createEmptySnapshot,
    updateAnswer: updateAnswer,
    getAnsweredCount: getAnsweredCount,
    saveSnapshot: saveSnapshot,
    loadSnapshot: loadSnapshot,
    clearSnapshot: clearSnapshot,
  };
});
