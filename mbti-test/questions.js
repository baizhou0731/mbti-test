// MBTI测试问题库
const questions = [
    {
        id: 1,
        text: "在社交场合中，你更倾向于：",
        options: [
            { text: "主动与他人交谈，成为焦点", scale: "E" },
            { text: "倾听他人，观察周围环境", scale: "I" }
        ]
    },
    {
        id: 2,
        text: "你更关注：",
        options: [
            { text: "事物的具体细节和现实情况", scale: "S" },
            { text: "事物的整体意义和可能性", scale: "N" }
        ]
    },
    {
        id: 3,
        text: "在做决定时，你更依赖：",
        options: [
            { text: "逻辑分析和客观事实", scale: "T" },
            { text: "个人价值观和他人感受", scale: "F" }
        ]
    },
    {
        id: 4,
        text: "你对生活的态度是：",
        options: [
            { text: "有计划、有条理、喜欢按部就班", scale: "J" },
            { text: "灵活变通、开放、喜欢随机应变", scale: "P" }
        ]
    },
    {
        id: 5,
        text: "周末你更喜欢：",
        options: [
            { text: "参加聚会和社交活动", scale: "E" },
            { text: "独处或与亲密的人在一起", scale: "I" }
        ]
    },
    {
        id: 6,
        text: "学习新知识时，你更喜欢：",
        options: [
            { text: "通过实际例子和具体步骤", scale: "S" },
            { text: "通过理论框架和概念思考", scale: "N" }
        ]
    },
    {
        id: 7,
        text: "在解决冲突时，你倾向于：",
        options: [
            { text: "基于事实和逻辑分析问题", scale: "T" },
            { text: "考虑相关人员的感受和影响", scale: "F" }
        ]
    },
    {
        id: 8,
        text: "你的工作风格是：",
        options: [
            { text: "规划周密，按时完成，避免仓促", scale: "J" },
            { text: "灵活调整，喜欢在最后期限前完成", scale: "P" }
        ]
    },
    {
        id: 9,
        text: "在陌生环境中，你倾向于：",
        options: [
            { text: "快速融入，认识更多人", scale: "E" },
            { text: "先观察，再逐步适应", scale: "I" }
        ]
    },
    {
        id: 10,
        text: "你更欣赏的是：",
        options: [
            { text: "传统、经过验证的方法", scale: "S" },
            { text: "创新、独特的想法和方法", scale: "N" }
        ]
    },
    {
        id: 11,
        text: "当收到批评时，你更在意：",
        options: [
            { text: "批评的准确性和客观性", scale: "T" },
            { text: "批评对方的态度和初衷", scale: "F" }
        ]
    },
    {
        id: 12,
        text: "你的生活节奏通常是：",
        options: [
            { text: "有序、结构清晰、目标明确", scale: "J" },
            { text: "随意、灵活、根据情况调整", scale: "P" }
        ]
    },
    {
        id: 13,
        text: "参加活动后，你会感到：",
        options: [
            { text: "精力充沛，想继续社交", scale: "E" },
            { text: "需要独处时间来恢复精力", scale: "I" }
        ]
    },
    {
        id: 14,
        text: "处理问题时，你倾向于：",
        options: [
            { text: "看重事情本身，重视效率", scale: "T" },
            { text: "看重人际关系，重视和谐", scale: "F" }
        ]
    },
    {
        id: 15,
        text: "你对未来的规划是：",
        options: [
            { text: "详细的、有具体步骤的", scale: "J" },
            { text: "模糊的、保持选择余地的", scale: "P" }
        ]
    },
    {
        id: 16,
        text: "你更欣赏的人是那些：",
        options: [
            { text: "脚踏实地、靠谱、注重细节", scale: "S" },
            { text: "富有想象力、有远见、充满激情", scale: "N" }
        ]
    }
];

// 获取问题
function getQuestion(id) {
    return questions.find(q => q.id === id);
}

// 获取总题数
function getTotalQuestions() {
    return questions.length;
}
