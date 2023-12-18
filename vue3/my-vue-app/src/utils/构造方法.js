function Foo() {
  console.log(new.target);
  if (!new.target) {
    throw new Error('请使用new构造')
  }
}
const foo = new Foo();
// const foo1 = Foo.call(new Foo())
console.log(foo);

// 如果不是使用new构造,会报错,不管是不是更改了指向,只有使用了new 才能获取到new.target