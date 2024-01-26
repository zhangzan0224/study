import axios from 'axios'
import showMessage from './showMessage'
const ins  = axios.create()
ins.interceptors.response.use(res => {
  if (res.data.code !== 0) {
    showMessage({
      content: res.data.msg,
      type: 'error',
      duration: 1000
    })
    return null
  }
  return res.data.data
})

export default ins