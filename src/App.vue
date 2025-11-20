<template>
  <div class="app">
    <header class="app-header">
      <h1 class="app-title">德州扑克 GTO 助手</h1>
      <p class="app-subtitle">翻牌前范围查询工具</p>
    </header>

    <main class="app-main">
      <div class="controls-section">
        <!-- 位置选择器 -->
        <PositionSelector v-model="selectedPosition" />

        <!-- 场景选择器 -->
        <ScenarioSelector
          v-model="selectedScenario"
          v-model:villainPosition="villainPosition"
          :heroPosition="selectedPosition"
        />

        <!-- 范围信息 -->
        <div v-if="currentRange" class="range-info">
          <div class="info-card">
            <span class="info-label">当前范围：</span>
            <span class="info-value">{{ getRangeDescription() }}</span>
          </div>
          <div class="info-card">
            <span class="info-label">手牌数量：</span>
            <span class="info-value">约 {{ handCount }} 种</span>
          </div>
          <div class="info-card">
            <span class="info-label">范围百分比：</span>
            <span class="info-value">~{{ rangePercentage.toFixed(1) }}%</span>
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>

      <div class="matrix-section">
        <!-- 手牌矩阵 -->
        <HandMatrix
          v-if="currentRange"
          :range="currentRange"
          :selectedHand="selectedHand"
          @handClick="handleHandClick"
          @handHover="handleHandHover"
        />

        <!-- 加载中 -->
        <div v-else-if="loading" class="loading">
          <div class="spinner"></div>
          <p>加载中...</p>
        </div>
      </div>

      <div class="detail-section">
        <!-- 手牌详情 -->
        <HandDetail
          v-if="currentRange"
          :hand="selectedHand"
          :range="currentRange"
        />
      </div>
    </main>

    <footer class="app-footer">
      <p>基于 GTO Wizard、PokerCoaching 和 FreeBetRange 的标准 6-max 现金局范围</p>
      <p class="footer-note">Phase 1: 纯前端实现 | 数据来源：经典 GTO 策略</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Position, Hand, RangeResult } from './types/range'
import { getRangeByQuery } from './services/rangeService'
import { countHandsInRange, getRangePercentage } from './utils/handUtils'
import PositionSelector from './components/PositionSelector.vue'
import ScenarioSelector from './components/ScenarioSelector.vue'
import HandMatrix from './components/HandMatrix.vue'
import HandDetail from './components/HandDetail.vue'

// 响应式状态
const selectedPosition = ref<Position>('BTN')
const selectedScenario = ref<string>('RFI')
const villainPosition = ref<Position | undefined>(undefined)
const selectedHand = ref<Hand | null>(null)
const currentRange = ref<RangeResult | null>(null)
const loading = ref(false)
const errorMessage = ref<string>('')

// 计算属性
const handCount = computed(() => {
  if (!currentRange.value) return 0
  return countHandsInRange(currentRange.value)
})

const rangePercentage = computed(() => {
  if (!currentRange.value) return 0
  return getRangePercentage(currentRange.value)
})

// 获取范围描述
const getRangeDescription = (): string => {
  if (selectedScenario.value === 'RFI') {
    return `${selectedPosition.value} 开局加注`
  } else if (selectedScenario.value === 'defense' && villainPosition.value) {
    return `${selectedPosition.value} 防守 vs ${villainPosition.value}`
  } else if (selectedScenario.value === '3bet' && villainPosition.value) {
    return `${selectedPosition.value} 3-Bet vs ${villainPosition.value}`
  }
  return '请选择完整的场景'
}

// 加载范围数据
const loadRange = async () => {
  try {
    loading.value = true
    errorMessage.value = ''

    // 验证输入
    if (selectedScenario.value !== 'RFI' && !villainPosition.value) {
      errorMessage.value = '请选择对手位置'
      currentRange.value = null
      return
    }

    const range = await getRangeByQuery({
      position: selectedPosition.value,
      scenario: selectedScenario.value as 'RFI' | 'defense' | '3bet',
      villainPosition: villainPosition.value
    })

    currentRange.value = range
    selectedHand.value = null // 重置选中的手牌
  } catch (error) {
    console.error('加载范围失败:', error)
    errorMessage.value = error instanceof Error ? error.message : '加载失败，请稍后重试'
    currentRange.value = null
  } finally {
    loading.value = false
  }
}

// 处理手牌点击
const handleHandClick = (hand: Hand) => {
  selectedHand.value = selectedHand.value === hand ? null : hand
}

// 处理手牌悬停
const handleHandHover = (hand: Hand) => {
  // 可以在这里添加悬停效果
}

// 监听选择变化，自动加载范围
watch([selectedPosition, selectedScenario, villainPosition], () => {
  loadRange()
}, { immediate: true })
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

.app-header {
  padding: 2rem 1rem;
  text-align: center;
  color: white;
}

.app-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.app-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
}

.app-main {
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  display: grid;
  grid-template-columns: 350px 1fr 350px;
  gap: 1rem;
  align-items: start;
}

.controls-section,
.detail-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.matrix-section {
  display: flex;
  justify-content: center;
  align-items: start;
}

.range-info {
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-radius: 6px;
}

.info-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  font-size: 1rem;
  color: #111827;
  font-weight: 600;
}

.error-message {
  padding: 1rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.875rem;
}

.loading {
  padding: 3rem;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.app-footer {
  padding: 2rem 1rem;
  text-align: center;
  color: white;
  font-size: 0.875rem;
  opacity: 0.8;
}

.footer-note {
  margin-top: 0.5rem;
  font-size: 0.75rem;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .app-main {
    grid-template-columns: 300px 1fr;
  }

  .detail-section {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .app-main {
    grid-template-columns: 1fr;
  }

  .controls-section {
    order: 1;
  }

  .matrix-section {
    order: 2;
  }

  .detail-section {
    order: 3;
  }

  .app-title {
    font-size: 1.75rem;
  }

  .app-subtitle {
    font-size: 1rem;
  }
}
</style>
