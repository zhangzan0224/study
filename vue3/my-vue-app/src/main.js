import {  reactive, readonly, ref, computed, watchEffect, watch, toRefs } from "vue";

const state = reactive({
  firstName: "Xu Ming",
  lastName: "Deng",
});
const fullName = computed(() => {
  console.log("changed");
  return `${state.lastName}, ${state.firstName}`;
});
console.log("state ready");
console.log("fullname is", fullName.value);
console.log("fullname is", fullName.value);
const imState = readonly(state);
console.log(imState === state);

const stateRef = ref(state);
console.log(stateRef.value === state);

state.firstName = "Cheng";
state.lastName = "Ji";

console.log(imState.firstName, imState.lastName);
console.log("fullname is", fullName.value);
console.log("fullname is", fullName.value);

const imState2 = readonly(stateRef);
console.log(imState2.value === stateRef.value);
/**
 * state ready
  *
** fullname is Deng, Xu Ming
** fullname is Deng, Xu Ming
  false
  true
  cheng ji
  changed
  fullname is JIcheng
  fullname is jicheng
  false

 */

function useUser() {
  // 在这里补全函数
  const userOrigin = reactive({});
  const user = readonly(userOrigin);
  const setUserName = (name) => {
    userOrigin.name = name;
  };
  const setUserAge = (age) => {
    userOrigin.age = age;
  };
  return {
    user, // 这是一个只读的用户对象，响应式数据，默认为一个空对象
    setUserName, // 这是一个函数，传入用户姓名，用于修改用户的名称
    setUserAge, // 这是一个函数，传入用户年龄，用户修改用户的年龄
  };
}

function useDebounce(obj, duration) {
  // 在这里补全函数
  const objOrigin = reactive(obj);
  const value = readonly(objOrigin);
  let timer = null;
  const setValue = (newObj) => {
    timer = setTimeout(() => {
      Object.assign(objOrigin, newObj);
    }, duration);
  };
  return {
    value, // 这里是一个只读对象，响应式数据，默认值为参数值
    setValue, // 这里是一个函数，传入一个新的对象，需要把新对象中的属性混合到原始对象中，混合操作需要在duration的时间中防抖
  };
}
const { value, setValue } = useDebounce(
  {
    a: 1,
    b: 2,
  },
  5000
);
window.value = value;
window.setValue = setValue;
//  判断
const state1 = reactive({
  count: 0,
});
watchEffect(() => {
  console.log("watchEffect", state1.count);
});
watch(
  () => state1.count,
  (count, oldCount) => {
    console.log("watch", count, oldCount);
  }
);
console.log("start");
setTimeout(() => {
  console.log("time out");
  state1.count++;
  state1.count++;
});
state1.count++;
state1.count++;

console.log("end");

/*
  watchEffect 0
  start
  end
  watchEffect 2
  watch 2 0
  time out
  watchEffect 4
  watch 4 2
 */

function usePos() {
  const pos = reactive({
    x: 0,
    y: 0,
  });
  return toRefs(pos); //  {x: refObj, y: refObj}
}

function useBooks() {
  const books = ref([]);
  return {
    books, // books is refObj
  };
}

function useLoginUser() {
  const user = readonly({
    isLogin: false,
    loginId: null,
  });
  return toRefs(user); // { isLogin: refObj, loginId: refObj }  all ref is readonly
}

// setup() {
//   // 在setup函数中，尽量保证解构、展开出来的所有响应式数据均是ref
//   return {
//     ...usePos(),
//     ...useBooks(),
//     ...useLoginUser()
//   }
// }
