import type { Hand, Action, HandAction, RangeResult } from '../types/range'

// 生成13x13手牌矩阵
export function generateHandMatrix(): Hand[][] {
  const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
  const matrix: Hand[][] = []

  for (let row = 0; row < 13; row++) {
    const rowHands: Hand[] = []
    for (let col = 0; col < 13; col++) {
      const rank1 = ranks[row]
      const rank2 = ranks[col]

      if (row === col) {
        // 对子 (对角线)
        rowHands.push(`${rank1}${rank2}`)
      } else if (row < col) {
        // 同花 (右上)
        rowHands.push(`${rank1}${rank2}s`)
      } else {
        // 不同花 (左下)
        rowHands.push(`${rank2}${rank1}o`)
      }
    }
    matrix.push(rowHands)
  }

  return matrix
}

// 获取手牌的动作和颜色
export function getHandAction(hand: Hand, range: RangeResult): HandAction {
  // 检查 raise
  if (range.raise?.includes(hand)) {
    return {
      hand,
      action: 'raise',
      frequency: 1,
      color: '#059669', // green-600
      description: 'Raise 100%'
    }
  }

  // 检查 3bet
  if (range['3bet']?.includes(hand)) {
    return {
      hand,
      action: '3bet',
      frequency: 1,
      color: '#dc2626', // red-600
      description: '3-bet 100%'
    }
  }

  // 检查 call
  if (range.call?.includes(hand)) {
    return {
      hand,
      action: 'call',
      frequency: 1,
      color: '#2563eb', // blue-600
      description: 'Call 100%'
    }
  }

  // 检查混合策略
  if (range.mixed && hand in range.mixed) {
    const mixedData = range.mixed[hand]

    // 情况1: 单个频率数字 (如 0.5)
    if (typeof mixedData === 'number') {
      const mainAction = range.raise ? 'raise' : range['3bet'] ? '3bet' : 'call'
      return {
        hand,
        action: mainAction as Action,
        frequency: mixedData,
        color: '#f59e0b', // amber-500
        description: `${capitalize(mainAction)} ${(mixedData * 100).toFixed(0)}%`
      }
    }

    // 情况2: 多个动作的频率对象 (如 {call: 0.7, 3bet: 0.3})
    if (typeof mixedData === 'object') {
      const actions = Object.entries(mixedData)
      if (actions.length > 0) {
        // 取频率最高的动作
        const [primaryAction, frequency] = actions.reduce((a, b) =>
          a[1] > b[1] ? a : b
        )

        const allActions = actions
          .map(([act, freq]) => `${capitalize(act)} ${((freq as number) * 100).toFixed(0)}%`)
          .join(', ')

        return {
          hand,
          action: primaryAction as Action,
          frequency: frequency as number,
          color: '#f59e0b', // amber-500
          description: allActions
        }
      }
    }
  }

  // 默认 fold
  return {
    hand,
    action: 'fold',
    frequency: 0,
    color: '#6b7280', // gray-500
    description: 'Fold'
  }
}

// 辅助函数：首字母大写
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// 获取动作的显示文本
export function getActionLabel(action: Action): string {
  const labels: Record<Action, string> = {
    raise: '加注',
    call: '跟注',
    '3bet': '3-Bet',
    fold: '弃牌'
  }
  return labels[action] || action
}

// 获取动作的背景色（根据频率调整透明度）
export function getActionColor(action: Action, frequency: number = 1): string {
  const opacity = Math.max(0.3, frequency) // 最低30%不透明度

  const colors: Record<Action, string> = {
    raise: `rgba(5, 150, 105, ${opacity})`, // green
    '3bet': `rgba(220, 38, 38, ${opacity})`, // red
    call: `rgba(37, 99, 235, ${opacity})`, // blue
    fold: `rgba(107, 114, 128, ${opacity * 0.3})` // gray (更透明)
  }

  return colors[action] || colors.fold
}

// 计算范围的手牌总数
export function countHandsInRange(range: RangeResult): number {
  let count = 0

  if (range.raise) count += range.raise.length
  if (range.call) count += range.call.length
  if (range['3bet']) count += range['3bet'].length

  // 混合策略按频率计算
  if (range.mixed) {
    Object.values(range.mixed).forEach((value) => {
      if (typeof value === 'number') {
        count += value
      } else if (typeof value === 'object') {
        const totalFreq = Object.values(value).reduce((sum, freq) => sum + (freq as number), 0)
        count += Math.min(totalFreq, 1) // 最多算1手牌
      }
    })
  }

  return Math.round(count)
}

// 计算范围百分比 (相对于1326种起手牌组合)
export function getRangePercentage(range: RangeResult): number {
  const totalCombos = 1326 // 德州扑克总共1326种起手牌组合
  const handCount = countHandsInRange(range)

  // 粗略估计：每个手牌符号代表不同数量的组合
  // 对子: 6种组合 (如AA有6种)
  // 同花: 4种组合 (如AKs有4种)
  // 不同花: 12种组合 (如AKo有12种)

  // 这里简化处理，平均每个手牌约8种组合
  const estimatedCombos = handCount * 8

  return Math.min((estimatedCombos / totalCombos) * 100, 100)
}
