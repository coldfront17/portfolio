# 复古拟物风个人主页 — 可行性探索与技术实现规划报告

> **Ver 2.0 Plan** — 基于参考设计图，结合当前站点（静态 HTML + Tailwind CDN + Vanilla JS，GitHub Pages 部署）的实际情况撰写。

---

## 一、参考设计拆解：它本质上是什么？

这张图不是「一张大图」，而是 **多个独立 UI 组件拼在一张虚拟桌面上**，整体走 **拟物化（Skeuomorphism）+ 复古印刷美学**。

| 区域 | 视觉隐喻 | 核心技术手段 |
|------|----------|--------------|
| 背景 | 方格纸桌面 | CSS 重复渐变 / SVG pattern |
| 左侧 | 热敏纸收据 / 点阵打印单 | `clip-path` / SVG mask 锯齿边 + 点阵化头像 |
| 中间 | 打孔索引卡 / 打卡记录 | 卡片容器 + 左侧时间轴 + 水印 Logo |
| 右侧 | 竖立的小册子 / 宣传册 | CSS 3D `perspective` + `rotateY` + 层叠阴影 |
| 装饰 | 滑板等小物件 | PNG/SVG 透明素材，绝对定位 |

**结论：100% 可以在浏览器里用 HTML/CSS/JS 实现，不需要游戏引擎，也不需要后端。**

---

## 二、各模块实现原理（由浅入深）

### 2.1 方格纸背景

最简单的一层，纯 CSS 即可：

```css
background-color: #e8e8e8;
background-image:
  linear-gradient(#ccc 1px, transparent 1px),
  linear-gradient(90deg, #ccc 1px, transparent 1px);
background-size: 24px 24px;
```

也可以用一张轻量 SVG pattern 贴图，效果更「手绘」。

---

### 2.2 左侧「收据卡」+ 点阵头像

分两层：

**卡片外形**

- 白色底 + 柔和 `box-shadow`
- 上下锯齿边：用 SVG `mask-image` 或 `clip-path: polygon(...)` 模拟撕纸/打印边
- 字体：等宽或打字机风格（如 `IBM Plex Mono`、`Courier Prime`）

**点阵/半色调头像**（参考图里最「复古」的部分）

有三种做法，按推荐顺序：

| 方案 | 做法 | 优点 | 缺点 |
|------|------|------|------|
| A. 预处理图片 | Figma/Photoshop 导出 dithered PNG | 性能最好，效果可控 | 换头像要重新导出 |
| B. CSS `image-rendering: pixelated` + 缩小再放大 | 纯 CSS | 零依赖 | 效果偏「马赛克」，不够像印刷 |
| C. Canvas 实时抖动 | JS 读取像素做 Floyd-Steinberg dither | 动态、可交互 | 代码量稍多，移动端要注意性能 |

对个人作品集，**方案 A（预处理）+ 偶尔用 C 做 hover 动效** 最务实。

---

### 2.3 中间「工作经历打卡卡」

本质是 **带时间轴的 flex/grid 列表**，视觉包装成索引卡：

```
┌─○────────────────────────────┐
│ 2014                         │
│  ├─ Babelcloud · Designer    │
│ 2016                         │
│  ├─ CapCut · UX Lead         │
│ 2020                         │
│  └─ OPPO · ...               │
└──────────────────────────────┘
     ↑ 左侧竖线 + 年份节点
```

技术点：

- 左上角圆孔：`border-radius: 50%` 的伪元素或真实 SVG 孔
- 右上角折角：`clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)`
- 公司 Logo 水印：`background-image` + `opacity: 0.08` + `background-size: contain`
- 泛黄纸色：`background: #f5f0e1` 或轻微 `filter: sepia(0.1)`

当前 `index.html` 里已有完整工作经历文案，**内容可直接复用，只换呈现层**。

---

### 2.4 右侧「项目小册子」— 核心难点

这是整个设计最有辨识度、也最需要花功夫的部分。

**视觉结构（单本小册子）：**

