(function () {
  // 1.选择要使用的DOM元素
  var provinceDOM = document.getElementById('province');
  var cityDOM = document.getElementById('city');
  var schoolDOM = document.getElementById('school');
  // 初始化的时候创建省可选的下拉列表，并添加到provinceDOM
  for (var prop in province) {
    // prop 编号，province[prop] 省名称
    var optionDOM = document.createElement('option');
    optionDOM.value = prop;
    optionDOM.innerText = province[prop];
    provinceDOM.appendChild(optionDOM);
  }
  // 有了省名称和省编号，查找对应省相关的城市。
  // 当选择（变化）
  provinceDOM.onchange = function () {
    // 清空数据
    cityDOM.innerHTML = '';
    // 清空默认城市下的大学
    schoolDOM.innerHTML = '';
    // 省序号
    var p = provinceDOM.value;
    // 渲染城市列表
    // 城市列表的集合
    var cityObj = city[p];
    console.log(cityObj);
    if (!cityObj) {
      return;
    }
    // 遍历
    for (var prop in cityObj) {
      // prop 城市编号，cityObj[prop] 城市名称
      var optionDOM = document.createElement('option');
      optionDOM.value = prop;
      optionDOM.innerText = cityObj[prop];
      cityDOM.appendChild(optionDOM);
    }

    // 渲染默认城市下的大学
    // 拿到当前默认城市的编号
    var c = cityDOM.value;
    // 获取编号下面的大学
    var schoolArr = allschool[c];
    // 遍历，渲染
    for (var i = 0; i < schoolArr.length; i++) {
      // schoolArr[i] 学校名称
      var optionDOM = document.createElement('option');
      optionDOM.innerText = schoolArr[i];
      schoolDOM.appendChild(optionDOM);
    }
  }
  // 城市的变化
  cityDOM.onchange = function () {
    schoolDOM.innerHTML = '';
    var c = cityDOM.value;
    // 获取编号下面的大学
    var schoolArr = allschool[c];
    // 遍历，渲染
    for (var i = 0; i < schoolArr.length; i++) {
      // schoolArr[i] 学校名称
      var optionDOM = document.createElement('option');
      optionDOM.innerText = schoolArr[i];
      schoolDOM.appendChild(optionDOM);
    }
  }

})()