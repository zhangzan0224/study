 const love1 = '秋葵'
 const love2 = '菜花'
 const text = myTag `我喜欢${love1}和${love2}.`

 function myTag(parts) {
   const args = Array.prototype.slice.call(arguments, 1)
   //  console.log(`output->`, args)
   let str = ''
   for (let i = 0; i < args.length; i++) {
     str += parts[i] + ':' + args[i]
   }
   str += parts[parts.length - 1]
   return str
 }

 //  console.log(`output->`, text)


 function processStr(parts) {
   const args = Array.prototype.slice.call(arguments, 1)
   let str = ''
   for (let i = 0; i < args.length; i++) {
     str += parts[i] + args[i].replace(/</g, '&lt;').replace(/>/g, '&gt;')
   }
   str += parts[parts.length - 1]
   return str
 }