```
        ┌──────────┐
       /│  封面图   │\     ← 正面（rotateY 朝向用户）
      / │  标题     │ \
     /  └──────────┘  \
    │    │ 书脊 │      │   ← 窄条 div，深色渐变模拟厚度
     \  └──────────┘  /
      \             /
       底部阴影 ellipse
```

**实现方式：**

```html
<div class="booklet" style="transform: rotateY(-18deg) translateZ(20px);">
  <div class="booklet-spine"></div>   <!-- 书脊 -->
  <div class="booklet-cover">...</div> <!-- 封面 -->
</div>
```

父容器需要：

```css
.booklet-stage {
  perspective: 1200px;
  transform-style: preserve-3d;
}
```

封面内容可以是：

- 项目缩略图 + 标题（已有 `assets/project-*.jpg`）
- 或每张册子独立设计的「封面图」（更有设计感）

---

## 三、滚动策略：横向 vs 竖向 vs CoverFlow

参考图是横向滚动场景，但可以不照搬。当项目增多时，需要选择合适的排列与交互模式。

### 模式 A：横向滚动（参考图原版）

```
[About] ──scroll──▶ [Work Timeline] ──▶ [Booklet₁][Booklet₂][Booklet₃]...
```

- 实现：`overflow-x: auto` + `scroll-snap-type: x mandatory`
- 每个 section 是一个 `scroll-snap-align: start` 的「全屏宽卡片」
- 优点：沉浸感强，和参考图一致
- 缺点：手机端体验差，需要单独做竖向 fallback

### 模式 B：竖向滚动 + 区块堆叠（推荐）

```
┌─────────────┐
│  收据卡 About │
├─────────────┤
│  打卡卡 Work  │
├─────────────┤
│  小册子书架   │  ← CoverFlow 或扇形叠放
└─────────────┘
```

- 桌面和手机统一为竖向，开发成本低
- 每个区块仍是「拟物卡片」，只是排列从横向改成纵向
- **最符合现有站点结构**（当前是 sidebar + content 竖排）

### 模式 C：CoverFlow 书架（项目区的重点方案）

当项目从 8 个增长到 20+ 时，CoverFlow 比平铺更省空间、更有仪式感：

```
        ╱│╲
       ╱ │ ╲
      ╱  │  ╲
   [册₃][册₂][册₁]  ← 中间册子最大、正对用户
      ╲  │  ╱
       ╲ │ ╱
```

**实现思路：**

1. 所有册子绝对定位在同一区域
2. 根据 `activeIndex` 计算每本的 `translateX`、`translateZ`、`rotateY`、`scale`、`z-index`
3. 交互：左右箭头 / 拖拽 / 滚轮 / 键盘 ←→
4. 点击当前册子 → 展开详情或跳转 `project-*.html`

**公式示例（简化）：**

```js
const offset = index - activeIndex;
const rotateY = offset * -35;        // deg
const translateX = offset * 120;     // px
const translateZ = -Math.abs(offset) * 80;
const scale = offset === 0 ? 1 : 0.85;
const opacity = Math.abs(offset) > 3 ? 0 : 1;
```

8–15 个项目自己写 80–120 行 JS 完全够用；也可选用现成库（见下文），但样式定制需覆盖默认皮肤。

### 模式 D：「叠放」效果（Scroll-driven Stacking）

竖向滚动时，册子像扑克牌一样一张张盖住前面的：

- 用 `position: sticky` + 递增 `top` 值
- 或 Scroll-driven Animations（`animation-timeline: scroll()`）— 较新，Safari 需测

```css
.booklet-card:nth-child(1) { top: 80px; }
.booklet-card:nth-child(2) { top: 100px; }
.booklet-card:nth-child(3) { top: 120px; }
/* sticky 滚动时自然叠上去 */
```

这个效果和 Apple 产品页类似，**纯 CSS 就能做**，很适合项目数量持续增长。

---

## 四、纯前端能不能做？要不要自己画组件？

### 直接回答

