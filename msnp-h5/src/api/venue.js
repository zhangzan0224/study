/**
 * 场馆和医院相关API接口
 */

// 搜索医院
export const searchHospital = async (searchValue) => {
  try {
    // 这里应该调用真实的后端API
    // const response = await fetch(`/api/hospital/search?keyword=${encodeURIComponent(searchValue)}`)
    // const data = await response.json()
    // return data

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))

    // 模拟后端返回数据
    const mockData = [{
        hospitalName: `${searchValue}分院`,
        hospitalLevel: '2a',
        feHospitalId: 'H002',
        isCustom: false
      },
      {
        hospitalName: `${searchValue}总院`,
        hospitalLevel: '3a',
        feHospitalId: 'H003',
        isCustom: false
      },
      {
        hospitalName: `${searchValue}人民医院`,
        hospitalLevel: '3a',
        feHospitalId: 'H004',
        isCustom: false
      }
    ]

    // 检查后端数据中是否已经存在用户输入的医院名称
    const existingHospital = mockData.find(hospital =>
      hospital.hospitalName.toLowerCase() === searchValue.toLowerCase()
    )

    // 如果后端数据中没有相同的医院名称，才添加用户输入的作为自定义选项
    if (!existingHospital) {
      mockData.unshift({
        hospitalName: searchValue,
        hospitalLevel: '', // 自定义医院没有等级
        feHospitalId: '', // 自定义医院没有fe编码
        isCustom: true
      })
    }

    return {
      code: 200,
      data: mockData,
      message: '搜索成功'
    }
  } catch (error) {
    console.error('搜索医院失败:', error)
    throw new Error('搜索医院失败')
  }
}

// 搜索场馆名称
export const searchVenueName = async (searchValue) => {
  try {
    // 这里应该调用真实的后端API
    // const response = await fetch(`/api/venue/search?keyword=${encodeURIComponent(searchValue)}`)
    // const data = await response.json()
    // return data

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))

    // 模拟后端返回数据
    const mockData = [{
        venueName: `${searchValue}健财中心`,
        venueCode: 'VC001',
        address: '北京市朝阳区',
        isCustom: false
      },
      {
        venueName: `${searchValue}财富管理中心`,
        venueCode: 'VC002',
        address: '上海市浦东新区',
        isCustom: false
      },
      {
        venueName: `${searchValue}健康管理中心`,
        venueCode: 'VC003',
        address: '广州市天河区',
        isCustom: false
      }
    ]

    // 检查后端数据中是否已经存在用户输入的场馆名称
    const existingVenue = mockData.find(venue =>
      venue.venueName.toLowerCase() === searchValue.toLowerCase()
    )

    // 如果后端数据中没有相同的场馆名称，才添加用户输入的作为自定义选项
    if (!existingVenue) {
      mockData.unshift({
        venueName: searchValue,
        venueCode: '', // 自定义场馆没有编码
        address: '', // 自定义场馆没有地址
        isCustom: true
      })
    }

    return {
      code: 200,
      data: mockData,
      message: '搜索成功'
    }
  } catch (error) {
    console.error('搜索场馆失败:', error)
    throw new Error('搜索场馆失败')
  }
}

// 获取医院级别列表
export const getHospitalLevelList = async () => {
  try {
    // 这里应该调用真实的后端API
    // const response = await fetch('/api/hospital/levels')
    // const data = await response.json()
    // return data

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 200))

    // 模拟后端返回数据
    const mockData = [{
        catId: "hospitalLevel",
        catName: "医院等级",
        dictCd: "10",
        dictName: "一级"
      },
      {
        catId: "hospitalLevel",
        catName: "医院等级",
        dictCd: "1a",
        dictName: "一级甲等"
      },
      {
        catId: "hospitalLevel",
        catName: "医院等级",
        dictCd: "1b",
        dictName: "一级乙等"
      },
      {
        catId: "hospitalLevel",
        catName: "医院等级",
        dictCd: "1c",
        dictName: "一级丙等"
      },
      {
        catId: "hospitalLevel",
        catName: "医院等级",
        dictCd: "20",
        dictName: "二级"
      },
      {
        catId: "hospitalLevel",
        catName: "医院等级",
        dictCd: "2a",
        dictName: "二级甲等"
      },
      {
        catId: "hospitalLevel",
        catName: "医院等级",
        dictCd: "2b",
        dictName: "二级乙等"
      },
      {
        catId: "hospitalLevel",
        catName: "医院等级",
        dictCd: "2c",
        dictName: "二级丙等"
      },
      {
        catId: "hospitalLevel",
        catName: "医院等级",
        dictCd: "30",
        dictName: "三级"
      },
      {
        catId: "hospitalLevel",
        catName: "医院等级",
        dictCd: "3a",
        dictName: "三级甲等"
      },
      {
        catId: "hospitalLevel",
        catName: "医院等级",
        dictCd: "3b",
        dictName: "三级乙等"
      },
      {
        catId: "hospitalLevel",
        catName: "医院等级",
        dictCd: "3c",
        dictName: "三级丙等"
      },
      {
        catId: "hospitalLevel",
        catName: "医院等级",
        dictCd: "00",
        dictName: "其他"
      },
      {
        catId: "hospitalLevel",
        catName: "医院等级",
        dictCd: "3d",
        dictName: "三级特等"
      }
    ]

    return {
      code: 200,
      data: mockData,
      message: '获取成功'
    }
  } catch (error) {
    console.error('获取医院级别列表失败:', error)
    throw new Error('获取医院级别列表失败')
  }
}

// 获取活动位置列表
export const getActiveLocationList = async () => {
  try {
    // 这里应该调用真实的后端API
    // const response = await fetch('/api/activity/locations')
    // const data = await response.json()
    // return data

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 200))

    // 模拟后端返回数据
    const mockData = [{
        catId: "activeLocation",
        catName: "活动位置",
        dictCd: "1",
        dictName: "院内"
      },
      {
        catId: "activeLocation",
        catName: "活动位置",
        dictCd: "2",
        dictName: "驿站"
      },
      {
        catId: "activeLocation",
        catName: "活动位置",
        dictCd: "3",
        dictName: "VIP室"
      }
    ]

    return {
      code: 200,
      data: mockData,
      message: '获取成功'
    }
  } catch (error) {
    console.error('获取活动位置列表失败:', error)
    throw new Error('获取活动位置列表失败')
  }
}

// 获取活动场地列表
export const getActiveVenueList = async () => {
  try {
    // 这里应该调用真实的后端API
    // const response = await fetch('/api/activity/venues')
    // const data = await response.json()
    // return data

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))

    // 模拟后端返回数据
    const mockData = [{
        dictName: '健保通医院',
        dictCd: 'HEALTH_HOSP'
      },
      {
        dictName: '健财中心',
        dictCd: 'WEALTH_CENTER'
      },
      {
        dictName: '养老社区',
        dictCd: 'COMMUNITY'
      },
      {
        dictName: '拜博',
        dictCd: 'BYBO'
      },
      {
        dictName: '职场',
        dictCd: 'WORK_PLACE'
      },
      {
        dictName: '酒店',
        dictCd: 'HOTEL'
      },
      {
        dictName: '其他',
        dictCd: 'OTHER'
      }
    ]

    return {
      code: 200,
      data: mockData,
      message: '获取成功'
    }
  } catch (error) {
    console.error('获取活动场地列表失败:', error)
    throw new Error('获取活动场地列表失败')
  }
}