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

/**
 * 获取活动内容列表
 */
export const getActiveTypeList = async () => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return {
    code: 200,
    data: [{
        catId: "activeType",
        catName: "活动内容",
        dictCd: "HEALTH_LECTURE",
        dictName: "健康讲座"
      },
      {
        catId: "activeType",
        catName: "活动内容",
        dictCd: "HEALTH_CHECK",
        dictName: "体检"
      },
      {
        catId: "activeType",
        catName: "活动内容",
        dictCd: "CUSTOMER_CHECK",
        dictName: "客权体检"
      },
      {
        catId: "activeType",
        catName: "活动内容",
        dictCd: "FREE_CLINIC",
        dictName: "义诊"
      },
      {
        catId: "activeType",
        catName: "活动内容",
        dictCd: "PRODUCT",
        dictName: "产说会"
      },
      {
        catId: "activeType",
        catName: "活动内容",
        dictCd: "CONFERENCE",
        dictName: "签约发布会"
      },
      {
        catId: "activeType",
        catName: "活动内容",
        dictCd: "CLAIM",
        dictName: "理赔发布会"
      },
      {
        catId: "activeType",
        catName: "活动内容",
        dictCd: "MEDLINK",
        dictName: "医汇通相关"
      },
      {
        catId: "activeType",
        catName: "活动内容",
        dictCd: "REGION_GREEN",
        dictName: "区域绿通相关"
      },
      {
        catId: "activeType",
        catName: "活动内容",
        dictCd: "PRODUCT_INTRODUCTION",
        dictName: "圈层营销-产品推介会"
      },
      {
        catId: "activeType",
        catName: "活动内容",
        dictCd: "PRODUCT_VISIT",
        dictName: "圈层营销-超体参观"
      },
      {
        catId: "activeType",
        catName: "活动内容",
        dictCd: "OTHER",
        dictName: "其他"
      }
    ],
    debugMessage: "",
    message: "",
    success: true,
    timestamp: Date.now()
  }
}

/**
 * 根据中支编码获取试点中支当前值（Mock）
 * 固定选项：0=否，1=一期，2=二期；接口仅返回当前值
 * @param {string} subbranchCode 中支编码
 * 返回结构：{ code, success, data: { current } }
 */
export const getTrialSubbranchValue = async (subbranchCode) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  let current = '0'
  if (subbranchCode === 'SZ001') {
    current = '1'
  } else if (subbranchCode === 'BJ002') {
    current = '2'
  }
  return {
    code: 200,
    success: true,
    message: 'OK',
    data: {
      current
    },
    timestamp: Date.now()
  }
}