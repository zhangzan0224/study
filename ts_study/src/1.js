var files = [{
    name: 'xxxx.gif',
    size: 2000
  },
  {
    name: '111232.web',
    size: 1000
  },
  {
    name: '111232.webp',
    size: 1000
  }

]

function getImgFiles(files) {
  const validImgTypeArr = ['.gif', '.bmp', '.webp', '.png', '.jpeg', '.jgp']
  return files.filter(item => validImgTypeArr.includes(item.name.substring(item.name.lastIndexOf('.'))))
}
console.log('====================================');
console.log(getImgFiles(files));
console.log('====================================');