| 问题 | 答案 |
|------|------|
| 纯前端能做吗？ | **能**，HTML + CSS + JS 足够 |
| 需要后端吗？ | **不需要**（当前是 GitHub Pages 静态站） |
| 需要自己画 UI 组件吗？ | **视觉素材需要设计**（封面、锯齿边、装饰物）；**交互组件可以代码实现** |
| H5 能做吗？ | **能**，这就是标准 H5/CSS3 |
| 需要 React/Vue 吗？ | **不需要**；现有 Vanilla JS 栈可以继续用 |
| 需要 WebGL/Three.js 吗？ | **不需要**；2D CSS 3D transform 足够 |

### 技术栈建议（基于当前项目）

保持 **零构建、零依赖** 的路线：

```
index.html          ← 新首页（或重构现有首页）
assets/
  retro.css         ← 方格纸、卡片、册子样式
  dither-avatar.png ← 预处理点阵头像
  booklets.js       ← CoverFlow / 叠放逻辑
  lightbox.js       ← 保留，详情页继续用
  booklet-covers/   ← 每项目一张册子封面（可选）
project-*.html      ← 详情页可保持现有结构，只统一视觉皮肤
```

如果未来想上框架，再迁移也不迟；**第一版不建议引入 React 只为做动画**。

### 可选第三方库（非必须）

| 库 | 用途 | 是否推荐 |
|----|------|----------|
| GSAP | 复杂时间轴动画、拖拽 | 可选，CDN 一行引入 |
| Swiper.js | CoverFlow 模式内置 | 省事，但样式定制要覆盖默认皮肤 |
| Lenis | 平滑滚动 | 可选，增强手感 |
| Three.js | 3D 场景 | **过度**，不建议 |

对这种作品集，**自己写 CoverFlow 逻辑 + GSAP（可选）** 比引整个 Swiper 更贴合复古拟物风格。

---

## 五、需要准备什么「东西」？

### 5.1 设计资产（Figma 阶段）

1. **色彩与材质规范**：纸色、墨线色、阴影参数
2. **收据卡模板**：含锯齿边 SVG
3. **索引卡模板**：含孔洞、折角
4. **小册子封面 × N**（每个项目一张，或统一模板换色）
5. **点阵化头像**（从 `assets/avatar.jpg` 导出）
6. **装饰素材**：滑板、回形针等（PNG 透明）
7. **字体**：标题衬线 + 正文等宽/无衬线

### 5.2 内容与数据

建议抽一个 JSON，避免 HTML 里硬编码：

```json
{
  "profile": { "name": "...", "role": "...", "links": [...] },
  "experience": [
    { "year": 2022, "company": "HIT Lab NZ", "title": "...", "logo": "..." }
  ],
  "projects": [
    { "slug": "tourism", "title": "...", "cover": "...", "href": "project-tourism.html" }
  ]
}
```

现有 8 个项目 + 工作经历都可以直接填进去。

### 5.3 开发任务清单

| 阶段 | 任务 | 复杂度 |
|------|------|--------|
| P0 | 方格纸背景 + 全局字体/配色 | 低 |
| P0 | 收据卡 About 区块 | 中 |
| P0 | 点阵头像（预处理图） | 低 |
| P1 | 工作经历索引卡 + 时间轴 | 中 |
| P1 | 小册子单卡 3D 样式（静态） | 中 |
| P2 | CoverFlow 交互（切换/点击） | 中高 |
| P2 | 与 `project-*.html` 跳转打通 | 低 |
| P3 | 移动端竖向 fallback | 中 |
| P3 | `prefers-reduced-motion` 无障碍 | 低 |
| P4 | 装饰动画、音效（可选） | 低 |

---

## 六、手机端怎么做？

参考图是桌面横向场景，手机需要单独策略。推荐 **渐进增强**：

```
桌面 (≥1024px)          平板 (768–1023)         手机 (<768)
─────────────────────────────────────────────────────────
竖向三区堆叠            竖向堆叠                竖向堆叠
CoverFlow 书架          CoverFlow 缩小          改为横向滑动卡片
                      或 2D 扇形预览          或简单列表 + 册子缩略图
3D 透视保留             减弱 perspective        关闭 3D，纯 2D
```

关键原则：

