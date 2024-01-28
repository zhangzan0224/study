import request from '@/utils/request'
export const getBannerList = () => {
  return request({
    url: '/api/banner',
    method: 'get'
  })
}