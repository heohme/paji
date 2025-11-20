<template>
  <div class="position-selector">
    <h3 class="selector-title">选择位置</h3>
    <div class="position-grid">
      <button
        v-for="pos in positions"
        :key="pos.value"
        class="position-button"
        :class="{ 'active': modelValue === pos.value }"
        @click="selectPosition(pos.value)"
      >
        <div class="position-name">{{ pos.label }}</div>
        <div class="position-description">{{ pos.description }}</div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Position } from '../types/range'

interface PositionInfo {
  value: Position
  label: string
  description: string
}

interface Props {
  modelValue: Position
}

interface Emits {
  (e: 'update:modelValue', value: Position): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const positions: PositionInfo[] = [
  { value: 'UTG', label: 'UTG', description: 'Under the Gun' },
  { value: 'MP', label: 'MP', description: 'Middle Position' },
  { value: 'CO', label: 'CO', description: 'Cut Off' },
  { value: 'BTN', label: 'BTN', description: 'Button' },
  { value: 'SB', label: 'SB', description: 'Small Blind' },
  { value: 'BB', label: 'BB', description: 'Big Blind' }
]

const selectPosition = (position: Position) => {
  emit('update:modelValue', position)
}
</script>

<style scoped>
.position-selector {
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

.position-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
}

.position-button {
  padding: 1rem;
  background-color: #f3f4f6;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.position-button:hover {
  background-color: #e5e7eb;
  border-color: #3b82f6;
}

.position-button.active {
  background-color: #dbeafe;
  border-color: #2563eb;
}

.position-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.position-description {
  font-size: 0.75rem;
  color: #6b7280;
}

@media (max-width: 640px) {
  .position-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .position-button {
    padding: 0.75rem 0.5rem;
  }

  .position-name {
    font-size: 1rem;
  }

  .position-description {
    font-size: 0.625rem;
  }
}
</style>
