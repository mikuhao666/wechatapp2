import { Application } from '../types';

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'SQ-20260824-001',
    type: '单位',
    applicant: '湖北楚盛香菇农业开发有限公司',
    idCardOrCreditCode: '91421300MA49XYZ123',
    phone: '13872886618',
    address: '随州市随县厉山镇双泉村香菇现代化示范基地',
    disasterType: '雷暴大风',
    occurrenceTime: '2026-08-22 15:40 至 17:30',
    location: '随县厉山镇双泉村5组食用菌大棚基地',
    reason: '强对流天气导致18个标准化香菇恒温连栋大棚薄膜及钢结构骨架被狂风掀翻毁坏，向中国人民财产保险股份有限公司随州分公司申报农险理赔需开具官方气象证明。',
    submitTime: '2026-08-23 09:30',
    status: '待审批',
    materials: [
      { id: 'm1', name: '企业营业执照副本扫描件.pdf', size: '1.8 MB', type: 'pdf', uploadTime: '2026-08-23 09:20', description: '企业信用代码真实有效' },
      { id: 'm2', name: '香菇大棚受灾倒塌现场全景照片.jpg', size: '3.4 MB', type: 'image', uploadTime: '2026-08-23 09:22', description: '受损钢结构骨架全貌' },
      { id: 'm3', name: '保险公司勘查核损告知函.pdf', size: '890 KB', type: 'pdf', uploadTime: '2026-08-23 09:25', description: '人保财险随州分公司出具' },
    ],
    certificate: {
      certNumber: '随气证〔2026〕第0824号',
      title: '湖北省随州市气象局气象灾害证明书',
      content: '兹证明2026年08月22日15时40分至17时30分期间，在随州市随县厉山镇双泉村及周边区域，发生短时强对流伴随雷暴大风极端天气。国家气象观测站（随县站）及厉山区域自动气象监测站观测数据显示：过程最大极大风速达24.8米/秒（达到10级强风标准），伴有短时强降水，瞬时雨强达38.5毫米/小时，雷电频次密集，符合雷暴大风灾害认定标准。',
      disasterTimeText: '2026年08月22日15:40至17:30',
      location: '随州市随县厉山镇双泉村',
      disasterType: '雷暴大风',
      obsDataSummary: '随县厉山站极大风速24.8m/s (10级)，瞬时降水量38.5mm/h',
      recipientOrg: '中国人民财产保险股份有限公司随州分公司',
      draftedBy: '工作人员（李明）',
      draftDate: '2026-08-24 10:15',
      reviewComment: '已比对区域站历史监测序列，受灾时段观测数据吻合，建议审批通过。',
    },
    logs: [
      { id: 'l1', time: '2026-08-23 09:30', operator: '楚盛农业（经办人王工）', role: '申请人', action: '网上提交气象证明申请', note: '附带3份佐证材料' },
      { id: 'l2', time: '2026-08-23 11:20', operator: '工作人员（李明）', role: '业务科经办', action: '申请受理通过，调取区域站监测数据', note: '调取厉山站分钟级风速数据' },
      { id: 'l3', time: '2026-08-24 10:15', operator: '工作人员（李明）', role: '业务科经办', action: '起草气象证明并提交领导审批', note: '文号随气证〔2026〕第0824号' }
    ]
  },
  {
    id: 'SQ-20260825-002',
    type: '个人',
    applicant: '张建国',
    idCardOrCreditCode: '421302197508123419',
    phone: '13971798823',
    address: '随州市曾都区何店镇王家湾村4组',
    disasterType: '暴雨洪涝',
    occurrenceTime: '2026-08-24 02:00 至 08:30',
    location: '随州市曾都区何店镇王家湾村',
    reason: '夜间突降特大暴雨致池塘积水暴涨溃漫，承包鱼塘中40亩成鱼被冲失，村委会已勘查现场，需气象局出具降雨量证明以办理政策性农业保险赔付。',
    submitTime: '2026-08-25 08:45',
    status: '开具中',
    materials: [
      { id: 'm4', name: '申请人身份证正反面.pdf', size: '1.2 MB', type: 'pdf', uploadTime: '2026-08-25 08:40', description: '身份证明' },
      { id: 'm5', name: '受灾鱼塘现场漫堤照片.jpg', size: '4.1 MB', type: 'image', uploadTime: '2026-08-25 08:42', description: '水淹塘埂受损实况' },
      { id: 'm6', name: '何店镇王家湾村委会受灾证明函.pdf', size: '960 KB', type: 'pdf', uploadTime: '2026-08-25 08:43', description: '村委会盖章核验' }
    ],
    certificate: {
      certNumber: '随气证〔2026〕第0825号',
      title: '湖北省随州市气象局气象灾害证明书',
      content: '兹证明2026年08月24日02时至08时30分，在随州市曾都区何店镇（地点），发生特大暴雨（灾害类型），气象观测数据显示：曾都区何店区域气象观测站6小时累计降雨量达142.3毫米，达到大暴雨量级标准，过程雨强峰值出现在04时至05时（51.2毫米/小时）。',
      disasterTimeText: '2026年08月24日02:00至08:30',
      location: '随州市曾都区何店镇王家湾村',
      disasterType: '暴雨洪涝',
      obsDataSummary: '何店自动站累计降水142.3毫米，峰值雨强51.2mm/h',
      recipientOrg: '中华联合财产保险股份有限公司随州中心支公司',
      draftedBy: '工作人员（李明）',
      draftDate: '2026-08-25 14:00'
    },
    logs: [
      { id: 'l4', time: '2026-08-25 08:45', operator: '张建国', role: '申请人', action: '提交暴雨灾害证明申请' },
      { id: 'l5', time: '2026-08-25 10:00', operator: '工作人员（李明）', role: '业务科经办', action: '受理事宜并调取雨量观测实况' }
    ]
  },
  {
    id: 'SQ-20260826-003',
    type: '单位',
    applicant: '广水市天源光伏电力工程有限公司',
    idCardOrCreditCode: '91421381MA4889988C',
    phone: '15172782299',
    address: '广水市十里工业园楚风大道16号',
    disasterType: '冰雹灾害',
    occurrenceTime: '2026-08-21 16:10 至 16:50',
    location: '广水市武胜关镇光伏电站阵区',
    reason: '局地强冰雹直接击碎地面集中式光伏组件电板146块及逆变变压装置，特向气象局申请客观天气实况证明用于保险理赔核定。',
    submitTime: '2026-08-22 14:10',
    status: '已通过',
    materials: [
      { id: 'm7', name: '光伏电站受损组件清单及现场勘验照.pdf', size: '5.6 MB', type: 'pdf', uploadTime: '2026-08-22 14:05', description: '受灾组件清单' },
      { id: 'm8', name: '法人身份证及授权委托书.pdf', size: '1.1 MB', type: 'pdf', uploadTime: '2026-08-22 14:08', description: '法定委托证明' }
    ],
    certificate: {
      certNumber: '随气证〔2026〕第0822号',
      title: '湖北省随州市气象局气象灾害证明书',
      content: '兹证明2026年08月21日16时10分至16时50分，在随州市广水市武胜关镇及周边区域，发生强对流局地冰雹伴雷暴天气。随州市新一代天气雷达及武胜关区域自动气象站监测数据显示：雷达基本反射率因子达到62dBZ并呈现明显三体散射特征，地面观测站记录到最大风速19.6米/秒，地面冰雹最大直径达25毫米，持续约15分钟。',
      disasterTimeText: '2026年08月21日16:10至16:50',
      location: '广水市武胜关镇',
      disasterType: '冰雹灾害',
      obsDataSummary: '雷达反射率62dBZ，最大直径25mm，极大风速19.6m/s',
      recipientOrg: '中国平安财产保险股份有限公司随州中心支公司',
      draftedBy: '工作人员（李明）',
      draftDate: '2026-08-22 16:30',
      reviewComment: '雷达回波与地面站记录事实清楚，符合证明开具规定，同意签发。',
      reviewedBy: '领导（王局长）',
      reviewDate: '2026-08-23 09:10'
    },
    logs: [
      { id: 'l6', time: '2026-08-22 14:10', operator: '天源光伏电力', role: '申请人', action: '提交冰雹灾害证明申请' },
      { id: 'l7', time: '2026-08-22 15:00', operator: '工作人员（李明）', role: '业务科经办', action: '受理并完成证明初审编制' },
      { id: 'l8', time: '2026-08-22 16:30', operator: '工作人员（李明）', role: '业务科经办', action: '呈报主管领导审批' },
      { id: 'l9', time: '2026-08-23 09:10', operator: '领导（王局长）', role: '分管局领导', action: '审批通过，加盖电子公章生成正式公文', note: '公文已归档并支持在线验真与打印' }
    ]
  },
  {
    id: 'SQ-20260827-004',
    type: '个人',
    applicant: '刘海峰',
    idCardOrCreditCode: '421302198904151210',
    phone: '13607289944',
    address: '随州市曾都区南郊白云湖东路18号',
    disasterType: '雷暴大风',
    occurrenceTime: '2026-08-20 10:00 至 11:00',
    location: '随州市曾都区南郊白云大道',
    reason: '停放于路边私家车辆（鄂S·8988A）被大树折断枝桠砸穿前挡风玻璃及天窗，申请大风证明报车险理赔。',
    submitTime: '2026-08-21 11:30',
    status: '已驳回',
    materials: [
      { id: 'm9', name: '车辆受损照片及交警事故快处单.pdf', size: '2.5 MB', type: 'pdf', uploadTime: '2026-08-21 11:25', description: '车辆损坏与报警记录' }
    ],
    certificate: {
      certNumber: '随气证〔2026〕第0821-退号',
      title: '气象灾害证明审批退回函',
      content: '经核查随州国家基本气象站（站号57476）监测记录，2026年08月20日10时至11时期间，市区风速平均为2.1米/秒（2级轻风），极大风速仅为4.3米/秒（3级微风），当日无大风灾害性天气记录，不满足大风气象灾害证明出具标准。',
      disasterTimeText: '2026年08月20日10:00至11:00',
      location: '曾都区南郊',
      disasterType: '雷暴大风',
      obsDataSummary: '随州基本站极大风速仅4.3m/s（3级），无大风记录',
      recipientOrg: '太平洋财产保险随州分公司',
      draftedBy: '工作人员（李明）',
      draftDate: '2026-08-21 14:00',
      rejectReason: '经调取事发地国家基本气象站当日分钟级风速序列，事发时段最大风速仅4.3米/秒（3级），未监测到雷暴或6级以上大风，不符合气象灾害证明出具法定条件。',
      reviewedBy: '领导（王局长）',
      reviewDate: '2026-08-21 16:20'
    },
    logs: [
      { id: 'l10', time: '2026-08-21 11:30', operator: '刘海峰', role: '申请人', action: '提交证明申请' },
      { id: 'l11', time: '2026-08-21 14:00', operator: '工作人员（李明）', role: '业务科经办', action: '查验气象数据库并标注无大风记录，拟不予出具' },
      { id: 'l12', time: '2026-08-21 16:20', operator: '领导（王局长）', role: '分管局领导', action: '审批驳回', note: '理由：气象观测数据无灾害性大风记录，依法不予证明' }
    ]
  },
  {
    id: 'SQ-20260828-005',
    type: '个人',
    applicant: '周秀英',
    idCardOrCreditCode: '421321196803212826',
    phone: '13872895566',
    address: '随州市随县安居镇王家岗村',
    disasterType: '高温干旱',
    occurrenceTime: '2026-07-15 至 2026-08-15',
    location: '随县安居镇王家岗村农田',
    reason: '连续30天极端高温少雨导致连片中稻抽穗扬花期严重受旱减产干瘪，需向安居镇农业农村办及农业保险公司申请农业巨灾救济保险理赔。',
    submitTime: '2026-08-28 10:15',
    status: '待受理',
    materials: [
      { id: 'm10', name: '土地承包合同及身份证复印件.pdf', size: '2.1 MB', type: 'pdf', uploadTime: '2026-08-28 10:10', description: '承包35亩水田' },
      { id: 'm11', name: '水稻田龟裂干涸现场照片.jpg', size: '3.8 MB', type: 'image', uploadTime: '2026-08-28 10:12', description: '土壤干裂中稻枯黄' }
    ],
    logs: [
      { id: 'l13', time: '2026-08-28 10:15', operator: '周秀英', role: '申请人', action: '网上提交高温干旱气象证明申请' }
    ]
  },
  {
    id: 'SQ-20260829-006',
    type: '单位',
    applicant: '随州市曾都区现代农业示范园',
    idCardOrCreditCode: '91421303MA49887766',
    phone: '13597881122',
    address: '随州市曾都区涢水街道办事处风光村',
    disasterType: '暴雨洪涝',
    occurrenceTime: '2026-08-24 03:00 至 07:00',
    location: '曾都区涢水街道风光村示范园区',
    reason: '涢水流域短时强降水引发内涝，智能温室苗圃花卉浸泡超5小时，需气象局出具暴雨气象观测证明申请专项灾后扶持。',
    submitTime: '2026-08-29 09:20',
    status: '待受理',
    materials: [
      { id: 'm12', name: '园区规划图及受损资产清单.pdf', size: '4.2 MB', type: 'pdf', uploadTime: '2026-08-29 09:15', description: '受损花卉品种与损失核算' }
    ],
    logs: [
      { id: 'l14', time: '2026-08-29 09:20', operator: '曾都农业示范园', role: '申请人', action: '网上提交暴雨灾害证明申请' }
    ]
  }
];

