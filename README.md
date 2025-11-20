# 德州扑克 GTO 助手

一个基于 Vue 3 + TypeScript 的德州扑克翻牌前 GTO 范围查询工具。

## 功能特点

- ✅ 完整的 6-max 位置 RFI 范围
- ✅ BB 和 SB 的完整防守范围
- ✅ 常见 3-bet 场景
- ✅ 13×13 手牌矩阵可视化
- ✅ 颜色编码（Raise/Call/3-bet/Fold）
- ✅ 混合策略频率显示
- ✅ 响应式设计（支持移动端）

## 技术栈

- Vue 3 (Composition API)
- TypeScript
- Vite
- Tailwind CSS

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 数据来源

基于 GTO Wizard、PokerCoaching 和 FreeBetRange 的标准 6-max 现金局范围。

## License

MIT
