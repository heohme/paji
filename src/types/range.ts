// 位置类型
export type Position = 'UTG' | 'MP' | 'CO' | 'BTN' | 'SB' | 'BB'

// 动作类型
export type Action = 'raise' | 'call' | '3bet' | 'fold'

// 手牌类型
export type Hand = string // 如 'AA', 'AKs', 'AKo'

// 混合策略
export interface MixedStrategy {
  [hand: string]: number | { [action: string]: number }
}

// 范围结果
export interface RangeResult {
  raise?: Hand[]
  call?: Hand[]
  '3bet'?: Hand[]
  fold?: Hand[]
  mixed?: MixedStrategy
}

// RFI 范围
export interface RFIRange {
  raise: Hand[]
  mixed?: MixedStrategy
  fold?: Hand[]
}

// 防守范围
export interface DefenseRange {
  description: string
  call: Hand[]
  '3bet': Hand[]
  mixed?: MixedStrategy
}

// 位置数据
export interface PositionData {
  name: string
  frequency?: string
  description?: string
  RFI?: RFIRange
  [key: string]: any // 支持 vs_BTN, vs_CO 等动态键
}

// 3-bet范围数据
export interface ThreeBetRange {
  description: string
  '3bet': Hand[]
  call: Hand[]
  mixed?: MixedStrategy
}

// 完整的GTO范围数据结构
export interface GTORangeData {
  description: string
  version: string
  positions: {
    [key in Position]: PositionData
  }
  '3bet_ranges': {
    [key: string]: ThreeBetRange
  }
  notes: {
    data_source: string
    stack_depth: string
    raise_sizing: string
    '3bet_sizing': string
    mixed_strategy: string
    adjustments: string
  }
}

// 范围查询接口
export interface RangeQuery {
  position: Position
  scenario: 'RFI' | 'defense' | '3bet'
  villainPosition?: Position
}

// 手牌动作信息
export interface HandAction {
  hand: Hand
  action: Action
  frequency?: number // 0-1, 用于混合策略
  color: string // 颜色编码
  description?: string
}

// 场景类型
export interface Scenario {
  id: string
  label: string
  description: string
  requiresVillain: boolean
}
