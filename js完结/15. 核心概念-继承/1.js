// 设置child的原型的隐式原型指向parent的原型
function inherit(Child, Parent) {
  Object.setPrototypeOf(Child.prototype, Parent.prototype);
}

// 普通会员的构造函数
function User(username, password) {
  // this = {}
  this.username = username;
  this.password = password;
}
User.prototype.playFreeVideo = function () {
  console.log('观看免费视频');
};

// VIP会员的构造函数
function VIPUser(username, password, expires) {
  // this = {}
  User.call(this, username, password);
  this.expires = expires;
}

VIPUser.prototype.playPayVideo = function () {
  console.log('观看付费视频');
};

// 完成原型上的变化
inherit(VIPUser, User);


var vip = new VIPUser('abc', '123', '2022-10-01');
console.log(VIPUser.prototype.__proto__ === User.prototype, 'js完结/15. 核心概念-继承/1.js-第28行')
vip.playFreeVideo();