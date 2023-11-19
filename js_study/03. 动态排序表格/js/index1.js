/* 创建事入口函数
   1：首先为表头th添加事件绑定； 
   2：DOM查询获取所有的表头
   3：为ths注册点击事件，同时传递index值到事件函数内部
      找到一个index值，根据index为他进行排序
      通过bing函数进行index值的传递
      收集所有的tr列表集合
      让tr冒充调用 array.prototype.sclice.call sort方法进行排序
   4：排序处理规则： 
      汉字排序（使用拼音进行排序）
      数字排序 （正常进行排序）
   5：排序完成之后遍历排序完成的数组，使用appendChild方法进行每一个节点的添加

   全选处理
    处理全部选中的时候，首先阻止事件冒泡
    获取全选按钮的状态
    遍历tbody中的复选框，改变每一个复选框的状态为当前的全选按钮的状态
   单选处理
    事件绑定
    定义统计数字 checkedNum = 0
 */

(function () {
  /** 程序入口的定义*/
  function init() {
    var ths = document.querySelectorAll('th') // 标题集合
    var tbody = document.querySelector('tbody') // tbody 获取之后，在追加元素及查找复选框的时候进行使用
    var rows = tbody.querySelectorAll('tr') // 所有的行的集合
    var checkAll = document.querySelector('.checkAll') // 全选按钮获取
    var checkOneList = tbody.querySelectorAll('[type="checkbox"]') // 单选按钮集合获取

    checkOneList.forEach(checkOne => {
      checkOne.addEventListener('click', checkOneClick)
    })
    // 单选按钮选择事件处理
    function checkOneClick() {
      var count = 0
      checkOneList.forEach(item => {
        if (item.checked) {
          count++
        }
      })
      checkAll.checked = checkOneList.length === count
    }
    // 全选按钮添加按钮事件处理
    checkAll.addEventListener('click', checkAllClick)
    // 全选按钮事件处理

    function checkAllClick() {
      checkOneList.forEach(item => {
        item.checked = this.checked
      })
    }

    ths.forEach((th, index) => {
      th.addEventListener('click', () => {
        if (index === 0) return
        var arr = Array.from(rows).sort((a, b) => {
          if (index === 1 || index === 3) {
            // console.log(a.querySelectorAll('td')[index].innerHTML, b.querySelectorAll('td')[index].innerHTML);
            return a.querySelectorAll('td')[index].innerHTML - b.querySelectorAll('td')[index].innerHTML
          }
          return a.querySelectorAll('td')[index].innerHTML.localeCompare(b.querySelectorAll('td')[index].innerHTML, 'zh')
        })
        arr.forEach(function (node) {
          tbody.appendChild(node)
        })
        /* Node.appendChild() 方法将一个节点附加到指定父节点的子节点列表的末尾处。如果将被插入的节点已经存在于当前文档的文档树中，那么 appendChild() 只会将它从原先的位置移动到新的位置（不需要事先移除要移动的节点）。
         */
      })
    })
  }
  init()
})()