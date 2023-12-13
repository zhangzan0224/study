/* 目标：创建一副扑克牌（不包括大小王），打印该扑克牌 */
// 创建一副扑克牌，不包含大小王，并且打印

import { createDeck, printDeck } from "./funcs"

const deck = createDeck()
printDeck(deck)