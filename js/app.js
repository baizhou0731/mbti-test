(function (root, factory) {
  var api = factory(root);
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.BDSMApp = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  var views = typeof module === 'object' && module.exports ? require('./views.js') : root.BDSMViews;
  var questionsModule = typeof module === 'object' && module.exports ? require('./questions.js') : root.BDSMQuestions;
  var content = typeof module === 'object' && module.exports ? require('./content.js') : root.BDSMContent;
  var definitions = typeof module === 'object' && module.exports ? require('./attribute-definitions.js') : root.BDSMAttributeDefinitions;
  var state = typeof module === 'object' && module.exports ? require('./state.js') : root.BDSMState;
  var scoring = typeof module === 'object' && module.exports ? require('./scoring.js') : root.BDSMScoring;
  var results = typeof module === 'object' && module.exports ? require('./results.js') : root.BDSMResults;

  function computeProgressPercent(currentIndex, totalQuestions) {
    var safeIndex = Number.isFinite(currentIndex) ? Number(currentIndex) : 0;
    var safeTotal = Number.isFinite(totalQuestions) ? Number(totalQuestions) : 0;

    if (safeTotal <= 0) {
      return 0;
    }

    return Math.max(2, Math.min(100, Math.round(((safeIndex + 1) / safeTotal) * 100)));
  }

  function resolveActiveScreen(snapshotLike, totalQuestions) {
    var snapshot = snapshotLike || {};
    var safeTotal = Number.isInteger(totalQuestions) && totalQuestions >= 0
      ? totalQuestions
      : ((questionsModule && Array.isArray(questionsModule.QUESTIONS)) ? questionsModule.QUESTIONS.length : 0);

    if (!snapshot.started) {
      return 'intro';
    }

    if (snapshot.completed || snapshot.answeredCount >= safeTotal) {
      return 'results';
    }

    return 'questions';
  }

  function createFallbackStorage() {
    return {
      getItem: function () { return null; },
      setItem: function () {},
      removeItem: function () {},
    };
  }

  function safeScore(source, key) {
    return source && Number.isFinite(source[key]) ? source[key] : 0;
  }

  function metricItems(scoreSource, map, group) {
    return Object.keys(map).map(function (key) {
      var definition = map[key];

      return {
        key: key,
        group: group,
        en: definition.en,
        cn: definition.cn,
        score: safeScore(scoreSource, key),
      };
    });
  }

  function styleTags(tagKeys) {
    return (tagKeys || []).map(function (key) {
      var label = definitions && definitions.STYLE_LABELS ? definitions.STYLE_LABELS[key] : null;
      return {
        key: key,
        text: label ? (label.en + ' / ' + label.cn) : key,
      };
    });
  }

  function analysisCards(paragraphs) {
    return (paragraphs || []).map(function (body, index) {
      var title = (definitions && definitions.INSIGHT_CARD_TITLES && definitions.INSIGHT_CARD_TITLES[index]) || {
        en: 'Insight',
        cn: '分析'
      };

      return {
        en: title.en,
        cn: title.cn,
        body: body,
      };
    });
  }

  function resolveActiveDefinition(activeDefinition) {
    if (!activeDefinition || !definitions || typeof definitions.getDefinition !== 'function') {
      return null;
    }

    var definition = definitions.getDefinition(activeDefinition.group, activeDefinition.key);

    if (!definition) {
      return null;
    }

    return {
      group: activeDefinition.group,
      key: activeDefinition.key,
      en: definition.en,
      cn: definition.cn,
      desc: definition.desc,
      high: definition.high,
      low: definition.low,
      note: definition.note,
    };
  }

  function buildResultViewModel(snapshot, activeDefinition) {
    var dimensionKeys = Object.keys((questionsModule && questionsModule.DIMENSIONS) || {});
    var dimensions = scoring.computeDimensionScores(questionsModule.QUESTIONS, snapshot.answers, dimensionKeys);
    var roleScores = scoring.computeRoleScores(dimensions);
    var identities = scoring.computeIdentityPercentages(dimensions);
    var tagScores = scoring.computeTagScores(dimensions);
    var payload = results.createResultPayload({
      dimensions: dimensions,
      roleScores: roleScores,
      identities: identities,
      tagScores: tagScores,
    });

    return {
      persona: payload.animal,
      roleMetrics: metricItems(payload.roleScores, definitions.ROLE_DEFINITIONS, 'roles'),
      dominantMetrics: metricItems(payload.identities && payload.identities.dominant, definitions.DOMINANT_IDENTITY_DEFINITIONS, 'dominant'),
      submissiveMetrics: metricItems(payload.identities && payload.identities.submissive, definitions.SUBMISSIVE_IDENTITY_DEFINITIONS, 'submissive'),
      styleTags: styleTags(payload.topTags),
      analysisCards: analysisCards(payload.analysis),
      safetyCopy: content.SAFETY_COPY,
      activeDefinition: resolveActiveDefinition(activeDefinition),
    };
  }

  function createApp(documentRef, storageRef) {
    var doc = documentRef || root.document;
    var storage = storageRef || createFallbackStorage();
    var totalQuestions = Array.isArray(questionsModule.QUESTIONS) ? questionsModule.QUESTIONS.length : 0;
    var rootNode = doc && typeof doc.querySelector === 'function' ? doc.querySelector('#app') : null;
    var snapshot = state.loadSnapshot(storage);
    var activeDefinition = null;

    if (!rootNode) {
      return null;
    }

    function render() {
      var answeredCount = state.getAnsweredCount(snapshot);
      var activeScreen = resolveActiveScreen({
        started: snapshot.started,
        answeredCount: answeredCount,
        completed: snapshot.completed,
      }, totalQuestions);

      if (activeScreen === 'intro') {
        rootNode.innerHTML = views.renderIntroScreen(content.INTRO_COPY);
        return;
      }

      if (activeScreen === 'questions') {
        var maxIndex = Math.max(0, totalQuestions - 1);
        var currentIndex = Math.min(Math.max(snapshot.currentIndex || 0, 0), maxIndex);
        var currentQuestion = questionsModule.QUESTIONS[currentIndex];

        if (!currentQuestion) {
          rootNode.innerHTML = views.renderIntroScreen(content.INTRO_COPY);
          return;
        }

        rootNode.innerHTML = views.renderQuestionScreen({
          question: currentQuestion,
          questionIndex: currentIndex,
          totalQuestions: totalQuestions,
          selectedValue: snapshot.answers ? snapshot.answers[currentQuestion.id] : null,
          scaleOptions: content.SCALE_OPTIONS,
          progressPercent: computeProgressPercent(currentIndex, totalQuestions),
        });
        return;
      }

      rootNode.innerHTML = views.renderResultScreen(buildResultViewModel(snapshot, activeDefinition));
    }

    function handleClick(event) {
      var target = event.target && typeof event.target.closest === 'function'
        ? event.target.closest('[data-action]')
        : null;
      var action;

      if (!target || !rootNode.contains(target)) {
        return;
      }

      action = target.getAttribute('data-action');

      if (action === 'start') {
        activeDefinition = null;
        snapshot = state.createEmptySnapshot();
        snapshot.started = true;
        state.saveSnapshot(storage, snapshot);
        render();
        return;
      }

      if (action === 'restart') {
        activeDefinition = null;
        snapshot = state.createEmptySnapshot();
        state.clearSnapshot(storage);
        render();
        return;
      }

      if (action === 'answer') {
        activeDefinition = null;
        snapshot = state.updateAnswer(
          snapshot,
          target.getAttribute('data-question-id'),
          Number(target.getAttribute('data-value')),
          totalQuestions
        );
        state.saveSnapshot(storage, snapshot);
        render();
        return;
      }

      if (action === 'open-definition') {
        activeDefinition = {
          group: target.getAttribute('data-group'),
          key: target.getAttribute('data-key'),
        };
        render();
        return;
      }

      if (action === 'close-modal') {
        activeDefinition = null;
        render();
        return;
      }

      if (action === 'print-result') {
        if (root && typeof root.print === 'function') {
          root.print();
        }
        return;
      }

      if (action === 'share-result') {
        var shareText = 'BDSM Attribute Test Result';

        try {
          if (root && root.navigator && typeof root.navigator.share === 'function') {
            root.navigator.share({
              title: shareText,
              text: shareText,
            });
            return;
          }

          if (root && root.navigator && root.navigator.clipboard && typeof root.navigator.clipboard.writeText === 'function') {
            root.navigator.clipboard.writeText(shareText);
          }
        } catch (error) {
          // Ignore share failures in restricted browser contexts.
        }
        return;
      }

      if (action === 'explain') {
        if (root && typeof root.alert === 'function' && content.SAFETY_COPY && content.SAFETY_COPY.note) {
          root.alert(content.SAFETY_COPY.note);
        }
      }
    }

    function handleKeydown(event) {
      var key = event && typeof event.key === 'string' ? event.key : '';
      var answeredCount = state.getAnsweredCount(snapshot);
      var activeScreen = resolveActiveScreen({
        started: snapshot.started,
        answeredCount: answeredCount,
        completed: snapshot.completed,
      }, totalQuestions);
      var numericValue;
      var currentQuestion;

      if (key === 'Escape' && activeDefinition) {
        activeDefinition = null;
        render();
        return;
      }

      if (activeScreen !== 'questions') {
        return;
      }

      if (!/^[1-6]$/.test(key)) {
        return;
      }

      numericValue = Number(key) - 1;
      currentQuestion = questionsModule.QUESTIONS[snapshot.currentIndex || 0];

      if (!currentQuestion) {
        return;
      }

      if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }

      activeDefinition = null;
      snapshot = state.updateAnswer(
        snapshot,
        currentQuestion.id,
        numericValue,
        totalQuestions
      );
      state.saveSnapshot(storage, snapshot);
      render();
    }

    if (rootNode.__bdsmAppHandler) {
      rootNode.removeEventListener('click', rootNode.__bdsmAppHandler);
    }

    if (doc && doc.__bdsmAppKeydownHandler && typeof doc.removeEventListener === 'function') {
      doc.removeEventListener('keydown', doc.__bdsmAppKeydownHandler);
    }

    rootNode.addEventListener('click', handleClick);
    rootNode.__bdsmAppHandler = handleClick;

    if (doc && typeof doc.addEventListener === 'function') {
      doc.addEventListener('keydown', handleKeydown);
      doc.__bdsmAppKeydownHandler = handleKeydown;
    }

    render();

    return {
      render: render,
      getSnapshot: function () {
        return snapshot;
      },
    };
  }

  return {
    computeProgressPercent: computeProgressPercent,
    resolveActiveScreen: resolveActiveScreen,
    createApp: createApp,
  };
});
