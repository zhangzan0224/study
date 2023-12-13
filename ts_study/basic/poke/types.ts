import { Color, Mark } from "./enums"

export type Deck = Card[] // 扑克牌

export interface Card {
  getString(): string
}

// 改为接口
export interface NormalCard extends Card {
  color: Color
  mark: Mark
}
// 定义大王小王
export interface Joker extends Card {
  type: 'big' | 'small'
}