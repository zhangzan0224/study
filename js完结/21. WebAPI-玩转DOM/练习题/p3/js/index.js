/**
 * 根据协议的多选框是否选中设置注册按钮状态
 */
function setSubmitButtonStatus() {
  var policy = document.querySelector('.policy input')
  var submitBtn = document.querySelector('button[type="submit"]')
  submitBtn.disabled = !policy.checked
}

/**
 * 根据手机号文本框中的文本，设置发送验证码按钮的状态
 */
function setSendCodeButtonStatus() {
  // 首先获取手机号文本框中的文本
  var phone = document.querySelector('.txt').value
  // 然后获取验证码按钮的元素
  var codeBtn = document.querySelector('button[type="button"]')
  // 判断手机号文本框中的文本是否为空或者是否符合手机号码的正则表达式来去判断验证码的按钮是否禁用
  codeBtn.disabled = !/^[1][3,4,5,7,8][0-9]{9}$/.test(phone)
}

/**
 * 根据当前选中的爱好，设置已选择爱好文本
 */
function setSelectedLoves() {
  // 首先获取爱好的多选框选中的元素
  var loves = document.querySelectorAll('select option:checked')
  console.log(loves);
  // 然后获取已选择爱好的文本
  var lovesText = document.querySelector('.loves')
  // 判断爱好的多选框选中的元素是否为空，如果为空则不显示已选择爱好的文本，如果不为空则显示已选择爱好的文本
  lovesText.innerText = loves.length ? '已选择的爱好：' + [].slice.call(loves).map(item => item.innerText) : '已选择的爱好：' + ''
}