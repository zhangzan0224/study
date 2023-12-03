enum Gender { Male, Female }
// enum Days { Sun, Mon, Tue, Wed, Thu, Fri, Sat };
// console.log('tag', Gender.Male, Gender.Female)

enum Days { Sun = 3, Mon = 1, Tue, Wed, Thu, Fri, Sat };

// console.log(Days["Sun"] === 3); // true
// console.log(Days["Wed"] === 3); // true
// console.log(Days[3] === "Sun"); // false // 导致 Days[3] 的值先是 "Sun"，而后又被 "Wed" 覆盖了
// console.log(Days[3] === "Wed"); // true
// console.log(Days[0]) // undefined


// 权限 或运算，
enum PermissionForModules {
  Read = 1, // 0001
  Write = 2, // 0010
  Create = 4, // 0100
  Delete = 8, // 1000
}
//  0011
let p: PermissionForModules = PermissionForModules.Read | PermissionForModules.Write;
/**
 * Checks if a target permission includes a specific permission.
 * 
 * @param target - The target permission to check.
 * @param permission - The permission to check for.
 * @returns True if the target permission includes the specified permission, false otherwise.
 */
function hasPermission(target: PermissionForModules, permission: PermissionForModules) {
  // Use bitwise AND operator to check if the target permission includes the specified permission.
  return (target & permission) === permission;
}
console.log(hasPermission(p, PermissionForModules.Read));
// 删除某个权限，使用异或运算符 ^ （异或）
p = p ^ PermissionForModules.Read;
console.log(p);

// 0011 ^ 0010 = 0001
