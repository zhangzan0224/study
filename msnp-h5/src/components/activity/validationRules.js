import {
  ref
} from 'vue';

// Custom validator for URLs, adapted for Vant
const validateLink = (val) => {
  // The field is not required, so an empty value is considered valid.
  if (!val) {
    return true;
  }
  // If a value is provided, it must match the specified URL format.
  const reg = /^(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~\+#]*[\w\-@?^=%&/~\+#])?$/;
  return reg.test(val);
};

export const formRules = ref({
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
  activeLocation: [{
    required: true,
    message: '请选择活动位置',
    trigger: 'onChange'
  }],
  activeType: [{
    required: true,
    message: '请选择活动类型',
    trigger: 'onChange'
  }],
  heldType: [{
    required: true,
    message: '请选择举办形式',
    trigger: 'onChange'
  }],
  locationAreaArr: [], // Not required
  address: [{
    validator: (val) => !val || val.length <= 100,
    message: '不能超过100个汉字和符号',
    trigger: 'onChange'
  }],
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
});