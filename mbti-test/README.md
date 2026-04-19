# MBTI人格测试

一个基于Web的MBTI人格测试应用，帮助用户了解自己的人格类型。

## 功能特点

- 16道精心设计的MBTI测试问题
- 实时进度显示
- 详细的人格类型分析
- 包含优势、劣势、职业建议等信息
- 响应式设计，支持移动端
- 结果分享功能

## 测试方法

### 方法1：使用VS Code Live Server扩展（推荐）
1. 在VS Code中安装 "Live Server" 扩展
2. 右键点击 `index.html` 文件
3. 选择 "Open with Live Server"
4. 浏览器将自动打开测试页面

### 方法2：直接在浏览器中打开
1. 双击 `index.html` 文件
2. 在浏览器中打开（推荐使用Chrome或Firefox）

### 方法3：使用本地服务器
如果您有Python环境：
```bash
cd mbti-test
python -m http.server 8000
```
然后在浏览器中访问 `http://localhost:8000`

## 发布到GitHub Pages

### 步骤1：创建GitHub仓库
1. 访问 [GitHub.com](https://github.com)
2. 点击 "New repository"
3. 填写仓库名称（如：mbti-test）
4. 选择公开仓库
5. 点击 "Create repository"

### 步骤2：上传代码
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 步骤3：启用GitHub Pages
1. 在GitHub仓库页面，点击 "Settings"
2. 在左侧菜单中找到 "Pages"
3. 在 "Source" 下拉菜单中选择 "Deploy from a branch"
4. 选择 "main" 分支和 "/ (root)" 文件夹
5. 点击 "Save"
6. 等待几分钟，您的网站将在 `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/` 上线

## 项目结构

```
mbti-test/
├── index.html      # 主页面
├── app.js          # 应用逻辑
├── questions.js    # 测试问题
├── types.js        # 人格类型数据
└── styles.css      # 样式文件
```

## 技术栈

- HTML5
- CSS3
- JavaScript (ES6+)

## 许可证

MIT License