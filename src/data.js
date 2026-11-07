export const categories = [
  { id: "english", label: "英文打字" },
  { id: "pinyin", label: "拼音练习" },
  { id: "code", label: "代码练习" },
];

export const difficulties = [
  { id: "beginner", label: "入门" },
  { id: "intermediate", label: "进阶" },
  { id: "advanced", label: "高阶" },
];

export const practiceTexts = [
  { category: "english", difficulty: "beginner", text: "the quick brown fox jumps over the lazy dog." },
  { category: "english", difficulty: "beginner", text: "practice every day and your typing will get better." },
  { category: "english", difficulty: "intermediate", text: "small improvements become remarkable results over time." },
  { category: "english", difficulty: "intermediate", text: "focus on accuracy first, then let your speed follow." },
  { category: "english", difficulty: "advanced", text: "consistency transforms deliberate practice into effortless skill." },
  { category: "english", difficulty: "advanced", text: "great interfaces make complex experiences feel delightfully simple." },
  { category: "pinyin", difficulty: "beginner", text: "ni hao shi jie, rang wo men kai shi lian xi da zi." },
  { category: "pinyin", difficulty: "beginner", text: "mei tian jin bu yi dian, da zi yue lai yue qing song." },
  { category: "pinyin", difficulty: "intermediate", text: "zhuan xin lian xi zhun que lv, ran hou zai ti sheng su du." },
  { category: "pinyin", difficulty: "intermediate", text: "yong wen zi ji lu ling gan, rang mei yi ci shu ru dou geng liu chang." },
  { category: "pinyin", difficulty: "advanced", text: "chi xu xun lian ke yi bang zhu ni jian li geng wen ding de shu ru jie zou." },
  { category: "pinyin", difficulty: "advanced", text: "cong zheng que de zhi fa kai shi, rang su du he zhun que lv tong bu ti sheng." },
  { category: "code", difficulty: "beginner", text: "const name = 'KeyPulse';" },
  { category: "code", difficulty: "beginner", text: "function greet() { return 'hello'; }" },
  { category: "code", difficulty: "intermediate", text: "const items = list.filter((item) => item.active);" },
  { category: "code", difficulty: "intermediate", text: "function add(a, b) { return a + b; }" },
  { category: "code", difficulty: "advanced", text: "const result = await Promise.all(tasks.map((task) => task.run()));" },
  { category: "code", difficulty: "advanced", text: "export function createStore(initialState = {}) { return { ...initialState }; }" },
];

export const keyboardRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

export const featureCards = [
  { icon: "⌨", title: "循序渐进", description: "从基准键位开始，一步步建立正确指法。" },
  { icon: "◉", title: "即时反馈", description: "实时查看速度、准确率与练习进度。" },
  { icon: "✦", title: "专注练习", description: "无广告干扰，打开页面就能开始训练。" },
  { icon: "↗", title: "看见进步", description: "用清晰的数据记录每一次突破。" },
];
