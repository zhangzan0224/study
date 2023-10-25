// 根据hero.js提供的数据heros，创建合适的元素，将英雄数据显示到页面上

var doms = {
  container: document.querySelector('.container'),
}

function createHeroItem(hero) {
  var a = document.createElement('a')
  a.href = 'https://pvp.qq.com/web201605/herodetail/' + hero.ename + '.shtml'
  a.target = '_blank'
  a.className = 'item'
  a.innerHTML = `<img
    src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/${hero.ename}/${hero.ename}.jpg"
    alt=""
  />
  <span>${hero.cname}</span>
  `
  doms.container.appendChild(a)
}

for (let index = 0; index < heros.length; index++) {
  const element = heros[index];
  createHeroItem(element)
}