export const TEMPLATES = [
  {
    id: 't-rain',
    name: '暴雨洪涝证明模板',
    type: '暴雨洪涝',
    text: '兹证明{YEAR}年{MONTH}月{DAY}日{TIME}，在随州市{LOCATION}，发生短时强降水（暴雨）天气。随州市气象台国家气象观测站及区域自动气象观测网监测数据显示：该区域过程累计降水量达{DATA_1}毫米，最大小时雨强达到{DATA_2}毫米/小时，达到大暴雨量级认定技术标准。特此证明。'
  },
  {
    id: 't-wind',
    name: '雷暴大风证明模板',
    type: '雷暴大风',
    text: '兹证明{YEAR}年{MONTH}月{DAY}日{TIME}，在随州市{LOCATION}，发生雷暴大风强对流天气。随州市气象灾害监测预警系统及临近区域气象站数据显示：事发时段监测到极大风速达{DATA_1}米/秒（相当于{DATA_2}级大风），伴随雷电放电现象与短时强风切变。特此证明。'
  },
  {
    id: 't-hail',
    name: '冰雹灾害证明模板',
    type: '冰雹灾害',
    text: '兹证明{YEAR}年{MONTH}月{DAY}日{TIME}，在随州市{LOCATION}，发生强对流局地冰雹天气。随州新一代天气多普勒雷达及地面气象站监测数据显示：强降水回波中心强度超过{DATA_1}dBZ，具有显著冰雹云结构特征，地面记录到最大冰雹直径约{DATA_2}毫米，过程持续约20分钟。特此证明。'
  },
  {
    id: 't-drought',
    name: '高温干旱证明模板',
    type: '高温干旱',
    text: '兹证明{YEAR}年{MONTH}月{DAY}日至{END_DATE}期间，在随州市{LOCATION}，持续出现异常高温干旱天气。气象观测资料统计显示：该区域日最高气温≥35℃的高温日数达{DATA_1}天，极端最高气温达到{DATA_2}℃，同期降水量较常年偏少85%以上，达到气象干旱重旱（特旱）等级。特此证明。'
  },
  {
    id: 't-freeze',
    name: '低温冷冻与雪灾模板',
    type: '低温冻害',
    text: '兹证明{YEAR}年{MONTH}月{DAY}日{TIME}，在随州市{LOCATION}，发生低温雨雪冰冻灾害性天气。区域气象观测站实况数据显示：日最低气温降至{DATA_1}℃，持续地表积雪深度达{DATA_2}厘米，电线覆冰厚度达8毫米，达到低温冻害等级标准。特此证明。'
  }
];

export const MONTHLY_STATS = [
  { month: '2026-03', count: 18, finished: 18, avgDays: 1.5, rain: 6, wind: 4, hail: 2, other: 6 },
  { month: '2026-04', count: 24, finished: 23, avgDays: 1.4, rain: 10, wind: 8, hail: 3, other: 3 },
  { month: '2026-05', count: 32, finished: 31, avgDays: 1.3, rain: 15, wind: 10, hail: 4, other: 3 },
  { month: '2026-06', count: 45, finished: 44, avgDays: 1.2, rain: 26, wind: 12, hail: 5, other: 2 },
  { month: '2026-07', count: 58, finished: 55, avgDays: 1.1, rain: 32, wind: 16, hail: 7, other: 3 },
  { month: '2026-08', count: 62, finished: 58, avgDays: 1.1, rain: 35, wind: 18, hail: 6, other: 3 },
];
