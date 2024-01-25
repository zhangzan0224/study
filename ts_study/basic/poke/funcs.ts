import exp = require("constants");
import { Mark, Color } from "./enums";
import { Card, Deck, Joker, NormalCard } from "./types";

export function createDeck(): Deck {
  // 定义一副牌
  const deck: Deck = []
  const marks = Object.values(Mark)
  const colors = Object.values(Color)
  for (const m of marks) {
    for (const c of colors) {
      deck.push({ // 更加颜色的类型检查
        color: c,
        mark: m,
        getString() {
          return this.color + this.mark
        }
        // })
        // const card: NormalCard = {
        //   color: c,
        //   mark: m,
        //   getString() {
        //     return this.color + this.mark
        //   }
        // }
        // deck.push(card)
      } as Card)
    }
  }
  let joker: Joker = {
    type: 'big',
    getString() {
      return '大王'
    }
  }
  deck.push(joker)
  joker = {
    type: 'small',
    getString() {
      return '小王'
    }
  }
  deck.push(joker)
  return deck;
}

export function printDeck(deck: Deck): void {
  let result = '\n'
  deck.forEach((card, i) => {

    // let str = card.color + card.mark;
    let str = card.getString();
    result += str + "\t";
    if ((i + 1) % 6 === 0) {
      result += "\n";
    }
  })
  console.log(result);
}
// 定义一个函数用来判断是否为奇数，如果传入的不是数字，进行报错，否则返回 boolea
export function isOdd(n: number | string): boolean {
  if (typeof n === 'string') {
    n = parseInt(n);
    if (isNaN(n)) {
      throw new Error('n must be a number or a string representing a number');
    }
  }
  if (typeof n !== 'number') {
    throw new Error('n must be a number or a string representing a number');
  }
  return n % 2 === 1
}
// 定义一个函数用来判断是否为偶数，如果传入的不是数字，进行报错，否则返回 boolean
export function isEven(n: number | string): boolean {
  if (typeof n === 'string') {
    n = parseInt(n);
    if (isNaN(n)) {
      throw new Error('n must be a number or a string representing a number');
    }
  }
  if (typeof n !== 'number') {
    throw new Error('n must be a number or a string representing a number');
  }
  return n % 2 === 0;
}