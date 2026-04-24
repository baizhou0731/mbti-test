(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.BDSMViews = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderIntroScreen(copy) {
    var data = copy || {};
    var bullets = Array.isArray(data.bullets) ? data.bullets : [];

    return [
      '<section class="intro-screen">',
      '  <div class="intro-copy">',
      '    <p class="eyebrow">' + escapeHtml(data.eyebrow) + '</p>',
      '    <h1 class="intro-title">' + escapeHtml(data.title) + '</h1>',
      '    <p class="intro-description">' + escapeHtml(data.description) + '</p>',
      bullets.length ? (
        '    <ul class="intro-points">' + bullets.map(function (item) {
          return '<li>' + escapeHtml(item) + '</li>';
        }).join('') + '</ul>'
      ) : '',
      '  </div>',
      '  <div class="intro-actions">',
      '    <button type="button" class="primary-action" data-action="start">Start Test</button>',
      '    <button type="button" class="secondary-action" data-action="explain">How It Works</button>',
      '  </div>',
      '</section>',
    ].join('\n');
  }

  function renderQuestionScreen(options) {
    var data = options || {};
    var question = data.question || {};
    var questionIndex = Number.isInteger(data.questionIndex) ? data.questionIndex : 0;
    var totalQuestions = Number.isInteger(data.totalQuestions) && data.totalQuestions > 0 ? data.totalQuestions : 1;
    var selectedValue = Number.isInteger(data.selectedValue) ? data.selectedValue : null;
    var scaleOptions = Array.isArray(data.scaleOptions) ? data.scaleOptions : [];
    var progressPercent = Number.isFinite(data.progressPercent) ? data.progressPercent : 0;
    var clampedProgress = Math.max(0, Math.min(100, Math.round(progressPercent)));

    return [
      '<section class="question-screen">',
      '  <header class="question-header">',
      '    <p class="progress-label">Question ' + escapeHtml(questionIndex + 1) + ' of ' + escapeHtml(totalQuestions) + '</p>',
      '    <div class="progress-track" role="progressbar" aria-label="Question progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + clampedProgress + '">',
      '      <div class="progress-fill" style="width: ' + clampedProgress + '%;"></div>',
      '    </div>',
      '  </header>',
      '  <article class="question-card">',
      '    <h2 class="question-prompt">' + escapeHtml(question.prompt) + '</h2>',
      '    <div class="option-list" role="list">',
      scaleOptions.map(function (option, index) {
        var isSelected = selectedValue === index;
        return [
          '      <button',
          '        type="button"',
          '        class="option-button' + (isSelected ? ' is-selected' : '') + '"',
          '        data-action="answer"',
          '        data-question-id="' + escapeHtml(question.id) + '"',
          '        data-value="' + index + '"',
          '        aria-pressed="' + (isSelected ? 'true' : 'false') + '">',
          '        <span class="option-index">' + escapeHtml(index + 1) + '</span>',
          '        <span class="option-label">' + escapeHtml(option) + '</span>',
          '      </button>',
        ].join('');
      }).join('\n'),
      '    </div>',
      '  </article>',
      '</section>',
    ].join('\n');
  }

  function renderMetricRow(item) {
    return [
      '<article class="metric-row">',
      '  <div class="metric-head">',
      '    <button type="button" class="metric-name-button" data-action="open-definition" data-group="' + escapeHtml(item.group) + '" data-key="' + escapeHtml(item.key) + '">',
      '      <span class="metric-name-en">' + escapeHtml(item.en) + '</span>',
      '      <span class="metric-name-cn">' + escapeHtml(item.cn) + '</span>',
      '    </button>',
      '    <span class="metric-value">' + escapeHtml(item.score) + '%</span>',
      '  </div>',
      '  <div class="metric-track" aria-hidden="true"><span class="metric-fill" style="--score:' + escapeHtml(item.score) + '%;"></span></div>',
      '</article>'
    ].join('\n');
  }

  function renderIdentityCard(item) {
    return [
      '<article class="identity-card">',
      '  <div class="identity-card-head">',
      '    <button type="button" class="metric-name-button metric-name-button-card" data-action="open-definition" data-group="' + escapeHtml(item.group) + '" data-key="' + escapeHtml(item.key) + '">',
      '      <span class="metric-name-en">' + escapeHtml(item.en) + '</span>',
      '      <span class="metric-name-cn">' + escapeHtml(item.cn) + '</span>',
      '    </button>',
      '    <span class="metric-value">' + escapeHtml(item.score) + '%</span>',
      '  </div>',
      '  <div class="metric-track" aria-hidden="true"><span class="metric-fill metric-fill-secondary" style="--score:' + escapeHtml(item.score) + '%;"></span></div>',
      '</article>'
    ].join('\n');
  }

  function renderInsightCard(card) {
    return [
      '<article class="insight-card">',
      '  <p class="insight-kicker">' + escapeHtml(card.en) + '</p>',
      '  <h3 class="insight-title">' + escapeHtml(card.cn) + '</h3>',
      '  <p class="analysis-paragraph">' + escapeHtml(card.body) + '</p>',
      '</article>'
    ].join('\n');
  }

  function renderSafetyCard(title, titleCn, items) {
    return [
      '<article class="safety-card">',
      '  <div class="safety-card-head">',
      '    <h3>' + escapeHtml(title) + '</h3>',
      '    <span>' + escapeHtml(titleCn) + '</span>',
      '  </div>',
      (items || []).map(function (item) {
        return [
          '<div class="safety-item">',
          '  <strong>' + escapeHtml(item.title) + '</strong>',
          '  <p>' + escapeHtml(item.body) + '</p>',
          '</div>'
        ].join('\n');
      }).join('\n'),
      '</article>'
    ].join('\n');
  }

  function renderDefinitionModal(definition) {
    if (!definition) {
      return '';
    }

    return [
      '<div class="definition-modal" role="dialog" aria-modal="true" aria-labelledby="definition-title">',
      '  <button type="button" class="definition-backdrop" data-action="close-modal" aria-label="Close definition"></button>',
      '  <article class="definition-panel">',
      '    <button type="button" class="definition-close" data-action="close-modal" aria-label="Close">×</button>',
      '    <p class="hero-kicker">Attribute Guide</p>',
      '    <h2 id="definition-title" class="definition-title">' + escapeHtml(definition.en) + ' <span>' + escapeHtml(definition.cn) + '</span></h2>',
      '    <div class="definition-grid">',
      '      <section class="definition-block">',
      '        <h3>简短定义</h3>',
      '        <p>' + escapeHtml(definition.desc) + '</p>',
      '      </section>',
      '      <section class="definition-block">',
      '        <h3>高分表现</h3>',
      '        <p>' + escapeHtml(definition.high) + '</p>',
      '      </section>',
      '      <section class="definition-block">',
      '        <h3>低分表现</h3>',
      '        <p>' + escapeHtml(definition.low) + '</p>',
      '      </section>',
      '      <section class="definition-block">',
      '        <h3>注意事项</h3>',
      '        <p>' + escapeHtml(definition.note) + '</p>',
      '      </section>',
      '    </div>',
      '  </article>',
      '</div>'
    ].join('\n');
  }

  function renderResultScreen(options) {
    var data = options || {};
    var persona = data.persona || {};
    var roleMetrics = Array.isArray(data.roleMetrics) ? data.roleMetrics : [];
    var dominantMetrics = Array.isArray(data.dominantMetrics) ? data.dominantMetrics : [];
    var submissiveMetrics = Array.isArray(data.submissiveMetrics) ? data.submissiveMetrics : [];
    var styleTags = Array.isArray(data.styleTags) ? data.styleTags : [];
    var analysisCards = Array.isArray(data.analysisCards) ? data.analysisCards : [];
    var safetyCopy = data.safetyCopy || {};

    return [
      '<section class="result-screen">',
      '  <section class="hero">',
      '    <div class="hero-card">',
      '      <div class="avatar-box">',
      '        <img class="animal-image" src="' + escapeHtml(persona.assetPath) + '" alt="' + escapeHtml(persona.nameCn || persona.nameEn) + '">',
      '      </div>',
      '      <div class="hero-copy">',
      '        <p class="hero-kicker">Assessment Result</p>',
      '        <h1 class="result-name-cn">' + escapeHtml(persona.nameCn) + '</h1>',
      '        <p class="result-name-en">' + escapeHtml(persona.nameEn) + '</p>',
      '        <p class="hero-statement">' + escapeHtml(persona.statement) + '</p>',
      '        <p class="hero-description">' + escapeHtml(persona.description) + '</p>',
      '        <div class="hero-actions">',
      '          <button type="button" class="btn btn-primary" data-action="print-result">Save Result</button>',
      '          <button type="button" class="btn btn-ghost" data-action="share-result">Share Result</button>',
      '          <button type="button" class="btn btn-ghost" data-action="restart">Retake Test</button>',
      '        </div>',
      '      </div>',
      '    </div>',
      '  </section>',
      '  <section class="section">',
      '    <div class="section-heading">',
      '      <h2 class="section-title">Core Metrics</h2>',
      '      <p class="section-note">Play role tendencies are shown with bilingual labels, animated progress bars, and expandable explanations.</p>',
      '    </div>',
      '    <article class="card metric-card-shell">',
      '      <div class="metric-list">',
      roleMetrics.map(renderMetricRow).join('\n'),
      '      </div>',
      '    </article>',
      '  </section>',
      '  <section class="section">',
      '    <div class="grid grid-2 section-grid">',
      '      <article class="card">',
      '        <div class="section-heading">',
      '          <h2 class="section-title">Dominant Identity</h2>',
      '          <p class="section-note">支配身份组内占比，点击任意标签可查看解释。</p>',
      '        </div>',
      '        <div class="identity-grid">',
      dominantMetrics.map(renderIdentityCard).join('\n'),
      '        </div>',
      '      </article>',
      '      <article class="card">',
      '        <div class="section-heading">',
      '          <h2 class="section-title">Submissive Identity</h2>',
      '          <p class="section-note">顺从身份组内占比，反映你更容易共鸣的互动位置。</p>',
      '        </div>',
      '        <div class="identity-grid">',
      submissiveMetrics.map(renderIdentityCard).join('\n'),
      '        </div>',
      '      </article>',
      '    </div>',
      '  </section>',
      '  <section class="section">',
      '    <div class="grid grid-2 section-grid">',
      '      <article class="card">',
      '        <div class="section-heading">',
      '          <h2 class="section-title">Style Preferences</h2>',
      '          <p class="section-note">前五个高分风格标签，用来概括你更容易被哪类互动气质吸引。</p>',
      '        </div>',
      '        <div class="style-pill-list">',
      styleTags.map(function (tag) {
        return '<span class="style-pill">' + escapeHtml(tag.text) + '</span>';
      }).join('\n'),
      '        </div>',
      '      </article>',
      '      <article class="card persona-card">',
      '        <div class="section-heading">',
      '          <h2 class="section-title">Persona Card</h2>',
      '          <p class="section-note">动物拟人角色并不是绝对标签，而是帮助你快速记住当前主结果的视觉锚点。</p>',
      '        </div>',
      '        <div class="persona-summary">',
      '          <div class="persona-badge">' + escapeHtml((persona.nameEn || '?').slice(0, 1)) + '</div>',
      '          <div>',
      '            <h3>' + escapeHtml(persona.nameCn) + '</h3>',
      '            <p class="persona-subtitle">' + escapeHtml(persona.nameEn) + '</p>',
      '            <p class="analysis-paragraph">' + escapeHtml(persona.statement) + '</p>',
      '          </div>',
      '        </div>',
      '      </article>',
      '    </div>',
      '  </section>',
      '  <section class="section">',
      '    <div class="grid grid-3 analysis-grid">',
      analysisCards.map(renderInsightCard).join('\n'),
      '    </div>',
      '  </section>',
      '  <section class="section">',
      '    <article class="card notice-card">',
      '      <div class="section-heading">',
      '        <h2 class="section-title">Reading Notes & Principles</h2>',
      '        <p class="section-note">' + escapeHtml(safetyCopy.note || '') + '</p>',
      '      </div>',
      '      <div class="grid grid-2 safety-grid">',
      renderSafetyCard('SSC', '安全 / 理性 / 自愿', safetyCopy.ssc),
      renderSafetyCard('RACK', '风险认知下的自愿共识', safetyCopy.rack),
      '      </div>',
      '    </article>',
      '  </section>',
      '  <div class="footer-actions">',
      '    <button type="button" class="btn btn-primary" data-action="restart">Retake Test</button>',
      '    <button type="button" class="btn btn-ghost" data-action="share-result">Share Result</button>',
      '  </div>',
      renderDefinitionModal(data.activeDefinition),
      '</section>'
    ].join('\n');
  }

  return {
    renderIntroScreen: renderIntroScreen,
    renderQuestionScreen: renderQuestionScreen,
    renderResultScreen: renderResultScreen,
  };
});
