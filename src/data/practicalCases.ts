// 实用案例数据
export interface CaseItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  functionLinks: {
    label: string;
    route: string;
    params?: any;
  }[];
  detailContent: string;
  priority: number; // 推荐优先级
}

export const practicalCases: CaseItem[] = [
  // 新增重点案例 - 购房决策
  {
    id: 'housing-decision-analysis',
    title: '这套房该不该买？测一测你的购房决策是否踩中财务雷区',
    description: '房地产市场分化加剧的当下，购房决策关乎家庭财务安全。从购房用途、财务能力、持有周期等维度层层拆解，避免踩中财务雷区',
    image: '/lovable-uploads/b1708a7e-7651-4c73-9e2f-3e97cc5114c1.png',
    category: '买房置业',
    tags: ['购房决策', '财务风险', '投资评估', '现金流管理'],
    functionLinks: [
      { label: '评估购房财务能力', route: '#', params: {} },
      { label: '测算家庭现金流', route: '#', params: {} },
      { label: '购房风险评估', route: '#', params: {} },
      { label: '使用贷款计算器', route: '#', params: {} }
    ],
    detailContent: `在房地产市场分化加剧、未来走势不明朗的当下，购房早已不是简单的 "买不买" 选择题，而是关乎家庭财务安全的重大决策。尤其在市场波动中，一步踏错就可能踩中财务雷区，让家庭陷入长期经济压力。那么，到底该如何判断一套房该不该买？关键要从购房用途、财务能力、持有周期及风险承受力等维度层层拆解，而系统工具能帮你精准测算每一步的可行性。

先明确：你买房是为了什么？

购房决策的第一步，是分清投资需求和自住需求—— 这直接决定了判断逻辑的核心。

如果是投资购房，在当前市场环境下需格外慎重。投资的核心是 "房产未来的价值变化"，而非个人财务能力。你需要重点研究市场走势、区域升值潜力、房产流通性等，先厘清 "这笔投资会不会亏损"，再决定是否出手。毕竟投资不是刚需，若对未来房价走势没有明确判断，盲目入场很可能成为 "接盘侠"。

如果是自住购房，则属于刚性需求范畴。此时决策的核心不是 "房产会不会升值"，而是 "你有没有实力拥有它"。因为住房需求可以通过租房或买房满足，最终选择哪种方式，本质是经济实力的考量 —— 有能力负担时，再谈 "何时买、如何买"。

核心判断：你的财务能力能不能扛住？

自住购房的关键是财务评估，这需要从 "短期支付" 和 "长期承受" 两方面算清账。

第一步：算清总支出，心里有本明白账

首先要明确购房的 "全周期成本"：
• 目标房价：确定想买的房子总价，区分一手房还是二手房（两者税费差异大，二手房可能涉及中介费、增值税等额外成本）；
• 长期固定支出：物业费、装修费、维修基金等，这些是持有房产后每月或定期产生的开销；
• 交易成本：首付、契税、印花税等一次性支出。

把这些费用汇总，才能为后续的财务评估打下基础。

第二步：短期支付能力够不够？

光知道总支出还不够，得先看 "当下能不能拿出启动资金"。比如：
• 首付和交易成本是否在可承受范围内？会不会动用应急储备金（比如孩子教育金、老人医疗费）？
• 若需要贷款，首月月供是否会挤压基本生活开支（如饮食、水电、赡养老人等）？

这一步的核心是：不因为买房让当下的生活陷入困境。

第三步：长期还款能力扛不扛得住？

如果需要贷款，千万别只看 "月供收入比"—— 这是很多人踩坑的地方。因为每个家庭的支出结构、财务负担、生活标准都不同：有的家庭要还车贷、养孩子，有的家庭则无其他负债，单纯用 "月供不超过收入 50%" 来判断并不合理。

正确的做法是：把房贷融入家庭整体现金流。比如：
• 未来 5-10 年，家庭可能面临哪些大额支出（如孩子上学、父母生病）？这些支出与月供叠加后，现金流会不会断裂？
• 收入是否稳定？若遭遇裁员、降薪，现有储蓄能支撑几个月月供？
• 除了月供，是否预留了 3-6 个月的应急资金？

只有当长期现金流能稳定覆盖房贷和基本生活开支，才算具备真正的还款能力。

关键风险点：持有周期与 "长期持有能力" 的隐性考验

判断一套房该不该买，必须穿透 "持有周期" 的表象 —— 不仅要明确 "你想持有多久"，更要验证 "你有没有能力长期持有"。

情况一：短期持有（阶段性需求）

若你是 "过渡性购房"（如结婚过渡、学区房短期使用），计划 5 年内卖掉换房，核心关注点是房产的流通性和保值性：
• 地段是否核心？周边配套（学校、地铁、商圈）是否成熟？
• 同小区近期成交周期多长？价格跌幅是否明显？
• 房龄、户型是否符合主流需求（老破小流通性通常差于次新房）？

这类房产本质是 "阶段性工具"，若流通性差，未来可能卖不出好价钱，甚至影响家庭后续资金规划。

情况二：长期持有

若计划 "住一辈子"，需重点验证 "长期持有能力"—— 即未来是否可能因财务压力被迫提前卖房。比如：
• 退休后收入下降，是否需要卖房凑养老金、支付养老院费用？
• 突发重大疾病，积蓄耗尽，是否不得不靠卖房筹集医疗费？
• 孩子出国留学、创业需要大额资金，是否只能通过卖房解决？

这些 "非自愿变现" 的场景，往往在购房时被乐观心态掩盖。你需要测算：按家庭当前财务增速（收入增长、储蓄积累），未来是否可能因大额支出被迫卖房？若答案是 "是"，就必须提前关注房产的 "保值性"—— 哪怕现在想长期持有，也得确保它未来能卖出好价钱。

为什么需要系统帮忙？这些测算你自己很难算清

普通人靠手动计算购房决策，很容易陷入 "漏项""误判" 的陷阱。而系统能从三个维度帮你精准把关：

1. 全成本核算：自动汇总一手房 / 二手房的税费（契税、中介费等）、装修费、物业费等，避免 "首付够了却付不起交易费" 的尴尬。

2. 家庭现金流模拟：将房贷融入家庭整体财务体系，测算未来生涯的收支平衡 —— 比如孩子上学、父母生病等阶段的额外支出与月供叠加后，现金流是否会断裂？轻松验证 "长期持有能力"。

3. 风险压力测试：模拟失业、降薪、重疾等突发场景，测算储蓄能支撑几个月月供，是否会出现断供风险。比如 "若夫妻一方失业 6 个月，家庭储蓄能否覆盖月供 + 基本开支？"

总结：这套房该不该买？三个核心标尺 + 系统验证

在复杂的房地产环境中，判断一套房该不该买，需用三个标尺衡量，再通过系统验证：

1、用途先行：投资需慎之又慎，重点看房产未来升值潜力；自住则聚焦 "是否必须拥有"。

2、财务能力：短期能拿出首付和交易成本，长期现金流能覆盖房贷 + 生活开支，且预留应急资金。

3、持有能力：短期持有看流通性，长期持有验证 "非自愿变现" 时的保值能力。

系统将根据这些标尺，对你购房的相关问题给出明确的解答："你的购房计划是否具备实施条件？如何选择最优贷款方案（确保还款无忧且利息最低）？是否存在断供的可能性？其背后的原因是什么？是否需要紧密跟踪房价走势？是否能够长期持有房产？"…… 从而助你远离财务隐患，真正实现"买得放心、住得安心"。`,
    priority: 10
  },
  // 结婚规划类
  {
    id: 'marriage-budget',
    title: '结婚预算怎么规划？',
    description: '从订婚到婚礼，合理安排每一笔开支，让美好回忆不留经济负担',
    image: '/lovable-uploads/b1708a7e-7651-4c73-9e2f-3e97cc5114c1.png',
    category: '结婚规划',
    tags: ['婚礼预算', '理财规划', '支出管理'],
    functionLinks: [
      { label: '查看生活支出规划', route: '/new', params: { activeTab: 'planning', activePlanningTab: 'life-events' } },
      { label: '使用财务计算器', route: '/new', params: { activeTab: 'tools', activeToolsTab: 'future-prediction' } }
    ],
    detailContent: '结婚是人生大事，合理的预算规划能让这个特殊时刻更加完美。建议将婚礼预算控制在年收入的20-30%以内，并提前6-12个月开始储备。可以通过我们的生活支出规划功能，详细计算婚礼各项开支，包括婚纱摄影、酒席、蜜月旅行等，确保在预算范围内实现梦想婚礼。',
    priority: 9
  },
  {
    id: 'new-home-planning',
    title: '新婚房屋如何选择？',
    description: '租房还是买房？地段还是面积？为新婚生活做出最佳居住选择',
    image: '/lovable-uploads/b1708a7e-7651-4c73-9e2f-3e97cc5114c1.png',
    category: '结婚规划',
    tags: ['房屋选择', '置业规划', '生活成本'],
    functionLinks: [
      { label: '查看资产负债规划', route: '/new', params: { activeTab: 'planning', activePlanningTab: 'assets-liabilities' } },
      { label: '评估购房风险', route: '/new', params: { activeTab: 'risk', activeRiskTab: 'secondary-risk' } }
    ],
    detailContent: '新婚夫妇的居住选择需要综合考虑经济能力、工作地点、未来规划等因素。如果首付能力不足，建议先租房积累资金；如果有稳定收入且首付充足，可考虑购买适中面积的房产。使用我们的资产负债规划工具，可以清晰了解购房对财务状况的影响。',
    priority: 8
  },

  // 买房置业类
  {
    id: 'first-home-down-payment',
    title: '首套房首付怎么准备？',
    description: '多少首付合适？如何快速积累？让买房梦想照进现实',
    image: '/lovable-uploads/b1708a7e-7651-4c73-9e2f-3e97cc5114c1.png',
    category: '买房置业',
    tags: ['首付准备', '储蓄计划', '购房规划'],
    functionLinks: [
      { label: '制定储蓄计划', route: '/new', params: { activeTab: 'planning', activePlanningTab: 'career-income' } },
      { label: '计算购房压力', route: '/new', params: { activeTab: 'tools', activeToolsTab: 'future-prediction' } }
    ],
    detailContent: '首套房首付通常需要房价的20-30%。建议提前2-3年开始准备，通过合理的储蓄和投资计划积累资金。可以考虑：1）设立专门的购房基金；2）选择稳健的理财产品；3）适当控制消费支出。使用我们的职业收入规划功能，制定详细的储蓄目标和时间表。',
    priority: 10
  },
  {
    id: 'mortgage-strategy',
    title: '房贷方案如何选择？',
    description: '等额本息还是等额本金？贷款年限怎么定？选对方案省十万',
    image: '/lovable-uploads/b1708a7e-7651-4c73-9e2f-3e97cc5114c1.png',
    category: '买房置业',
    tags: ['房贷选择', '还款方式', '利息优化'],
    functionLinks: [
      { label: '分析现金流影响', route: '/new', params: { activeTab: 'discover' } },
      { label: '评估还款风险', route: '/new', params: { activeTab: 'risk', activeRiskTab: 'main-risk' } }
    ],
    detailContent: '房贷方案的选择直接影响未来几十年的财务状况。等额本息适合收入稳定的人群，月供压力小；等额本金总利息较少，但前期还款压力大。贷款年限建议根据年龄和收入情况确定，一般不超过65岁退休。通过我们的现金流分析工具，可以直观看到不同方案对财务的长期影响。',
    priority: 9
  },

  // 育儿教育类
  {
    id: 'education-fund',
    title: '孩子教育金如何准备？',
    description: '从幼儿园到大学，教育投资一步到位，让孩子赢在起跑线',
    image: '/lovable-uploads/b1708a7e-7651-4c73-9e2f-3e97cc5114c1.png',
    category: '育儿教育',
    tags: ['教育储蓄', '子女规划', '长期投资'],
    functionLinks: [
      { label: '规划教育支出', route: '/new', params: { activeTab: 'planning', activePlanningTab: 'life-events' } },
      { label: '计算教育成本', route: '/new', params: { activeTab: 'tools', activeToolsTab: 'future-prediction' } }
    ],
    detailContent: '教育金准备需要考虑通胀因素，建议在孩子出生后就开始规划。可以通过定期储蓄、教育基金、保险等方式积累。根据不同教育阶段的费用预估：幼儿园3-5万/年，小学1-3万/年，中学3-8万/年，大学10-20万/年。使用我们的生活支出规划工具，可以制定详细的教育金储备计划。',
    priority: 8
  },
  {
    id: 'school-district-house',
    title: '学区房值得买吗？',
    description: '教育投资还是房产投资？理性分析学区房的真实价值',
    image: '/lovable-uploads/b1708a7e-7651-4c73-9e2f-3e97cc5114c1.png',
    category: '育儿教育',
    tags: ['学区房', '教育投资', '房产价值'],
    functionLinks: [
      { label: '分析购房影响', route: '/new', params: { activeTab: 'planning', activePlanningTab: 'assets-liabilities' } },
      { label: '评估投资风险', route: '/new', params: { activeTab: 'risk', activeRiskTab: 'secondary-risk' } }
    ],
    detailContent: '学区房投资需要综合考虑教育收益和财务成本。建议分析：1）学区房溢价是否合理；2）家庭财务承受能力；3）教育政策变化风险；4）未来转手可能性。不要为了买学区房而过度负债，可以考虑租房就读、优质民办学校等替代方案。',
    priority: 7
  },

  // 职业发展类
  {
    id: 'career-transition',
    title: '跳槽转行如何规划？',
    description: '职业转换的黄金法则，让每一次选择都成为人生的加分项',
    image: '/lovable-uploads/b1708a7e-7651-4c73-9e2f-3e97cc5114c1.png',
    category: '职业发展',
    tags: ['跳槽规划', '职业转型', '收入提升'],
    functionLinks: [
      { label: '分析收入影响', route: '/new', params: { activeTab: 'planning', activePlanningTab: 'career-income' } },
      { label: '评估转职风险', route: '/new', params: { activeTab: 'risk', activeRiskTab: 'secondary-risk' } }
    ],
    detailContent: '跳槽转行前需要做好充分准备：1）评估当前财务状况，确保有3-6个月的生活费储备；2）分析目标行业的发展前景和收入水平；3）提升相关技能，降低转换成本；4）制定过渡期的财务计划。使用我们的职业收入规划工具，可以模拟不同职业路径的财务影响。',
    priority: 8
  },
  {
    id: 'skill-investment',
    title: '技能提升怎么投资？',
    description: '教育投资回报率最高，选对方向让能力变现更容易',
    image: '/lovable-uploads/b1708a7e-7651-4c73-9e2f-3e97cc5114c1.png',
    category: '职业发展',
    tags: ['技能投资', '自我提升', '收入增长'],
    functionLinks: [
      { label: '规划学习支出', route: '/new', params: { activeTab: 'planning', activePlanningTab: 'life-events' } },
      { label: '分析投资回报', route: '/new', params: { activeTab: 'discover' } }
    ],
    detailContent: '技能投资应该围绕职业发展目标进行。建议将年收入的3-5%用于技能提升，重点投资于：1）行业核心技能；2）跨界通用能力；3）数字化技能；4）管理领导力。要计算投资回报率，评估技能提升对收入增长的贡献，确保投资的有效性。',
    priority: 7
  },

  // 退休规划类
  {
    id: 'retirement-savings',
    title: '养老金如何规划？',
    description: '提前布局退休生活，让老年时光更有保障和尊严',
    image: '/lovable-uploads/b1708a7e-7651-4c73-9e2f-3e97cc5114c1.png',
    category: '退休规划',
    tags: ['养老储蓄', '退休规划', '长期投资'],
    functionLinks: [
      { label: '制定养老计划', route: '/new', params: { activeTab: 'planning', activePlanningTab: 'life-events' } },
      { label: '计算养老需求', route: '/new', params: { activeTab: 'tools', activeToolsTab: 'future-prediction' } }
    ],
    detailContent: '养老规划要从年轻时开始，建议按照"三支柱"模式：1）基本养老保险；2）企业年金或职业年金；3）个人养老储蓄投资。目标是退休后收入能达到退休前的70-80%。可以通过定期储蓄、养老基金、商业养老保险等方式积累养老资金。',
    priority: 6
  },
  {
    id: 'healthcare-planning',
    title: '医疗保障怎么配置？',
    description: '健康是最大的财富，完善的医疗保障让生活更安心',
    image: '/lovable-uploads/b1708a7e-7651-4c73-9e2f-3e97cc5114c1.png',
    category: '退休规划',
    tags: ['医疗保险', '健康管理', '风险防范'],
    functionLinks: [
      { label: '评估医疗风险', route: '/new', params: { activeTab: 'risk', activeRiskTab: 'main-risk' } },
      { label: '规划保险支出', route: '/new', params: { activeTab: 'planning', activePlanningTab: 'life-events' } }
    ],
    detailContent: '医疗保障体系应该包括：1）基本医疗保险；2）补充医疗保险；3）重疾险；4）意外医疗险。建议医疗保险支出占家庭收入的8-12%。年轻时侧重保障型产品，中年时加强重疾保障，老年时关注长期护理险。',
    priority: 8
  },

  // 风险应对类
  {
    id: 'emergency-fund',
    title: '应急资金如何准备？',
    description: '未雨绸缪，建立财务安全垫，让意外不再可怕',
    image: '/lovable-uploads/b1708a7e-7651-4c73-9e2f-3e97cc5114c1.png',
    category: '风险应对',
    tags: ['应急基金', '风险防范', '流动性管理'],
    functionLinks: [
      { label: '分析资金缺口', route: '/new', params: { activeTab: 'discover' } },
      { label: '评估流动性风险', route: '/new', params: { activeTab: 'risk', activeRiskTab: 'main-risk' } }
    ],
    detailContent: '应急资金是财务安全的基础，建议准备3-6个月的生活费用。资金应放在流动性好的产品中，如活期存款、货币基金等。金额计算：单身人士3个月支出，有家庭的6个月支出，自由职业者9-12个月支出。定期检查和补充，确保应急资金的充足性。',
    priority: 10
  },
  {
    id: 'job-loss-preparation',
    title: '失业风险如何防范？',
    description: '职场变化莫测，做好准备让危机变成转机',
    image: '/lovable-uploads/b1708a7e-7651-4c73-9e2f-3e97cc5114c1.png',
    category: '风险应对',
    tags: ['失业保障', '职业安全', '收入多元化'],
    functionLinks: [
      { label: '评估失业风险', route: '/new', params: { activeTab: 'risk', activeRiskTab: 'secondary-risk' } },
      { label: '规划副业收入', route: '/new', params: { activeTab: 'planning', activePlanningTab: 'career-income' } }
    ],
    detailContent: '失业风险防范包括：1）建立充足的应急资金；2）持续提升个人技能；3）维护职业人脉关系；4）发展副业或兼职收入；5）了解失业保险政策。建议准备6-12个月的生活费用，并制定失业后的求职和生活计划。',
    priority: 9
  }
];

// 按类别分组
export const casesByCategory = practicalCases.reduce((acc, case_) => {
  if (!acc[case_.category]) {
    acc[case_.category] = [];
  }
  acc[case_.category].push(case_);
  return acc;
}, {} as Record<string, CaseItem[]>);

// 获取推荐案例（根据优先级和用户状态）
export const getRecommendedCases = (userContext?: {
  age?: number;
  wealthType?: string;
  hasFinancialGap?: boolean;
  limit?: number;
}) => {
  let filteredCases = [...practicalCases];
  
  // 根据用户上下文过滤
  if (userContext?.hasFinancialGap) {
    // 有财务缺口的用户优先推荐风险应对和理财规划类案例
    filteredCases.sort((a, b) => {
      const aIsRisk = a.category === '风险应对';
      const bIsRisk = b.category === '风险应对';
      if (aIsRisk && !bIsRisk) return -1;
      if (!aIsRisk && bIsRisk) return 1;
      return b.priority - a.priority;
    });
  } else {
    // 按优先级排序
    filteredCases.sort((a, b) => b.priority - a.priority);
  }
  
  // 限制返回数量
  return filteredCases.slice(0, userContext?.limit || 4);
};

export const categories = Object.keys(casesByCategory);