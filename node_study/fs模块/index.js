const fs = require('fs')
const path = require('path')
const fileName = path.resolve(__dirname, '../files/1.txt')
fs.readFile(fileName, 'utf8', (err, content) => {
    if (err) {
        console.log(err)
    }
    console.log(content)
})

