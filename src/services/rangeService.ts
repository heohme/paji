import type {
  Position,
  RangeResult,
  GTORangeData,
  RangeQuery,
  DefenseRange,
  ThreeBetRange
} from '../types/range'
import gtoRangesData from '../assets/gto-ranges.json'

// 抽象接口 - Phase 2 可以替换实现
export interface IRangeProvider {
  getRFIRange(position: Position): Promise<RangeResult>
  getDefenseRange(position: Position, villainPosition: Position): Promise<RangeResult>
  get3BetRange(position: Position, villainPosition: Position): Promise<RangeResult>
  getAllPositions(): Position[]
  getPositionName(position: Position): string
  getPositionFrequency(position: Position): string
}

// Phase 1 实现：从本地JSON读取
class LocalRangeProvider implements IRangeProvider {
  private data: GTORangeData

  constructor() {
    this.data = gtoRangesData as GTORangeData
  }

  async getRFIRange(position: Position): Promise<RangeResult> {
    const positionData = this.data.positions[position]
    if (!positionData?.RFI) {
      throw new Error(`No RFI range found for position: ${position}`)
    }
    return positionData.RFI
  }

  async getDefenseRange(position: Position, villainPosition: Position): Promise<RangeResult> {
    const positionData = this.data.positions[position]
    const defenseKey = `vs_${villainPosition}`

    const defenseRange = positionData[defenseKey] as DefenseRange
    if (!defenseRange) {
      throw new Error(`No defense range found for ${position} vs ${villainPosition}`)
    }

    return {
      call: defenseRange.call,
      '3bet': defenseRange['3bet'],
      mixed: defenseRange.mixed
    }
  }

  async get3BetRange(position: Position, villainPosition: Position): Promise<RangeResult> {
    const key = `${position}_vs_${villainPosition}`
    const range = this.data['3bet_ranges'][key] as ThreeBetRange

    if (!range) {
      throw new Error(`No 3-bet range found for ${position} vs ${villainPosition}`)
    }

    return {
      '3bet': range['3bet'],
      call: range.call,
      mixed: range.mixed
    }
  }

  getAllPositions(): Position[] {
    return ['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB']
  }

  getPositionName(position: Position): string {
    return this.data.positions[position]?.name || position
  }

  getPositionFrequency(position: Position): string {
    return this.data.positions[position]?.frequency || 'N/A'
  }
}

// 导出单例
export const rangeService: IRangeProvider = new LocalRangeProvider()

// 辅助函数：根据查询获取范围
export async function getRangeByQuery(query: RangeQuery): Promise<RangeResult> {
  const { position, scenario, villainPosition } = query

  switch (scenario) {
    case 'RFI':
      return rangeService.getRFIRange(position)

    case 'defense':
      if (!villainPosition) {
        throw new Error('villainPosition is required for defense scenario')
      }
      return rangeService.getDefenseRange(position, villainPosition)

    case '3bet':
      if (!villainPosition) {
        throw new Error('villainPosition is required for 3bet scenario')
      }
      return rangeService.get3BetRange(position, villainPosition)

    default:
      throw new Error(`Unknown scenario: ${scenario}`)
  }
}
