(function () {

  console.log(foo, typeof foo);

  console.log(bar, typeof bar);

  var foo = "Hello";

  var bar = function () {
    return "World";

  }

  console.log(foo, typeof foo);

  console.log(bar, typeof bar);

  return;

  function foo() {
    return "good";

  }

})();