<template>
  <div class="scenario-selector">
    <h3 class="selector-title">选择场景</h3>
    <div class="scenario-tabs">
      <button
        v-for="scenario in scenarios"
        :key="scenario.id"
        class="scenario-tab"
        :class="{ 'active': modelValue === scenario.id }"
        @click="selectScenario(scenario.id)"
      >
        {{ scenario.label }}
      </button>
    </div>

    <!-- 如果场景需要对手位置，显示选择器 -->
    <div v-if="currentScenario?.requiresVillain" class="villain-selector">
      <label class="villain-label">对手位置：</label>
      <select
        :value="villainPosition"
        @change="handleVillainChange"
        class="villain-select"
      >
        <option value="">请选择</option>
        <option
          v-for="pos in availableVillainPositions"
          :key="pos.value"
          :value="pos.value"
        >
          {{ pos.label }}
        </option>
      </select>
    </div>

    <p class="scenario-description">
      {{ currentScenario?.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Position, Scenario } from '../types/range'

interface Props {
  modelValue: string
  heroPosition: Position
  villainPosition?: Position
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'update:villainPosition', value: Position | undefined): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const scenarios: Scenario[] = [
  {
    id: 'RFI',
    label: '开局加注 (RFI)',
    description: '查看该位置的开局加注范围',
    requiresVillain: false
  },
  {
    id: 'defense',
    label: '防守范围',
    description: '面对其他位置加注时的防守范围（Call/3-bet）',
    requiresVillain: true
  },
  {
    id: '3bet',
    label: '3-Bet范围',
    description: '面对其他位置开局加注时的3-bet范围',
    requiresVillain: true
  }
]

const currentScenario = computed(() => {
  return scenarios.find(s => s.id === props.modelValue)
})

// 获取可选的对手位置（排除自己）
const availableVillainPositions = computed(() => {
  const allPositions: Array<{value: Position, label: string}> = [
    { value: 'UTG', label: 'UTG' },
    { value: 'MP', label: 'MP' },
    { value: 'CO', label: 'CO' },
    { value: 'BTN', label: 'BTN' },
    { value: 'SB', label: 'SB' },
    { value: 'BB', label: 'BB' }
  ]

  return allPositions.filter(pos => pos.value !== props.heroPosition)
})

const selectScenario = (scenarioId: string) => {
  emit('update:modelValue', scenarioId)

  // 如果新场景不需要对手位置，清空
  const scenario = scenarios.find(s => s.id === scenarioId)
  if (!scenario?.requiresVillain) {
    emit('update:villainPosition', undefined)
  }
}

const handleVillainChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value as Position
  emit('update:villainPosition', value || undefined)
}
</script>

<style scoped>
.scenario-selector {
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.selector-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #111827;
}

.scenario-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.scenario-tab {
  padding: 0.75rem 1.5rem;
  background-color: #f3f4f6;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.scenario-tab:hover {
  background-color: #e5e7eb;
}

.scenario-tab.active {
  background-color: #2563eb;
  color: white;
  border-color: #1d4ed8;
}

.villain-selector {
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 6px;
}

.villain-label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #374151;
}

.villain-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  font-size: 1rem;
  cursor: pointer;
}

.villain-select:focus {
  outline: none;
  border-color: #2563eb;
  ring: 2px solid rgba(37, 99, 235, 0.2);
}

.scenario-description {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

@media (max-width: 640px) {
  .scenario-tab {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}
</style>
