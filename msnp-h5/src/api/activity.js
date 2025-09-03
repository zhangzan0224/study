/**
 * Mock API function to fetch venue list.
 * In a real application, this would make a network request.
 */
export const getVenueList = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return the mock data structure provided
  return {
    "code": 200,
    "data": [{
        "branchName": "北京",
        "build": "已运营",
        "buildYear": "2022年",
        "centerCity": "北京西城",
        "centerCityFlag": "是",
        "centerId": "17",
        "centerName": "北京西区健康财富体验中心",
        "cscFlag": "否",
        "hwpFlag": "是",
        "id": "",
        "provinceCenterFlag": "是",
        "provincialFlag": "否",
        "strategyType": "高客战略",
        "subBranchFlag": "否",
        "version": "分公司版"
      },
      {
        "branchName": "北京",
        "build": "建成未运营",
        "buildYear": "2023年",
        "centerCity": "长安",
        "centerCityFlag": "否",
        "centerId": "223",
        "centerName": "北京长安健康财富体验中心",
        "cscFlag": "是",
        "hwpFlag": "是",
        "id": "",
        "provinceCenterFlag": "是",
        "provincialFlag": "是",
        "strategyType": "高客战略",
        "subBranchFlag": "否",
        "version": "标准版"
      },
      {
        "branchName": "北京",
        "build": "已运营",
        "buildYear": "2019年",
        "centerCity": "北京",
        "centerCityFlag": "是",
        "centerId": "233",
        "centerName": "北京哈德门健康财富体验中心",
        "cscFlag": "否",
        "hwpFlag": "是",
        "id": "",
        "provinceCenterFlag": "是",
        "provincialFlag": "否",
        "strategyType": "高客战略",
        "subBranchFlag": "否",
        "version": "新生活体验中心3.0"
      },
      {
        "branchName": "北京",
        "build": "已运营",
        "buildYear": "2022年",
        "centerCity": "北京东城",
        "centerCityFlag": "是",
        "centerId": "16",
        "centerName": "北京东区健康财富体验中心",
        "cscFlag": "否",
        "hwpFlag": "是",
        "id": "",
        "provinceCenterFlag": "是",
        "provincialFlag": "否",
        "strategyType": "高客战略",
        "subBranchFlag": "否",
        "version": "分公司版"
      }
    ],
    "debugMessage": "执行成功",
    "message": "执行成功",
    "success": true,
    "timestamp": Date.now()
  };
};