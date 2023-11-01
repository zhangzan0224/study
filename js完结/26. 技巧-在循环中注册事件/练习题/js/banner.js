var change = (function () {
  // 完成横幅区的图片切换
  // 横幅区数据
  var datas = [{
      img: 'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/15c05b32cf948b594477dfc3eb69fb69.jpg?w=2452&h=920',
      link: 'https://www.mi.com/mi11le-5g-ne',
    },
    {
      img: 'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/a532e33470d046b3f044d5ea49fc5e9e.png?thumb=1&w=2452&h=920&f=webp&q=90',
      link: 'https://www.mi.com/xiaomipad5',
    },
    {
      img: 'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/918820682e4a490221cfd92b24c14b86.jpg?thumb=1&w=2452&h=920&f=webp&q=90',
      link: 'https://www.mi.com/a/h/22033.html?sign=b60a6ca9167bce2d1ed8ee319cf83c75',
    },
    {
      img: 'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/af7be8f65065f405f57f46a02731f78d.jpg?thumb=1&w=2452&h=920&f=webp&q=90',
      link: 'https://www.mi.com/a/h/22812.html?sign=aab397a7ecf2ae4c1765e9d11fdccca6',
    },
  ];

  function $(selector) {
    return document.querySelector(selector)
  }
  var bannerDots = $('.banner-dots')
  var bannerCover = $('.banner-cover')
  var bannerImg = $('.banner-cover img')
  // 首先是初始化，渲染banner-dots区域

  function init() {
    for (var i = 0; i < datas.length; i++) {
      var span = document.createElement('span')
      span.className = 'fl'
      bannerDots.appendChild(span)
    }
    change(0)
  }
  init()

  // 更换图片和更换链接地址
  function change(index) {
    // 查找是否存在元素存在选中的样式，如果存在则需要进行清除选中的样式
    var selectd = bannerDots.querySelector('.banner-dots-selected')
    if (selectd) {
      selectd.className = 'fl'
    }
    var changeItem = datas[index]
    bannerCover.href = changeItem.link
    bannerImg.src = changeItem.img
    bannerDots.children[index].className = 'fl banner-dots-selected'
  }
  return change
})();