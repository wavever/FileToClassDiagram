# Code2UML

一个基于Web的工具，可以将Java/Kotlin代码转换为UML类图。

## 功能特点

- 支持上传Java和Kotlin源代码文件
- 自动分析代码中的类关系
- 生成Mermaid格式的UML类图代码
- 实时预览UML类图
- 支持部署到Vercel平台

## 开发环境设置

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm start
```

3. 构建生产版本：
```bash
npm run build
```

## 部署到Vercel

1. 安装Vercel CLI：
```bash
npm i -g vercel
```

2. 登录Vercel：
```bash
vercel login
```

3. 部署项目：
```bash
vercel
```

## 使用说明

1. 打开网页后，可以看到左侧的文件上传区域
2. 将Java或Kotlin文件拖放到上传区域，或点击选择文件
3. 上传的文件会显示在文件列表中
4. 点击"Sync"按钮，系统会自动分析代码并生成UML类图
5. 在Code标签页可以查看生成的Mermaid代码
6. 右侧面板会实时显示生成的UML类图

## 技术栈

- React
- TypeScript
- Tailwind CSS
- Mermaid.js
- Headless UI
