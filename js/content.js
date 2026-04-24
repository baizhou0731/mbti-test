(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.BDSMContent = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  var SCALE_OPTIONS = [
    '非常不同意',
    '不同意',
    '略不同意',
    '略同意',
    '同意',
    '非常同意'
  ];

  var INTRO_COPY = {
    eyebrow: '18+ relationship dynamics assessment',
    title: 'BDSM 属性倾向测试',
    description: '42 道题，约 6-8 分钟完成。结果基于题目权重生成，只用于自我理解与沟通参考，不构成心理、医学或临床诊断。',
    bullets: [
      '仅面向成年人，强调知情、自愿与协商',
      '所有结果在本地浏览器计算，不上传数据',
      '结果页附带 SSC / RACK 安全原则提示'
    ]
  };

  var SAFETY_COPY = {
    note: '本测试展示的是倾向性画像，不是固定身份认证。任何互动都应建立在成年人前提、知情同意、明确边界、可撤回机制和事后复盘之上。',
    ssc: [
      {
        title: 'Safe',
        body: '安全。尽量降低不必要风险，提前确认边界、环境、身体状态与退出方式。'
      },
      {
        title: 'Sane',
        body: '理性。保持清醒判断和信息透明，不在模糊、受压或无法评估后果的状态下推进。'
      },
      {
        title: 'Consensual',
        body: '自愿。所有参与方都要明确表达同意，并知道自己有权随时暂停、修改或终止。'
      }
    ],
    rack: [
      {
        title: 'Risk-Aware',
        body: '风险认知。承认互动可能包含真实风险，并在开始前把它们说清楚、想明白。'
      },
      {
        title: 'Consensual',
        body: '自愿共识。共识不是一次性确认，而是过程中的持续沟通、确认与更新。'
      },
      {
        title: 'Kink',
        body: '偏好本身不能代替责任。越是特殊结构，越需要边界、信任、退出机制和事后修复。'
      }
    ]
  };

  var RESULT_ANALYSIS_COPY = {
    defaults: {
      primaryRoleLabel: 'switch',
      primaryRoleValue: 0,
      readableTags: 'structuredStyle',
      dominantLead: 'dominant',
      submissiveLead: 'submissive'
    },
    primaryRole: function (primaryRole, primaryRoleValue, readableRole) {
      return '当前结果在 ' + readableRole + ' 维度约为 ' + primaryRoleValue
        + '%。这说明你更可能被与这一位置相关的节奏、分工与心理张力所吸引，但真实表现仍会受到对象、信任程度和沟通质量影响。';
    },
    interaction: function (readableTags, dominantLead, submissiveLead) {
      return '从风格标签看，你更容易被 ' + readableTags
        + ' 这类结构吸引。进一步拆分时，你在支配组里更接近 ' + dominantLead
        + '，在顺从组里更接近 ' + submissiveLead + '；比起追求某个标签，更适合先确认边界和节奏，再决定如何分配主动与回应。';
    },
    safety: '无论分数如何，成年人前提、知情同意、清楚边界、退出机制与事后复盘都比任何标签更重要。测试结果只能帮助你整理偏好，不能替代现实中的沟通、风险评估与相互照顾。'
  };

  return {
    SCALE_OPTIONS: SCALE_OPTIONS,
    INTRO_COPY: INTRO_COPY,
    SAFETY_COPY: SAFETY_COPY,
    RESULT_ANALYSIS_COPY: RESULT_ANALYSIS_COPY
  };
});
