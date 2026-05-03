# 智擎 PreFounder · 全球部署指引

> 项目已准备就绪，按以下任一方式部署到全球 CDN，**1 分钟内即可让全世界访问**。

---

## 方案 A · Vercel CLI（最快 · 推荐）

Vercel 是 Next.js 官方平台，支持全球 270+ 边缘节点、自动 HTTPS、永久免费起步。

```bash
cd zhiqing-platform

# 1. 安装 Vercel CLI（仅首次）
npm i -g vercel

# 2. 一键部署到生产
vercel --prod
```

**首次会引导你完成 4 个交互步骤：**

1. `Set up and deploy "zhiqing-platform"?` → 直接回车（Yes）
2. `Which scope do you want to deploy to?` → 选择你的账号（GitHub 邮箱即可登录）
3. `Link to existing project?` → 输入 `n`
4. `What's your project's name?` → 直接回车，使用 `zhiqing-platform`
5. `In which directory is your code located?` → 直接回车 `./`

完成后终端会输出：

```text
✅  Production: https://zhiqing-platform-xxxx.vercel.app   [刚刚]
```

打开这个 URL —— **全世界任何人**现在都能访问了。

---

## 方案 B · Vercel + GitHub（推荐长期协作）

适合后续多人协作、CI/CD、版本管理。

```bash
# 1. 初始化 git
cd zhiqing-platform
git init
git add .
git commit -m "feat: initial commit · ZhiQing PreFounder platform"

# 2. 在 GitHub 上新建 private 仓库 zhiqing-platform，然后：
git remote add origin https://github.com/<你的账号>/zhiqing-platform.git
git branch -M main
git push -u origin main

# 3. 打开 https://vercel.com/new
#    - 用 GitHub 登录
#    - "Import Git Repository" → 选择 zhiqing-platform
#    - Framework Preset 自动识别为 Next.js
#    - 直接点 "Deploy"
```

之后每次 `git push` 都会自动重新部署到 vercel.app 与你绑定的自定义域名（如有）。

---

## 方案 C · Cloudflare Pages（同样优秀，免费额度更大）

```bash
# 1. 安装 Wrangler
npm i -g wrangler

# 2. 登录
wrangler login   # 浏览器自动打开 Cloudflare 授权页

# 3. 一键部署
wrangler pages deploy .next/static --project-name zhiqing-platform
```

如选 Cloudflare Pages 长期方案，建议改用 GitHub 集成（同方案 B 流程）。

---

## 方案 D · 自定义域名（可选 · 让访问更专业）

部署成功后，假如你想用 `zhiqing.ai` 而不是 `xxxx.vercel.app`：

1. 在 Vercel 项目 → Settings → Domains 添加 `zhiqing.ai`
2. 按提示在你的域名 DNS（阿里云/Cloudflare/Namecheap 等）添加 A 或 CNAME 记录
3. 5–30 分钟内自动签发 SSL 证书

---

## 部署前检查清单

- [x] `npm run build` 已通过（32 页静态化）
- [x] `python models/run_all.py` 已生成 9 个 JSON
- [x] `data/*.json` 已检入仓库（生产环境直接读取）
- [x] `vercel.json` 已配置 region (sin1/hnd1/sfo1) 与缓存头
- [x] `.gitignore` 已排除 node_modules / .next / *.log
- [x] favicon.svg / sitemap.xml / robots.txt 全部静态生成
- [x] Open Graph 元数据 + Twitter Card 已嵌入 layout

---

## 部署后验证

```bash
# 替换为你的 Vercel URL
$URL = "https://zhiqing-platform-xxxx.vercel.app"

curl -o /dev/null -w "%{http_code}\n" $URL/
curl -o /dev/null -w "%{http_code}\n" $URL/products
curl -o /dev/null -w "%{http_code}\n" $URL/track-analytics
curl -o /dev/null -w "%{http_code}\n" $URL/sitemap.xml
```

预期全部返回 `200`。

---

## 性能预期

| 指标 | 数值 | 说明 |
|---|---|---|
| 首屏 First Load JS | 87.4 KB shared + 1.5 KB / 页 | 行业 P10 水准 |
| 静态页数 | 32 (含 6 案例 + 6 文章) | 全部 SSG / Static |
| TTFB（亚太） | < 50ms | sin1 / hnd1 边缘节点 |
| Lighthouse 预估 | Performance ≥ 95 / SEO 100 / Accessibility ≥ 95 | |
| 月免费额度 | 100GB 带宽 + 6000 边缘函数 | 中小流量绰绰有余 |

---

© 2026 智擎 PreFounder
