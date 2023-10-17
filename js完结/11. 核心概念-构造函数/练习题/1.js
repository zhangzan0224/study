/* 
利用构造函数创建一幅扑克牌
Deck 一副扑克牌
Poker 一张扑克牌
*/
/**
 * 
 * @param {number} number 1-1 2-2 11-J 12 -Q 13-K 14-小王 15 大王
 * @param {string} color 1-黑桃 2-红桃 3-梅花 4-方片
 */
function CreatePoker(number, color) {
  this.number = number;
  this.color = color;

  this.print = function () {

    if (this.number === 14) {
      console.log('joker')
      return
    }
    if (this.number === 15) {
      console.log('JOKER')
      return
    }
    var colors = ['♠', '♥', '♣', '♦']
    var numbers = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    console.log(colors[this.color - 1] + numbers[this.number - 1]);
  }
}

// var p1 = new CreatePoker(1, 1);
// p1.print()
// ! 一副扑克牌
function CreateDeck() {
  this.pokers = []
  for (var i = 1; i <= 13; i++) {
    for (var j = 1; j <= 4; j++) {
      this.pokers.push(new CreatePoker(i, j))
    }
  }
  this.pokers.push(new CreatePoker(14, 0))
  this.pokers.push(new CreatePoker(15, 0))
  this.print = function () {
    for (var i = 0; i < this.pokers.length; i++) {
      var p = this.pokers[i]
      p.print()
    }
  }
}

var deck = new CreateDeck()
deck.print()