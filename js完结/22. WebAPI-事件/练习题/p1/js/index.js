/**
 * 根据协议的多选框是否选中设置注册按钮状态
 */
function setSubmitButtonStatus() {
  doms.submitBtn.disabled = !doms.policy.checked
}

/**
 * 根据手机号文本框中的文本，设置发送验证码按钮的状态
 */
function setSendCodeButtonStatus() {
  // 首先获取手机号文本框中的文本
  // 然后获取验证码按钮的元素
  // 判断手机号文本框中的文本是否为空或者是否符合手机号码的正则表达式来去判断验证码的按钮是否禁用
  doms.codeBtn.disabled = !/^[1][3,4,5,7,8][0-9]{9}$/.test(doms.phone.value)
}

/**
 * 根据当前选中的爱好，设置已选择爱好文本
 */
function setSelectedLoves() {
  // console.log(doms.loves);
  var loves = document.querySelectorAll('select option');
  var temp = []
  for (let index = 0; index < loves.length; index++) {
    const element = loves[index];
    if (element.selected) {
      // console.log(1111);
      temp.push(element.innerText)
    }
  }
  doms.lovesText.innerText = '已选择的爱好：' + temp.join(',')
}


var doms = {
  policy: document.querySelector('.policy input'),
  submitBtn: document.querySelector('button[type="submit"]'),
  lovesText: document.querySelector('#selChoose'),
  codeBtn: document.querySelector('button[type="button"]'),
  phone: document.querySelector('.txt'),
  select: document.querySelector('select')
}
setSubmitButtonStatus()
setSendCodeButtonStatus()
setSelectedLoves()
// 监听根据协议的多选框是否选中设置注册按钮状态
doms.policy.addEventListener('change', setSubmitButtonStatus)

doms.phone.addEventListener('input', setSendCodeButtonStatus)

doms.select.addEventListener('change', function () {
  setSelectedLoves()
})