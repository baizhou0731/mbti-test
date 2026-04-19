// 应用主逻辑
let currentQuestion = 1;
const totalQuestions = getTotalQuestions();
let answers = {}; // 存储答案

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    document.getElementById('totalQuestions').textContent = totalQuestions;
}

// 开始测试
function startTest() {
    showPage('testPage');
    currentQuestion = 1;
    answers = {};
    loadQuestion();
}

// 加载问题
function loadQuestion() {
    const question = getQuestion(currentQuestion);
    
    // 更新进度
    document.getElementById('currentQuestion').textContent = currentQuestion;
    const progress = (currentQuestion / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    
    // 显示问题文本
    document.getElementById('questionText').textContent = question.text;
    
    // 渲染选项
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option.text;
        optionDiv.onclick = () => selectOption(index, option.scale);
        
        // 如果已有答案，显示已选状态
        if (answers[currentQuestion] !== undefined && answers[currentQuestion].index === index) {
            optionDiv.classList.add('selected');
        }
        
        optionsContainer.appendChild(optionDiv);
    });
    
    // 更新按钮显示
    updateButtonsVisibility();
}

// 选择选项
function selectOption(index, scale) {
    answers[currentQuestion] = { index: index, scale: scale };
    
    // 更新UI显示
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected'));
    options[index].classList.add('selected');
}

// 更新按钮可见性
function updateButtonsVisibility() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (currentQuestion === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
    }
    
    if (currentQuestion === totalQuestions) {
        nextBtn.textContent = '查看结果';
    } else {
        nextBtn.textContent = '下一题';
    }
}

// 下一题
function nextQuestion() {
    // 检查是否已选择
    if (answers[currentQuestion] === undefined) {
        alert('请先选择一个答案');
        return;
    }
    
    if (currentQuestion < totalQuestions) {
        currentQuestion++;
        loadQuestion();
        // 滚动到顶部
        document.querySelector('.test-container').scrollTop = 0;
    } else {
        // 完成测试
        completeTest();
    }
}

// 上一题
function previousQuestion() {
    if (currentQuestion > 1) {
        currentQuestion--;
        loadQuestion();
        document.querySelector('.test-container').scrollTop = 0;
    }
}

// 完成测试
function completeTest() {
    // 计算结果
    const result = calculateResult();
    showResult(result);
}

// 计算结果
function calculateResult() {
    const scales = {
        E: 0, I: 0,
        S: 0, N: 0,
        T: 0, F: 0,
        J: 0, P: 0
    };
    
    // 统计各个维度的得分
    for (let i = 1; i <= totalQuestions; i++) {
        const scale = answers[i].scale;
        scales[scale]++;
    }
    
    // 确定类型
    let type = '';
    type += scales['E'] > scales['I'] ? 'E' : 'I';
    type += scales['S'] > scales['N'] ? 'S' : 'N';
    type += scales['T'] > scales['F'] ? 'T' : 'F';
    type += scales['J'] > scales['P'] ? 'J' : 'P';
    
    return type;
}

// 显示结果
function showResult(type) {
    const typeInfo = getTypeInfo(type);
    
    // 设置标题和类型
    document.getElementById('typeTitle').textContent = typeInfo.fullName;
    document.getElementById('typeBadge').innerHTML = `<span>${type}</span>`;
    
    // 设置描述
    document.getElementById('typeDesc').textContent = typeInfo.description;
    
    // 设置优势
    const strengthsList = document.getElementById('strengths');
    strengthsList.innerHTML = '';
    typeInfo.strengths.forEach(strength => {
        const li = document.createElement('li');
        li.textContent = strength;
        strengthsList.appendChild(li);
    });
    
    // 设置劣势
    const weaknessesList = document.getElementById('weaknesses');
    weaknessesList.innerHTML = '';
    typeInfo.weaknesses.forEach(weakness => {
        const li = document.createElement('li');
        li.textContent = weakness;
        weaknessesList.appendChild(li);
    });
    
    // 设置职业
    const careersList = document.getElementById('careers');
    careersList.innerHTML = '';
    typeInfo.careers.forEach(career => {
        const li = document.createElement('li');
        li.textContent = career;
        careersList.appendChild(li);
    });
    
    // 设置关系
    document.getElementById('relationships').textContent = typeInfo.relationships;
    
    // 显示结果页面
    showPage('resultPage');
}

// 分享结果
function shareResult() {
    const typeInfo = getTypeInfo(calculateResult());
    const shareText = `我的MBTI人格类型是：${typeInfo.fullName}\n${typeInfo.description}\n\n来测试你的MBTI人格类型吧！`;
    
    // 如果支持分享API
    if (navigator.share) {
        navigator.share({
            title: 'MBTI人格测试',
            text: shareText,
            url: window.location.href
        }).catch(err => console.log('分享失败:', err));
    } else {
        // 降级方案：复制到剪贴板
        const fullText = shareText + '\n\n' + window.location.href;
        navigator.clipboard.writeText(fullText).then(() => {
            alert('结果已复制到剪贴板，可分享给朋友！');
        });
    }
}

// 重新测试
function retakeTest() {
    showPage('welcomePage');
    currentQuestion = 1;
    answers = {};
}

// 页面切换
function showPage(pageName) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示指定页面
    document.getElementById(pageName).classList.add('active');
    
    // 滚动到顶部
    window.scrollTo(0, 0);
}