- **不要在手机上强做 3D CoverFlow**（触控区域小、GPU 开销、易误触）
- 手机端册子区用 **横向 `scroll-snap` 轮播** 最稳
- 收据卡/打卡卡改为 **全宽单列**，保留拟物皮肤即可

---

## 七、风险与注意事项

| 风险 | 说明 | 缓解 |
|------|------|------|
| 性能 | 多图层阴影 + 3D + 大图 | 封面图 WebP、限制同时可见册子数 |
| 可访问性 | 3D 动画可能引发眩晕 | `prefers-reduced-motion: reduce` 时禁用动画 |
| SEO | 全 JS 渲染内容不利爬虫 | 核心文字保留在 HTML 中，JS 只负责动效 |
| 维护成本 | 每个新项目要画册子封面 | 做 2–3 个封面模板，自动套色 |
| 风格一致性 | 详情页 `project-*.html` 还是旧 Tailwind 风格 | 详情页做轻量「纸张」皮肤统一，或保持反差也行 |
| 暗色模式 | 复古纸质感在 dark mode 下别扭 | 可固定浅色主题，或做「夜间台灯」变体 |

---

## 八、推荐实施方案

结合「不做纯横向滚动、项目会持续增加」的需求，推荐：

### 方案：**「竖向桌面」+ 「CoverFlow 书架」混合**

```
首页 (index.html 重构)
│
├─ Section 1: 收据卡 About（sticky 可选）
├─ Section 2: 索引卡 Work Experience（时间轴）
└─ Section 3: 小册子书架
     ├─ 桌面：CoverFlow，8+ 项目可循环浏览
     ├─ 平板：缩小版 CoverFlow
     └─ 手机：横向 scroll-snap 册子轮播

点击册子 → project-<slug>.html（保留现有详情页 + lightbox）
work.html 可保留为完整列表页，或合并进首页 Section 3 的「查看全部」
```

### 为什么适合当前站点

1. **不破坏现有架构**：仍是静态 HTML，GitHub Pages 直接部署
2. **内容可复用**：About、工作经历、8 个项目文案和图片都在
3. **扩展性好**：新项目 = JSON 加一条 + 一张封面图
4. **视觉冲击力够**：3D 册子是亮点，但只在桌面启用
5. **开发量可控**：核心约 1 个 CSS 文件 + 1 个 JS 文件 + 若干素材

### 工作量粗估（技术维度）

- **MVP**（背景 + 收据卡 + 静态册子展示）：改动集中在 `index.html` + 新 CSS，不涉及构建链
- **完整版**（CoverFlow 交互 + 时间轴卡 + 响应式）：额外需要一个 JS 模块和数据 JSON
- **精修版**（独立封面图、装饰素材、详情页皮肤统一）：主要在 Figma 资产产出

---

## 九、结论

| 维度 | 判断 |
|------|------|
| **可行性** | ✅ 高 — 标准 Web 技术完全覆盖 |
| **是否需要后端** | ❌ 不需要 |
| **是否需要框架** | ❌ 不需要（可选） |
| **是否需要自研组件** | ✅ 册子 CoverFlow、收据卡、时间轴卡建议自研或轻量封装 |
| **是否需要设计资产** | ✅ 需要 — 拟物风格的灵魂在视觉素材 |
| **H5 能否实现** | ✅ 能 — 这就是 H5/CSS3 的典型用例 |
| **对当前项目的侵入性** | 中等 — 首页重构为主，详情页可渐进改 |

**一句话**：这不是「能不能做」的问题，而是「愿意花多少时间在视觉资产和 3D 动效打磨上」的问题。技术上用现有的 **纯静态 HTML + Tailwind + Vanilla JS** 栈就能落地；推荐 **竖向滚动 + 桌面端 CoverFlow 书架**，手机端降级为横向滑动册子，这样项目增多时也不会撑爆版面。

---

## 十、下一步可推进项

1. 首页线框结构（HTML 骨架）
2. CoverFlow 核心 JS 伪代码 / 可运行 demo
3. 与现有 8 个项目的 JSON 数据映射表

---

*文档版本：Ver 2.0 Plan · 创建于项目规划阶段*
