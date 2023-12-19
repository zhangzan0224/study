/* 类 */
/**
 * Represents an animal.
 * @constructor
 * @param {string} type - The type of the animal.
 * @param {string} name - The name of the animal.
 * @param {number} age - The age of the animal.
 * @param {string} sex - The sex of the animal.
 */
// function Animal(type, name, age, sex) {
//   this.type = type
//   this.name = name
//   this.age = age
//   this.sex = sex
// }
/**
 * Print the name, age, and sex of the animal.
 *
 * @param {undefined} - This function does not accept any parameters.
 * @return {undefined} - This function does not return any value.
 */
// Animal.prototype.print = function () {
//   console.log(this.name, this.age, this.sex)
// }
const printName = 'print'
class Animal1 {
  constructor(type, name, age, sex) {
    this.type = type;
    this.name = name;
    this.setAge(age);
    this.sex = sex;
  }
  // 对年龄进行控制
  [printName]() {
    console.log(this.name, this._age, this.sex)
  }
  setAge(age) {
    if (age > 0) {
      this._age = age;
    } else {
      throw new Error('年龄必须大于0')
    }
  }
}
const a1 = new Animal1('a', 'b', 1, 'c');
a1[printName]()
// for (const key in a1) {
//   console.log(key, a1[key])
// }