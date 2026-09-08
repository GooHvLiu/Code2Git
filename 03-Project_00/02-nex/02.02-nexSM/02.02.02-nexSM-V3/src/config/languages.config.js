/**
 * 预设语言配置文件
 * 包含常见语言的默认元数据，用户创建语言时可从中选择
 * 可以在此文件中添加、修改或删除预设语言
 * 
 * flag 字段说明：
 * - 存储的是 SVG 图标名，对应 src/assets/icons/svg/flags/ 目录下的 SVG 文件
 * - 例如：'flags/zh-CN' 对应 src/assets/icons/svg/flags/zh-CN.svg
 * - 前端使用 <svg-icon icon-class="flags/zh-CN" /> 来显示国旗图标
 * - 如果需要添加新的语言，请同时在 flags 目录下添加对应的国旗SVG文件
 */

const PRESET_LANGUAGES = [
  { code: 'zh-CN', name: '中文（简体）', autonym: '中文（简体）', flag: 'flags/zh-CN' },
  { code: 'zh-TW', name: '中文（繁体）', autonym: '中文（繁體）', flag: 'flags/zh-CN' },
  { code: 'en-US', name: '英语（美国）', autonym: 'English (US)', flag: 'flags/en-US' },
  { code: 'en-GB', name: '英语（英国）', autonym: 'English (UK)', flag: 'flags/en-GB' },
  { code: 'ja-JP', name: '日语', autonym: '日本語', flag: 'flags/ja-JP' },
  { code: 'ko-KR', name: '韩语', autonym: '한국어', flag: 'flags/ko-KR' },
  { code: 'fr-FR', name: '法语', autonym: 'Français', flag: 'flags/fr-FR' },
  { code: 'de-DE', name: '德语', autonym: 'Deutsch', flag: 'flags/de-DE' },
  { code: 'es-ES', name: '西班牙语', autonym: 'Español', flag: 'flags/es-ES' },
  { code: 'ru-RU', name: '俄语', autonym: 'Русский', flag: 'flags/ru-RU' },
  { code: 'it-IT', name: '意大利语', autonym: 'Italiano', flag: 'flags/it-IT' },
  { code: 'pt-BR', name: '葡萄牙语（巴西）', autonym: 'Português (Brasil)', flag: 'flags/pt-BR' },
  { code: 'pt-PT', name: '葡萄牙语（葡萄牙）', autonym: 'Português (Portugal)', flag: 'flags/pt-PT' },
  { code: 'nl-NL', name: '荷兰语', autonym: 'Nederlands', flag: 'flags/nl-NL' },
  { code: 'sv-SE', name: '瑞典语', autonym: 'Svenska', flag: 'flags/sv-SE' },
  { code: 'pl-PL', name: '波兰语', autonym: 'Polski', flag: 'flags/pl-PL' },
  { code: 'tr-TR', name: '土耳其语', autonym: 'Türkçe', flag: 'flags/tr-TR' },
  { code: 'ar-SA', name: '阿拉伯语', autonym: 'العربية', flag: 'flags/ar-SA' },
  { code: 'th-TH', name: '泰语', autonym: 'ไทย', flag: 'flags/th-TH' },
  { code: 'vi-VN', name: '越南语', autonym: 'Tiếng Việt', flag: 'flags/vi-VN' },
  { code: 'id-ID', name: '印尼语', autonym: 'Bahasa Indonesia', flag: 'flags/id-ID' },
  { code: 'ms-MY', name: '马来语', autonym: 'Bahasa Melayu', flag: 'flags/ms-MY' },
  { code: 'hi-IN', name: '印地语', autonym: 'हिन्दी', flag: 'flags/hi-IN' },
  { code: 'he-IL', name: '希伯来语', autonym: 'עברית', flag: 'flags/he-IL' },
  { code: 'cs-CZ', name: '捷克语', autonym: 'Čeština', flag: 'flags/cs-CZ' },
  { code: 'da-DK', name: '丹麦语', autonym: 'Dansk', flag: 'flags/da-DK' },
  { code: 'fi-FI', name: '芬兰语', autonym: 'Suomi', flag: 'flags/fi-FI' },
  { code: 'no-NO', name: '挪威语', autonym: 'Norsk', flag: 'flags/no-NO' },
  { code: 'el-GR', name: '希腊语', autonym: 'Ελληνικά', flag: 'flags/el-GR' },
  { code: 'hu-HU', name: '匈牙利语', autonym: 'Magyar', flag: 'flags/hu-HU' },
  { code: 'ro-RO', name: '罗马尼亚语', autonym: 'Română', flag: 'flags/ro-RO' },
  { code: 'uk-UA', name: '乌克兰语', autonym: 'Українська', flag: 'flags/uk-UA' },
  { code: 'bg-BG', name: '保加利亚语', autonym: 'Български', flag: 'flags/bg-BG' },
  { code: 'hr-HR', name: '克罗地亚语', autonym: 'Hrvatski', flag: 'flags/hr-HR' },
  { code: 'sk-SK', name: '斯洛伐克语', autonym: 'Slovenčina', flag: 'flags/sk-SK' },
  { code: 'sl-SI', name: '斯洛文尼亚语', autonym: 'Slovenščina', flag: 'flags/sl-SI' },
  { code: 'et-EE', name: '爱沙尼亚语', autonym: 'Eesti', flag: 'flags/et-EE' },
  { code: 'lv-LV', name: '拉脱维亚语', autonym: 'Latviešu', flag: 'flags/lv-LV' },
  { code: 'lt-LT', name: '立陶宛语', autonym: 'Lietuvių', flag: 'flags/lt-LT' }
]

module.exports = {
  PRESET_LANGUAGES
}
