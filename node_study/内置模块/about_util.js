const util = require('util');
async function delay (duration) {
    return new Promise(resolve => setTimeout(() => {
        resolve(duration);
    }, duration))
}
const delayCallback = util.callbackify(delay);
// delay(500).then((res) => {
//     console.log(res)
// })
delayCallback(1000, (err, result) => {
    console.log(result);
})


const delayPromise = util.promisify(delayCallback);