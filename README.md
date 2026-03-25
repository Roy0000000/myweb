# 西风的个人网站

这是一个可直接上传到 GitHub 并连接 Netlify 的静态个人网站。

## 已包含内容

- 个人介绍
- 作品集展示
- 诗歌与小说栏目
- 课程笔记免费下载
- 适合 Netlify 的静态站结构

## 本地预览

在项目目录运行：

```bash
python3 -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

## 上传 GitHub

```bash
git init
git add .
git commit -m "Initial personal website"
git branch -M main
git remote add origin 你的GitHub仓库地址
git push -u origin main
```

## 连接 Netlify

1. 登录 Netlify
2. 选择 `Add new project`
3. 选择 `Import an existing project`
4. 连接 GitHub
5. 选择这个仓库
6. 直接部署

这个项目已经是静态站，Netlify 会直接发布当前目录。

## 你最可能会改的地方

- `index.html`：基础结构和联系方式
- `styles.css`：颜色、排版、动效
- `script.js`：作品、诗歌、小说、笔记列表数据
- `downloads/`：替换成你自己的笔记文件
