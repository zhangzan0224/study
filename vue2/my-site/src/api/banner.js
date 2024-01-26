import request from '@/utils/request'
export const getBannerList = () => {
  return request({
    url: '/api/banner',
    method: 'get'
  })
}
getBannerList().then((result) => {
  console.log('tag', result)
}).catch((err) => {
  console.log('err', err)  
})