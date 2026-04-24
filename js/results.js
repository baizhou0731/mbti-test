(function (global) {
  var localContent = typeof module !== 'undefined' && module.exports
    ? require('./content.js')
    : null;
  var localDefinitions = typeof module !== 'undefined' && module.exports
    ? require('./attribute-definitions.js')
    : null;

  var FALLBACK_CONTENT = {
    RESULT_ANALYSIS_COPY: {
      defaults: {
        primaryRoleLabel: 'switch',
        primaryRoleValue: 0,
        readableTags: 'structuredStyle',
        dominantLead: 'dominant',
        submissiveLead: 'submissive'
      },
      primaryRole: function (role, value, readableRole) {
        return 'Current result leans toward ' + readableRole + ' (' + value + '%).';
      },
      interaction: function (tags, dominantLead, submissiveLead) {
        return 'Current interaction style is closer to ' + tags + ', with dominant cues in ' + dominantLead + ' and submissive cues in ' + submissiveLead + '.';
      },
      safety: 'Results are only a conversation aid and cannot replace boundaries, pacing, and consent.'
    }
  };

  var FALLBACK_DEFINITIONS = {
    PERSONA_PROFILES: [
      {
        slug: 'fallback-persona',
        nameCn: '默认画像',
        nameEn: 'Fallback Persona',
        assetPath: '',
        accent: 'fallback',
        roleHints: ['switch'],
        tagHints: ['structuredStyle'],
        statement: 'Balanced',
        description: 'Fallback persona used when attribute definitions are unavailable.'
      }
    ],
    STYLE_LABELS: {
      structuredStyle: { en: 'Structured', cn: '规则型' }
    },
    ROLE_DEFINITIONS: {},
    DOMINANT_IDENTITY_DEFINITIONS: {},
    SUBMISSIVE_IDENTITY_DEFINITIONS: {}
  };

  function isObjectRecord(value) {
    return !!value && typeof value === 'object' && !Array.isArray(value);
  }

  function resolveContent() {
    var source = isObjectRecord(localContent)
      ? localContent
      : (isObjectRecord(global.BDSMContent) ? global.BDSMContent : {});
    var analysisSource = isObjectRecord(source.RESULT_ANALYSIS_COPY)
      ? source.RESULT_ANALYSIS_COPY
      : {};
    var fallbackAnalysis = FALLBACK_CONTENT.RESULT_ANALYSIS_COPY;

    return {
      RESULT_ANALYSIS_COPY: {
        defaults: {
          ...fallbackAnalysis.defaults,
          ...(isObjectRecord(analysisSource.defaults) ? analysisSource.defaults : {})
        },
        primaryRole: typeof analysisSource.primaryRole === 'function'
          ? analysisSource.primaryRole
          : fallbackAnalysis.primaryRole,
        interaction: typeof analysisSource.interaction === 'function'
          ? analysisSource.interaction
          : fallbackAnalysis.interaction,
        safety: typeof analysisSource.safety === 'string'
          ? analysisSource.safety
          : fallbackAnalysis.safety
      }
    };
  }

  function resolveDefinitions() {
    var source = isObjectRecord(localDefinitions)
      ? localDefinitions
      : (isObjectRecord(global.BDSMAttributeDefinitions) ? global.BDSMAttributeDefinitions : {});

    return {
      PERSONA_PROFILES: Array.isArray(source.PERSONA_PROFILES) && source.PERSONA_PROFILES.length
        ? source.PERSONA_PROFILES
        : FALLBACK_DEFINITIONS.PERSONA_PROFILES,
      STYLE_LABELS: isObjectRecord(source.STYLE_LABELS)
        ? source.STYLE_LABELS
        : FALLBACK_DEFINITIONS.STYLE_LABELS,
      ROLE_DEFINITIONS: isObjectRecord(source.ROLE_DEFINITIONS)
        ? source.ROLE_DEFINITIONS
        : FALLBACK_DEFINITIONS.ROLE_DEFINITIONS,
      DOMINANT_IDENTITY_DEFINITIONS: isObjectRecord(source.DOMINANT_IDENTITY_DEFINITIONS)
        ? source.DOMINANT_IDENTITY_DEFINITIONS
        : FALLBACK_DEFINITIONS.DOMINANT_IDENTITY_DEFINITIONS,
      SUBMISSIVE_IDENTITY_DEFINITIONS: isObjectRecord(source.SUBMISSIVE_IDENTITY_DEFINITIONS)
        ? source.SUBMISSIVE_IDENTITY_DEFINITIONS
        : FALLBACK_DEFINITIONS.SUBMISSIVE_IDENTITY_DEFINITIONS
    };
  }

  function sortScoreEntries(scores) {
    if (!isObjectRecord(scores)) {
      return [];
    }

    return Object.entries(scores)
      .filter(function (entry) {
        return Number.isFinite(entry[1]);
      })
      .sort(function (a, b) {
        return b[1] - a[1];
      });
  }

  function normalizeTopTags(topTags) {
    if (!Array.isArray(topTags)) {
      return [];
    }

    return topTags.filter(function (tagKey) {
      return typeof tagKey === 'string';
    });
  }

  function pickTopTags(tagScores, threshold, limit) {
    var safeThreshold = Number.isFinite(threshold) ? threshold : 60;
    var safeLimit = Number.isFinite(limit) ? limit : 5;

    return sortScoreEntries(tagScores)
      .filter(function (entry) {
        return entry[1] >= safeThreshold;
      })
      .slice(0, safeLimit)
      .map(function (entry) {
        return entry[0];
      });
  }

  function profileMatchesRole(profile, primaryRole) {
    return Array.isArray(profile.roleHints) && profile.roleHints.includes(primaryRole);
  }

  function profileTagOverlap(profile, topTags) {
    var tagHints = Array.isArray(profile.tagHints) ? profile.tagHints : [];
    return tagHints.filter(function (hint) {
      return topTags.includes(hint);
    }).length;
  }

  function profileRolePriority(profile, primaryRole) {
    if (!Array.isArray(profile.roleHints)) {
      return 0;
    }

    if (profile.roleHints[0] === primaryRole) {
      return 0.5;
    }

    return 0;
  }

  function selectAnimalProfile(options) {
    var resolvedDefinitions = resolveDefinitions();
    var roleEntries = sortScoreEntries(options && options.roleScores);
    var normalizedTopTags = normalizeTopTags(options && options.topTags);
    var profiles = resolvedDefinitions.PERSONA_PROFILES;
    var primaryRole = roleEntries.length ? roleEntries[0][0] : null;
    var bestMatch = null;

    if (!primaryRole) {
      return profiles[0];
    }

    profiles.forEach(function (profile) {
      var overlap;
      var totalScore;

      if (!profileMatchesRole(profile, primaryRole)) {
        return;
      }

      overlap = profileTagOverlap(profile, normalizedTopTags);
      totalScore = overlap + profileRolePriority(profile, primaryRole);
      if (!bestMatch || totalScore > bestMatch.score) {
        bestMatch = {
          profile: profile,
          overlap: overlap,
          score: totalScore
        };
      }
    });

    if (bestMatch && bestMatch.overlap > 0) {
      return bestMatch.profile;
    }

    return profiles.find(function (profile) {
      return profileMatchesRole(profile, primaryRole);
    }) || profiles[0];
  }

  function topIdentityGroupEntries(group) {
    return sortScoreEntries(group).slice(0, 3);
  }

  function readableStyleTags(tagKeys, styleLabels, fallbackKey) {
    var readable = normalizeTopTags(tagKeys).map(function (tagKey) {
      var label = styleLabels[tagKey];
      return label ? label.cn : tagKey;
    }).filter(Boolean);

    if (readable.length) {
      return readable.join(' / ');
    }

    if (styleLabels[fallbackKey]) {
      return styleLabels[fallbackKey].cn;
    }

    return fallbackKey;
  }

  function readableRole(primaryRoleKey, roleDefinitions) {
    var definition = roleDefinitions[primaryRoleKey];
    return definition ? (definition.en.toUpperCase() + '（' + definition.cn + '）') : String(primaryRoleKey).toUpperCase();
  }

  function readableIdentity(identityKey, map) {
    var definition = map[identityKey];
    return definition ? (definition.en + '（' + definition.cn + '）') : identityKey;
  }

  function buildAnalysisSections(options) {
    var resolvedContent = resolveContent();
    var resolvedDefinitions = resolveDefinitions();
    var analysisCopy = resolvedContent.RESULT_ANALYSIS_COPY;
    var defaults = analysisCopy.defaults;
    var primaryRoleEntry = sortScoreEntries(options && options.roleScores)[0] || [defaults.primaryRoleLabel, defaults.primaryRoleValue];
    var dominantLead = (topIdentityGroupEntries(options && options.dominantIdentities)[0] || [defaults.dominantLead])[0];
    var submissiveLead = (topIdentityGroupEntries(options && options.submissiveIdentities)[0] || [defaults.submissiveLead])[0];
    var readableTags = readableStyleTags(
      options && options.topTags,
      resolvedDefinitions.STYLE_LABELS,
      defaults.readableTags
    );

    return [
      analysisCopy.primaryRole(
        primaryRoleEntry[0],
        primaryRoleEntry[1],
        readableRole(primaryRoleEntry[0], resolvedDefinitions.ROLE_DEFINITIONS)
      ),
      analysisCopy.interaction(
        readableTags,
        readableIdentity(dominantLead, resolvedDefinitions.DOMINANT_IDENTITY_DEFINITIONS),
        readableIdentity(submissiveLead, resolvedDefinitions.SUBMISSIVE_IDENTITY_DEFINITIONS)
      ),
      analysisCopy.safety
    ];
  }

  function createResultPayload(options) {
    var safeOptions = options || {};
    var topTags = pickTopTags(safeOptions.tagScores);
    var animal = selectAnimalProfile({
      roleScores: safeOptions.roleScores,
      topTags: topTags
    });
    var analysis = buildAnalysisSections({
      roleScores: safeOptions.roleScores,
      topTags: topTags,
      dominantIdentities: safeOptions.identities && safeOptions.identities.dominant,
      submissiveIdentities: safeOptions.identities && safeOptions.identities.submissive
    });

    return {
      dimensions: safeOptions.dimensions,
      roleScores: safeOptions.roleScores,
      identities: safeOptions.identities,
      tagScores: safeOptions.tagScores,
      topTags: topTags,
      animal: animal,
      analysis: analysis
    };
  }

  var api = {
    pickTopTags: pickTopTags,
    selectAnimalProfile: selectAnimalProfile,
    buildAnalysisSections: buildAnalysisSections,
    createResultPayload: createResultPayload
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.BDSMResults = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
