enum Gender { Male, Female }
// enum Days { Sun, Mon, Tue, Wed, Thu, Fri, Sat };
// console.log('tag', Gender.Male, Gender.Female)

enum Days { Sun = 3, Mon = 1, Tue, Wed, Thu, Fri, Sat };

console.log(Days["Sun"] === 3); // true
console.log(Days["Wed"] === 3); // true
console.log(Days[3] === "Sun"); // false // 导致 Days[3] 的值先是 "Sun"，而后又被 "Wed" 覆盖了
console.log(Days[3] === "Wed"); // true
console.log(Days[0]) // undefined