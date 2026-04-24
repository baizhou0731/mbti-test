(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.BDSMQuestions = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  var DIMENSIONS = {
    controlDrive: '控制驱动',
    submissionComfort: '臣服舒适度',
    intensityPreference: '感官强度偏好',
    bondageInterest: '束缚/限制兴趣',
    caregiving: '照料与安抚倾向',
    training: '规则/训练倾向',
    service: '服务与服从倾向',
    primal: '原始追逐倾向',
    humiliationTolerance: '羞辱/降格接受度',
    bratTendency: '捣蛋/反抗倾向',
    vanillaPreference: '稳定平等关系偏好',
    switchFlexibility: '切换弹性'
  };

  var QUESTIONS = [
    { id: 'q01', primaryDimension: 'controlDrive', reverse: false, prompt: '在明确协商后，我更享受由我来决定互动节奏和结构。', weights: { controlDrive: 1, training: 0.4 } },
    { id: 'q02', primaryDimension: 'controlDrive', reverse: false, prompt: '当关系中需要有人先给方向时，我通常愿意站出来主导。', weights: { controlDrive: 1, caregiving: 0.3 } },
    { id: 'q03', primaryDimension: 'controlDrive', reverse: true, prompt: '如果互动开始出现权力差，我往往更希望双方立刻回到完全平等的状态。', weights: { controlDrive: 1, vanillaPreference: 0.5 } },
    { id: 'q04', primaryDimension: 'controlDrive', reverse: false, prompt: '我会自然留意对方的反应，并根据反馈调整我给出的控制感。', weights: { controlDrive: 0.8, caregiving: 0.5 } },

    { id: 'q05', primaryDimension: 'submissionComfort', reverse: false, prompt: '在被清晰引导和尊重边界的前提下，把节奏交给对方会让我放松。', weights: { submissionComfort: 1, caregiving: 0.3 } },
    { id: 'q06', primaryDimension: 'submissionComfort', reverse: false, prompt: '当对方表达稳定而明确的主导感时，我会更容易投入。', weights: { submissionComfort: 1, training: 0.2 } },
    { id: 'q07', primaryDimension: 'submissionComfort', reverse: true, prompt: '即使完全信任对方，我也不喜欢把主动权交出去。', weights: { submissionComfort: 1 } },
    { id: 'q08', primaryDimension: 'submissionComfort', reverse: false, prompt: '我能接受在协商好的范围内按照对方设定的节奏行动。', weights: { submissionComfort: 0.9, service: 0.4 } },

    { id: 'q09', primaryDimension: 'intensityPreference', reverse: false, prompt: '只要边界明确，我会对更强烈、更有张力的体验保持好奇。', weights: { intensityPreference: 1, primal: 0.2 } },
    { id: 'q10', primaryDimension: 'intensityPreference', reverse: false, prompt: '我偏好带有明显心理张力或感官强度的互动。', weights: { intensityPreference: 1, controlDrive: 0.2 } },
    { id: 'q11', primaryDimension: 'intensityPreference', reverse: true, prompt: '我几乎只接受非常轻度、几乎没有刺激起伏的互动。', weights: { intensityPreference: 1, vanillaPreference: 0.4 } },
    { id: 'q12', primaryDimension: 'intensityPreference', reverse: false, prompt: '比起平淡重复，我更容易被层层推进的刺激感吸引。', weights: { intensityPreference: 1, bondageInterest: 0.2 } },

    { id: 'q13', primaryDimension: 'bondageInterest', reverse: false, prompt: '被限制动作或限制选择的设定，会让我觉得更有氛围感。', weights: { bondageInterest: 1, submissionComfort: 0.3 } },
    { id: 'q14', primaryDimension: 'bondageInterest', reverse: false, prompt: '我会对绳索、手铐或其他束缚象征产生兴趣。', weights: { bondageInterest: 1, controlDrive: 0.2 } },
    { id: 'q15', primaryDimension: 'bondageInterest', reverse: true, prompt: '我不喜欢任何会让我失去身体自由度的互动安排。', weights: { bondageInterest: 1, vanillaPreference: 0.3 } },

    { id: 'q16', primaryDimension: 'caregiving', reverse: false, prompt: '不论偏主导还是偏顺从，我都很在意互动后的安抚与照顾。', weights: { caregiving: 1, vanillaPreference: 0.2 } },
    { id: 'q17', primaryDimension: 'caregiving', reverse: false, prompt: '我会把安全感、情绪承接和稳定反馈看得很重要。', weights: { caregiving: 1, service: 0.2 } },
    { id: 'q18', primaryDimension: 'caregiving', reverse: true, prompt: '只要气氛够强，我并不在意互动是否有温柔或照料的成分。', weights: { caregiving: 1, intensityPreference: 0.3 } },
    { id: 'q19', primaryDimension: 'caregiving', reverse: false, prompt: '对我来说，关系中的信任感常常来自持续的体贴与回应。', weights: { caregiving: 1, submissionComfort: 0.2 } },

    { id: 'q20', primaryDimension: 'training', reverse: false, prompt: '我会被规则、任务、奖惩或阶段性目标这类结构吸引。', weights: { training: 1, controlDrive: 0.3 } },
    { id: 'q21', primaryDimension: 'training', reverse: false, prompt: '明确的规矩会让我更容易进入状态。', weights: { training: 1, service: 0.2 } },
    { id: 'q22', primaryDimension: 'training', reverse: true, prompt: '我不喜欢任何需要遵守流程、规则或仪式感的互动方式。', weights: { training: 1, vanillaPreference: 0.2 } },
    { id: 'q23', primaryDimension: 'training', reverse: false, prompt: '比起随性发挥，我更欣赏有层次和递进感的安排。', weights: { training: 1, controlDrive: 0.2 } },

    { id: 'q24', primaryDimension: 'service', reverse: false, prompt: '通过完成对方交代的事来表达投入，会让我有满足感。', weights: { service: 1, submissionComfort: 0.3 } },
    { id: 'q25', primaryDimension: 'service', reverse: false, prompt: '我会把体察需求、配合安排视作一种重要的关系表达。', weights: { service: 1, caregiving: 0.3 } },
    { id: 'q26', primaryDimension: 'service', reverse: true, prompt: '我不喜欢带有职责、服务或服从意味的互动框架。', weights: { service: 1, vanillaPreference: 0.2 } },
    { id: 'q27', primaryDimension: 'service', reverse: false, prompt: '如果规则清晰，我愿意通过执行和完成来建立连接。', weights: { service: 1, training: 0.4 } },

    { id: 'q28', primaryDimension: 'primal', reverse: false, prompt: '直接、本能、带追逐感的互动会让我更有反应。', weights: { primal: 1, intensityPreference: 0.3 } },
    { id: 'q29', primaryDimension: 'primal', reverse: false, prompt: '比起讲究仪式，我有时更偏好顺着当下气场推进的互动。', weights: { primal: 1, switchFlexibility: 0.2 } },
    { id: 'q30', primaryDimension: 'primal', reverse: true, prompt: '我不喜欢任何偏野性、追逐或本能驱动的氛围。', weights: { primal: 1, vanillaPreference: 0.2 } },

    { id: 'q31', primaryDimension: 'humiliationTolerance', reverse: false, prompt: '在充分协商下，带有轻度羞耻或降格意味的语言张力会引起我的好奇。', weights: { humiliationTolerance: 1, intensityPreference: 0.2 } },
    { id: 'q32', primaryDimension: 'humiliationTolerance', reverse: false, prompt: '如果边界事先说清，我能接受带有一点点冒犯感的角色张力。', weights: { humiliationTolerance: 1, submissionComfort: 0.2 } },
    { id: 'q33', primaryDimension: 'humiliationTolerance', reverse: true, prompt: '任何带有羞辱、贬低或降格感的表达都会让我立即失去兴趣。', weights: { humiliationTolerance: 1 } },

    { id: 'q34', primaryDimension: 'bratTendency', reverse: false, prompt: '我有时会故意试探、逗弄或轻微挑衅，来增加互动火花。', weights: { bratTendency: 1, switchFlexibility: 0.2 } },
    { id: 'q35', primaryDimension: 'bratTendency', reverse: false, prompt: '对我来说，适度反抗或嘴硬本身就是互动乐趣的一部分。', weights: { bratTendency: 1, submissionComfort: 0.2 } },
    { id: 'q36', primaryDimension: 'bratTendency', reverse: true, prompt: '我更喜欢完全顺滑、毫无试探感的互动，不喜欢任何挑衅成分。', weights: { bratTendency: 1, vanillaPreference: 0.2 } },

    { id: 'q37', primaryDimension: 'vanillaPreference', reverse: false, prompt: '我通常更喜欢平等、温和、几乎不涉及权力交换的亲密关系。', weights: { vanillaPreference: 1, caregiving: 0.2 } },
    { id: 'q38', primaryDimension: 'vanillaPreference', reverse: false, prompt: '对我来说，稳定舒适往往比强烈刺激更重要。', weights: { vanillaPreference: 1, caregiving: 0.2 } },
    { id: 'q39', primaryDimension: 'vanillaPreference', reverse: true, prompt: '即使没有明显的权力差或特殊设定，我也很难对互动保持兴趣。', weights: { vanillaPreference: 1, intensityPreference: 0.3 } },

    { id: 'q40', primaryDimension: 'switchFlexibility', reverse: false, prompt: '不同关系阶段里，我可以自在地在主导与配合之间切换。', weights: { switchFlexibility: 1, controlDrive: 0.2, submissionComfort: 0.2 } },
    { id: 'q41', primaryDimension: 'switchFlexibility', reverse: false, prompt: '我并不强求自己固定在某一侧，情境和对象会影响我的状态。', weights: { switchFlexibility: 1, primal: 0.2 } },
    { id: 'q42', primaryDimension: 'switchFlexibility', reverse: true, prompt: '一旦进入某种角色，我很难接受自己在别的情境里换到另一边。', weights: { switchFlexibility: 1 } }
  ];

  return {
    DIMENSIONS: DIMENSIONS,
    QUESTIONS: QUESTIONS
  };
});
