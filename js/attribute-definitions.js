(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.BDSMAttributeDefinitions = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function createDefinition(en, cn, desc, high, low, note) {
    return {
      en: en,
      cn: cn,
      desc: desc,
      high: high,
      low: low,
      note: note,
    };
  }

  var ROLE_DEFINITIONS = {
    sado: createDefinition(
      'Sado',
      '萨德',
      '更容易从施加强度、制造张力或掌握互动节奏中获得心理满足。',
      '高分时通常更偏好主动设置挑战、强度或心理压迫感。',
      '低分时通常不会把施加强度作为主要兴趣来源。',
      '高分不代表忽视照顾或边界，任何强度都需要成年人前提下的协商与反馈。'
    ),
    maso: createDefinition(
      'Maso',
      '马索',
      '更容易从承受强度、体验压力或在安全框架中面对张力获得投入感。',
      '高分时通常更能接受在明确边界下体验强度、限制或心理压力。',
      '低分时通常更偏好低强度、可控和节奏温和的互动。',
      '高分不等于越强越好，舒适度、事前协商和退出机制仍然优先。'
    ),
    switch: createDefinition(
      'Switch',
      '双向',
      '在不同关系、时机或互动框架中，既能适应主导位置，也能适应顺从位置。',
      '高分时通常具备较高切换弹性，能根据对象、节奏与信任感调整角色位置。',
      '低分时通常更偏好较稳定的单一互动位置，不代表保守，只是更明确。',
      '双向不是“摇摆不定”，而是在边界清楚的前提下拥有更高角色适应度。'
    ),
    dom: createDefinition(
      'Dom',
      '主导',
      '更倾向主动设定节奏、发出引导，并在互动中承担结构与方向感。',
      '高分时通常更愿意承担决策、安排规则、观察反馈与维护整体节奏。',
      '低分时通常不会把带领他人或主导流程作为主要舒适区。',
      '主导不是单纯控制，更包含照顾、责任、沟通和对边界的持续确认。'
    ),
    sub: createDefinition(
      'Sub',
      '顺从',
      '对交付部分控制权、接受引导和在关系中响应对方节奏感到更自在。',
      '高分时通常更容易在清晰边界下进入顺从位置，关注回应、信任与投入感。',
      '低分时通常更偏向保留更多主动权，或只在特定条件下进入顺从位置。',
      '高分不代表放弃协商，顺从依然建立在成年、知情、自愿与可撤回的同意上。'
    ),
    vanilla: createDefinition(
      'Vanilla',
      '香草',
      '更偏好平等、温和、低强度和关系导向的互动方式。',
      '高分时通常会更重视舒适、亲密、平衡感与循序渐进的靠近。',
      '低分时通常说明你对更鲜明的结构、分工或强度更开放。',
      '香草不是“无趣”，而是对平等、安全、低压力连接的清晰偏好。'
    ),
  };

  var DOMINANT_IDENTITY_DEFINITIONS = {
    dominant: createDefinition(
      'Dominant',
      '支配者',
      '偏好在互动中承担主导责任，设定方向、节奏与角色分工。',
      '高分时通常更自然地进入带领、判断与组织位置。',
      '低分时通常更少把主导当作首选互动方式。',
      '支配感若缺少协商与照顾，就会偏离健康关系框架。'
    ),
    caregiver: createDefinition(
      'Caregiver',
      '照料者',
      '偏好把照顾、安抚、稳定感与节奏管理结合在一起。',
      '高分时通常会把情绪接住、状态确认与安全感经营看得很重要。',
      '低分时通常更少把照顾本身当作互动核心。',
      '照料不等于替对方决定一切，好的照料仍然需要双向反馈。'
    ),
    degrader: createDefinition(
      'Degrader',
      '贬低者',
      '对身份落差、羞耻张力或语言上的降格结构更敏感。',
      '高分时通常更容易被权力落差与心理压迫感吸引。',
      '低分时通常更少把贬低感或身份压低当作兴趣点。',
      '这类结构对信任和边界要求更高，必须先明确禁区与事后修复方式。'
    ),
    binder: createDefinition(
      'Binder',
      '束缚者',
      '偏好通过限制动作、固定姿态或结构化束缚来建立张力。',
      '高分时通常会把限制感和结构感视为重要体验来源。',
      '低分时通常不会把束缚当成主要偏好。',
      '任何限制类玩法都要提前确认安全词、时长、身体状态与即时退出机制。'
    ),
    primalHunter: createDefinition(
      'Primal Hunter',
      '原始猎手',
      '更容易被本能感、追逐感和直接张力驱动的互动吸引。',
      '高分时通常偏好更直接、更少脚本感的能量碰撞。',
      '低分时通常更喜欢规则清楚、结构稳定的互动氛围。',
      '原始感并不意味着放弃沟通，反而更需要在开始前把边界说清楚。'
    ),
    trainer: createDefinition(
      'Trainer',
      '训练师',
      '偏好通过规则、反馈、目标与过程设计来建立互动秩序。',
      '高分时通常更愿意制定流程、强化反馈并推动成长感。',
      '低分时通常不太把规则塑造当成主要投入点。',
      '训练结构最容易被误解成单向要求，持续沟通和同意更新很关键。'
    ),
    tamer: createDefinition(
      'Tamer',
      '驯兽师',
      '偏好在依附感、规则感和照料感之间建立可控又有亲密度的结构。',
      '高分时通常会把关系中的温顺、靠近与管理结合起来理解。',
      '低分时通常较少偏好这类带有陪伴与调教意味的结构。',
      '拟人化角色偏好不应脱离现实边界，成年人、知情与协商仍然是前提。'
    ),
    owner: createDefinition(
      'Owner',
      '主人',
      '更重视关系归属感、持续照看与较长线的角色定位。',
      '高分时通常偏好稳定、明确、持续的关系结构。',
      '低分时通常更偏好轻量、阶段性或场景化互动。',
      '归属感表达越强，越要清楚地处理现实边界、责任与退出条件。'
    ),
    sadist: createDefinition(
      'Sadist',
      '萨德',
      '支配组中更偏向从施加强度与张力中获得满足的一支。',
      '高分时通常对张力、压迫感和可控强度更敏感。',
      '低分时通常不会把强度施加作为主导风格。',
      '高分不等于忽视安全，越高强度越需要成熟的风控与复盘。'
    ),
  };

  var SUBMISSIVE_IDENTITY_DEFINITIONS = {
    submissive: createDefinition(
      'Submissive',
      '顺从者',
      '更容易在被引导、被安排和明确角色分工中获得投入感。',
      '高分时通常更愿意响应他人节奏，并在明确边界下进入顺从位置。',
      '低分时通常更少把服从或被引导当作舒适区。',
      '顺从感并不意味着被动失声，真实关系里依旧需要主动表达边界。'
    ),
    little: createDefinition(
      'Little',
      '小人儿',
      '偏好被照顾、被包容和在较柔软的关系结构里获得安全感。',
      '高分时通常对被安抚、被接住和被耐心回应更有共鸣。',
      '低分时通常较少把这种依附与照料结构当作核心偏好。',
      '这类偏好更需要温和沟通，不应把拟人角色代替现实中的成人协商。'
    ),
    degraded: createDefinition(
      'Degraded',
      '降格者',
      '对身份被压低、羞耻张力或地位落差结构更敏感。',
      '高分时通常更容易在明确安全框架里接受地位下沉的张力。',
      '低分时通常较少把这类体验视为投入来源。',
      '涉及羞耻和降格时，事前禁区确认与事后安抚尤其重要。'
    ),
    bound: createDefinition(
      'Bound',
      '受缚者',
      '更容易从被限制、被固定和动作自由度下降中感到投入。',
      '高分时通常会把束缚感、无法随意移动的状态视作重要体验。',
      '低分时通常更偏好保持行动自由和即时调整空间。',
      '被限制类互动必须提前确认身体状态、时长与安全信号。'
    ),
    primalPrey: createDefinition(
      'Primal Prey',
      '原始猎物',
      '更容易被追逐、捕获和本能驱动的紧张感所吸引。',
      '高分时通常偏好更直接、更少脚本感的投入方式。',
      '低分时通常更偏好规则明确、过程可预测的结构。',
      '原始感越强，越需要把停止条件和现实边界提前讲清楚。'
    ),
    brat: createDefinition(
      'Brat',
      '捣蛋鬼',
      '喜欢在关系里保留挑衅、逗弄或轻微反抗的空间。',
      '高分时通常会通过嘴硬、试探或轻度唱反调来增加互动火花。',
      '低分时通常更少通过反差与挑衅建立连接。',
      '反抗感最怕误解，只有在双方都把它视作互动语言时才成立。'
    ),
    pet: createDefinition(
      'Pet',
      '宠物',
      '偏好在依附、陪伴、被照看和角色感中体验亲密与放松。',
      '高分时通常会对被命名、被照看和被温和管理更有共鸣。',
      '低分时通常较少偏好这类依附型角色结构。',
      '任何宠物化表达都应停留在成年人之间的自愿角色扮演，不替代现实人格。'
    ),
    servant: createDefinition(
      'Servant',
      '仆人',
      '更容易从服务、执行和满足明确要求中获得稳定感与价值感。',
      '高分时通常在任务感、秩序感和回应需求中更容易投入。',
      '低分时通常不会把服务导向视为主要满足来源。',
      '服务感并不意味着无限度付出，边界、能力和现实条件都需要被尊重。'
    ),
    masochist: createDefinition(
      'Masochist',
      '马索克',
      '顺从组中更偏向通过承受强度、压力与挑战感获得投入的一支。',
      '高分时通常对可控强度、张力和限制更开放。',
      '低分时通常更偏好低强度和更温和的关系推进。',
      '强度偏好需要循序渐进地验证，绝不应跳过风险沟通与安全检查。'
    ),
  };

  var STYLE_LABELS = {
    caregivingStyle: { en: 'Caregiving', cn: '照料型' },
    structuredStyle: { en: 'Structured', cn: '规则型' },
    bondageExplorerStyle: { en: 'Bondage Explorer', cn: '束缚探索型' },
    primalStyle: { en: 'Primal', cn: '原始互动型' },
    serviceStyle: { en: 'Service', cn: '服务导向型' },
    brattyContrastStyle: { en: 'Brat Contrast', cn: '反差挑衅型' },
    ritualStyle: { en: 'Ritual', cn: '仪式感型' },
    gentleVanillaStyle: { en: 'Gentle', cn: '低强度慢热型' },
  };

  var INSIGHT_CARD_TITLES = [
    { en: 'Primary Reading', cn: '主要倾向' },
    { en: 'Interaction Style', cn: '互动风格' },
    { en: 'Balance & Boundary', cn: '平衡与边界' },
  ];

  var PERSONA_PROFILES = [
    {
      slug: 'rabbit',
      nameCn: '雾原白兔',
      nameEn: 'Rabbit Attuner',
      assetPath: 'assets/personas/rabbit.svg',
      accent: 'rabbit',
      roleHints: ['sub', 'vanilla'],
      tagHints: ['serviceStyle', 'gentleVanillaStyle', 'caregivingStyle'],
      statement: '温和、稳定、服务导向',
      description: '你更可能在温和、可预期、边界清晰的互动里逐步建立信任，并通过回应、照看与稳定节奏来形成连接。'
    },
    {
      slug: 'fox',
      nameCn: '暮林赤狐',
      nameEn: 'Fox Strategist',
      assetPath: 'assets/personas/fox.svg',
      accent: 'fox',
      roleHints: ['switch', 'dom'],
      tagHints: ['structuredStyle', 'bondageExplorerStyle', 'ritualStyle'],
      statement: '敏锐、策略、探索',
      description: '你往往擅长观察反馈、切换角度并迅速调整互动策略，既重视结构，也保留灵活度和试探空间。'
    },
    {
      slug: 'panther',
      nameCn: '黑曜黑豹',
      nameEn: 'Panther Sovereign',
      assetPath: 'assets/personas/panther.svg',
      accent: 'panther',
      roleHints: ['dom', 'sado'],
      tagHints: ['structuredStyle', 'ritualStyle', 'bondageExplorerStyle'],
      statement: '冷静、掌控、神秘',
      description: '你更容易在清晰边界和成熟协商里展现稳定掌控感，偏好把节奏、气场与结构感收拢到自己手里。'
    },
    {
      slug: 'wolf',
      nameCn: '峭壁夜狼',
      nameEn: 'Wolf Vanguard',
      assetPath: 'assets/personas/wolf.svg',
      accent: 'wolf',
      roleHints: ['dom', 'sado'],
      tagHints: ['primalStyle', 'structuredStyle'],
      statement: '强势、清晰、主导感',
      description: '你更可能偏好直接、明确、边界感强的互动能量，擅长在张力和本能驱动里维持方向感。'
    },
    {
      slug: 'cat',
      nameCn: '月影灵猫',
      nameEn: 'Cat Arbiter',
      assetPath: 'assets/personas/cat.svg',
      accent: 'cat',
      roleHints: ['switch', 'sado'],
      tagHints: ['brattyContrastStyle', 'bondageExplorerStyle'],
      statement: '独立、优雅、选择性亲近',
      description: '你通常保留明显的自主感，偏好在选择权、审美感和轻微反差里建立吸引力，不会轻易进入单一位置。'
    },
    {
      slug: 'deer',
      nameCn: '琥珀小鹿',
      nameEn: 'Deer Harmonist',
      assetPath: 'assets/personas/deer.svg',
      accent: 'deer',
      roleHints: ['vanilla', 'sub'],
      tagHints: ['gentleVanillaStyle', 'caregivingStyle', 'serviceStyle'],
      statement: '敏感、柔和、关系导向',
      description: '你更看重安全感、情绪同步和关系氛围，倾向在缓慢、细腻、尊重感强的环境里逐渐打开自己。'
    },
  ];

  function getDefinition(group, key) {
    var maps = {
      roles: ROLE_DEFINITIONS,
      dominant: DOMINANT_IDENTITY_DEFINITIONS,
      submissive: SUBMISSIVE_IDENTITY_DEFINITIONS,
    };
    var targetGroup = maps[group];

    if (!targetGroup || !Object.prototype.hasOwnProperty.call(targetGroup, key)) {
      return null;
    }

    return targetGroup[key];
  }

  return {
    ROLE_DEFINITIONS: ROLE_DEFINITIONS,
    DOMINANT_IDENTITY_DEFINITIONS: DOMINANT_IDENTITY_DEFINITIONS,
    SUBMISSIVE_IDENTITY_DEFINITIONS: SUBMISSIVE_IDENTITY_DEFINITIONS,
    STYLE_LABELS: STYLE_LABELS,
    INSIGHT_CARD_TITLES: INSIGHT_CARD_TITLES,
    PERSONA_PROFILES: PERSONA_PROFILES,
    getDefinition: getDefinition,
  };
});
