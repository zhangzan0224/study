// This function now accepts the form's data to allow for cross-field validation.
export const getFormRules = (formData) => {

  // Custom validator for URLs
  const validateLink = (val) => {
    if (!val) return true; // Allow empty value if not required
    const reg = /^(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~\+#]*[\w\-@?^=%&/~\+#])?$/;
    return reg.test(val);
  };

  // Custom validators for date-time range
  const validateStartTime = (val) => {
    if (!val) return true; // The 'required' rule will handle the empty case
    if (formData.endTime && new Date(val) > new Date(formData.endTime)) {
      return '开始时间不能晚于结束时间';
    }
    return true;
  };

  const validateEndTime = (val) => {
    if (!val) return true; // The 'required' rule will handle the empty case
    if (formData.startTime && new Date(val) < new Date(formData.startTime)) {
      return '结束时间不能早于开始时间';
    }
    return true;
  };

  const offlineOrBoth = ['OFFLINE', 'BOTH'].includes(formData.heldType);

  return {
    startTime: [{
        required: true,
        message: '请选择开始时间',
        trigger: 'onChange'
      },
      {
        validator: validateStartTime,
        trigger: 'onChange'
      }
    ],
    endTime: [{
        required: true,
        message: '请选择结束时间',
        trigger: 'onChange'
      },
      {
        validator: validateEndTime,
        trigger: 'onChange'
      }
    ],
    activeName: [{
        required: true,
        message: '请输入活动名称',
        trigger: 'onBlur'
      },
      {
        validator: (val) => val.length <= 30,
        message: '不能超过30个汉字和符号',
        trigger: 'onChange'
      }
    ],
    branchCode: [{
      required: true,
      message: '请选择分公司',
      trigger: 'onChange'
    }],
    subbranchCode: [{
      required: true,
      message: '请选择中支',
      trigger: 'onChange'
    }],
    stationPilotType: [{
      required: true,
      message: '请选择站点/试点类型',
      trigger: 'onChange'
    }],
    strategy: [{
      required: true,
      message: '请选择攻略',
      trigger: 'onChange'
    }],
    activeChannel: [{
      required: true,
      message: '请选择活动渠道',
      trigger: 'onChange'
    }],
    activeCategory: [{
      required: true,
      message: '请选择活动分类',
      trigger: 'onChange'
    }],
    healthRelate: [{
      required: true,
      message: '请选择是否大健康相关',
      trigger: 'onChange'
    }],
    activeVenue: [{
      required: true,
      message: '请选择活动场地',
      trigger: 'onChange'
    }],
    location: [
      ...(
        offlineOrBoth ? [{
          required: true,
          message: '请选择活动省市',
          trigger: 'onChange'
        }] : []
      )
    ],
    activeLocation: [{
      required: true,
      message: '请选择活动位置',
      trigger: 'onChange'
    }],
    activeType: [{
      required: true,
      message: '请选择活动内容',
      trigger: 'onChange'
    }],
    heldType: [{
      required: true,
      message: '请选择活动方式',
      trigger: 'onChange'
    }],
    locationAreaArr: [], // Not required
    address: [
      ...(
        offlineOrBoth ? [{
          required: true,
          message: '请输入详细地址',
          trigger: 'onBlur'
        }] : []
      ),
      {
        validator: (val) => !val || val.length <= 100,
        message: '不能超过100个汉字和符号',
        trigger: 'onChange'
      }
    ],
    activeVenueDetail: [{
        required: true,
        message: '请输入场地信息',
        trigger: 'onBlur'
      },
      {
        validator: (val) => val.length <= 25,
        message: '不能超过25个汉字和符号',
        trigger: 'onChange'
      }
    ],
    hospitalName: [{
        required: true,
        message: '请选择或输入医院名称',
        trigger: 'onChange'
      },
      {
        validator: (val) => val.length <= 100,
        message: '不能超过100个字符',
        trigger: 'onChange'
      }
    ],
    hospitalLevel: [{
      required: true,
      message: '请选择医院级别',
      trigger: 'onChange'
    }],
    communityName: [{
      required: true,
      message: '请选择社区名称',
      trigger: 'onChange'
    }],
    signQrcode: [{
      required: true,
      message: '请选择签到二维码',
      trigger: 'onChange'
    }],
    activeRemark: [{
      validator: (val) => !val || val.length <= 50,
      message: '不能超过50个汉字及符号',
      trigger: 'onChange'
    }],
    centerName: [{
        required: true,
        message: '请选择或输入场馆名称',
        trigger: 'onChange'
      },
      {
        validator: (val) => val.length <= 25,
        message: '不能超过25个字符',
        trigger: 'onChange'
      }
    ],
    liveUrl: [{
      validator: validateLink,
      message: '请输入http://或者https://的URL链接',
      trigger: 'onBlur'
    }],
    isPublish: [{
      required: true,
      message: '请选择是否发布',
      trigger: 'onChange'
    }],
    hasSpecialServer: [{
      required: true,
      message: '请选择是否含特殊服务',
      trigger: 'onChange'
    }]
  };
};