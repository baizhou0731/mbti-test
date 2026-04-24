(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.BDSMScoring = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function toFiniteNumber(value) {
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  }

  function clampInt(value, min, max) {
    if (!Number.isFinite(value)) {
      return min;
    }
    return Math.min(max, Math.max(min, Math.round(value)));
  }

  function scoreLikert(value, reverse) {
    var numeric = toFiniteNumber(value);
    if (numeric === null || numeric < 0 || numeric > 5) {
      return 0;
    }
    var score = reverse ? 5 - numeric : numeric;
    return clampInt(score, 0, 5);
  }

  function normalizeToHundred(rawValue, maxValue) {
    if (!Number.isFinite(rawValue) || !Number.isFinite(maxValue) || maxValue <= 0) {
      return 0;
    }
    return clampInt((rawValue / maxValue) * 100, 0, 100);
  }

  function computeDimensionScores(questions, answers, dimensionKeys) {
    var totals = {};
    var maxTotals = {};
    var i;

    for (i = 0; i < dimensionKeys.length; i += 1) {
      totals[dimensionKeys[i]] = 0;
      maxTotals[dimensionKeys[i]] = 0;
    }

    for (i = 0; i < questions.length; i += 1) {
      var question = questions[i] || {};
      var rawAnswer = answers ? answers[question.id] : undefined;
      var weights = question.weights || {};
      var key;

      if (rawAnswer === undefined || rawAnswer === null) {
        continue;
      }

      var baseScore = scoreLikert(rawAnswer, Boolean(question.reverse));

      for (key in weights) {
        if (Object.prototype.hasOwnProperty.call(weights, key) && Object.prototype.hasOwnProperty.call(totals, key)) {
          totals[key] += baseScore * weights[key];
          maxTotals[key] += 5 * weights[key];
        }
      }
    }

    var result = {};
    for (i = 0; i < dimensionKeys.length; i += 1) {
      key = dimensionKeys[i];
      result[key] = normalizeToHundred(totals[key], maxTotals[key]);
    }
    return result;
  }

  function computeRoleScores(dimensions) {
    var d = dimensions || {};
    return {
      dom: clampInt(0.34 * d.controlDrive + 0.18 * d.training + 0.18 * d.caregiving + 0.12 * d.bondageInterest + 0.10 * d.primal + 0.08 * d.intensityPreference, 0, 100),
      sub: clampInt(0.34 * d.submissionComfort + 0.22 * d.service + 0.16 * d.bondageInterest + 0.12 * d.caregiving + 0.08 * d.humiliationTolerance + 0.08 * d.primal, 0, 100),
      switch: clampInt(0.45 * d.switchFlexibility + 0.25 * Math.min(d.controlDrive, d.submissionComfort) + 0.20 * (100 - Math.abs(d.controlDrive - d.submissionComfort)) + 0.10 * d.primal, 0, 100),
      sado: clampInt(0.42 * d.intensityPreference + 0.28 * d.controlDrive + 0.18 * d.humiliationTolerance + 0.12 * d.primal, 0, 100),
      maso: clampInt(0.42 * d.intensityPreference + 0.26 * d.submissionComfort + 0.18 * d.bondageInterest + 0.14 * d.humiliationTolerance, 0, 100),
      vanilla: clampInt(0.55 * d.vanillaPreference + 0.20 * (100 - d.intensityPreference) + 0.15 * (100 - Math.max(d.controlDrive, d.submissionComfort)) + 0.10 * d.caregiving, 0, 100),
    };
  }

  function normalizeGroupMap(rawGroup) {
    var entries = Object.keys(rawGroup).map(function (key, index) {
      return {
        key: key,
        raw: clampInt(rawGroup[key], 0, 100),
        index: index,
      };
    });
    var total = 0;
    var i;

    for (i = 0; i < entries.length; i += 1) {
      total += entries[i].raw;
    }

    if (total <= 0) {
      return Object.fromEntries(entries.map(function (entry) {
        return [entry.key, 0];
      }));
    }

    for (i = 0; i < entries.length; i += 1) {
      var exact = (entries[i].raw / total) * 100;
      entries[i].floor = Math.floor(exact);
      entries[i].remainder = exact - entries[i].floor;
      entries[i].value = entries[i].floor;
    }

    var assigned = entries.reduce(function (sum, entry) {
      return sum + entry.value;
    }, 0);
    var remaining = 100 - assigned;

    entries.sort(function (a, b) {
      if (b.remainder !== a.remainder) {
        return b.remainder - a.remainder;
      }
      return a.index - b.index;
    });

    for (i = 0; i < remaining; i += 1) {
      entries[i].value += 1;
    }

    entries.sort(function (a, b) {
      return a.index - b.index;
    });

    return Object.fromEntries(entries.map(function (entry) {
      return [entry.key, entry.value];
    }));
  }

  function computeIdentityPercentages(dimensions) {
    var d = dimensions || {};
    var dominant = {
      dominant: 0.45 * d.controlDrive + 0.15 * d.training + 0.10 * d.caregiving + 0.10 * d.bondageInterest + 0.10 * d.primal + 0.10 * d.intensityPreference,
      caregiver: 0.45 * d.caregiving + 0.30 * d.controlDrive + 0.15 * d.vanillaPreference + 0.10 * d.training,
      degrader: 0.40 * d.humiliationTolerance + 0.35 * d.controlDrive + 0.25 * d.intensityPreference,
      binder: 0.55 * d.bondageInterest + 0.25 * d.controlDrive + 0.20 * d.training,
      primalHunter: 0.50 * d.primal + 0.25 * d.intensityPreference + 0.25 * d.controlDrive,
      trainer: 0.50 * d.training + 0.35 * d.controlDrive + 0.15 * d.caregiving,
      beastTrainer: 0.30 * d.caregiving + 0.25 * d.training + 0.25 * d.controlDrive + 0.20 * d.service,
      owner: 0.35 * d.controlDrive + 0.25 * d.service + 0.20 * d.caregiving + 0.20 * d.training,
      sadist: 0.42 * d.intensityPreference + 0.28 * d.controlDrive + 0.18 * d.humiliationTolerance + 0.12 * d.bondageInterest,
    };

    var submissive = {
      submissive: 0.50 * d.submissionComfort + 0.20 * d.service + 0.15 * d.caregiving + 0.15 * d.bondageInterest,
      little: 0.40 * d.caregiving + 0.30 * d.submissionComfort + 0.20 * d.vanillaPreference + 0.10 * d.bratTendency,
      degraded: 0.50 * d.humiliationTolerance + 0.30 * d.submissionComfort + 0.20 * d.intensityPreference,
      bound: 0.55 * d.bondageInterest + 0.25 * d.submissionComfort + 0.20 * d.intensityPreference,
      primalPrey: 0.45 * d.primal + 0.35 * d.submissionComfort + 0.20 * d.intensityPreference,
      brat: 0.45 * d.bratTendency + 0.20 * d.submissionComfort + 0.20 * d.switchFlexibility + 0.15 * d.controlDrive,
      pet: 0.35 * d.caregiving + 0.25 * d.submissionComfort + 0.20 * d.service + 0.20 * d.vanillaPreference,
      servant: 0.55 * d.service + 0.25 * d.submissionComfort + 0.20 * d.training,
      masochist: 0.45 * d.intensityPreference + 0.20 * d.submissionComfort + 0.20 * d.humiliationTolerance + 0.15 * d.bondageInterest,
    };

    return {
      dominant: normalizeGroupMap(dominant),
      submissive: normalizeGroupMap(submissive),
    };
  }

  function computeTagScores(dimensions) {
    var d = dimensions || {};
    return {
      caregivingStyle: clampInt(0.60 * d.caregiving + 0.25 * d.vanillaPreference + 0.15 * d.controlDrive, 0, 100),
      structuredStyle: clampInt(0.65 * d.training + 0.20 * d.controlDrive + 0.15 * d.service, 0, 100),
      bondageExplorerStyle: clampInt(0.65 * d.bondageInterest + 0.20 * d.intensityPreference + 0.15 * d.controlDrive, 0, 100),
      primalStyle: clampInt(0.70 * d.primal + 0.15 * d.intensityPreference + 0.15 * (100 - Math.abs(d.controlDrive - d.submissionComfort)), 0, 100),
      serviceStyle: clampInt(0.65 * d.service + 0.20 * d.submissionComfort + 0.15 * d.training, 0, 100),
      brattyContrastStyle: clampInt(0.55 * d.bratTendency + 0.20 * d.switchFlexibility + 0.15 * d.submissionComfort + 0.10 * d.controlDrive, 0, 100),
      ritualStyle: clampInt(0.45 * d.training + 0.35 * d.vanillaPreference + 0.20 * d.service, 0, 100),
      gentleVanillaStyle: clampInt(0.55 * d.vanillaPreference + 0.25 * d.caregiving + 0.20 * (100 - d.intensityPreference), 0, 100),
    };
  }

  return {
    scoreLikert: scoreLikert,
    computeDimensionScores: computeDimensionScores,
    computeRoleScores: computeRoleScores,
    computeIdentityPercentages: computeIdentityPercentages,
    computeTagScores: computeTagScores,
  };
});
