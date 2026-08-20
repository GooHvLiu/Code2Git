/**
 * PLC数据字节转换工具
 * 支持 Modbus 常用数据类型：uint16 / int16 / uint32 / int32 / float / bool / string
 */

/**
 * 交换两个16bit字，modbus浮点数经常需要调换高低字
 * @param {number[]} bufferArr [word1,word2]
 * @returns {number[]}
 */
function swapWords(bufferArr) {
  return [bufferArr[1], bufferArr[0]]
}

/**
 * 两个uint16字转32位浮点数
 * @param {number} w1
 * @param {number} w2
 * @param {boolean} swap 是否交换高低字，很多PLC需要true
 * @returns {number}
 */
function wordsToFloat(w1, w2, swap = true) {
  const arr = swap ? swapWords([w1, w2]) : [w1, w2]
  const buf = Buffer.alloc(4)
  buf.writeUInt16BE(arr[0], 0)
  buf.writeUInt16BE(arr[1], 2)
  return buf.readFloatBE(0)
}

/**
 * float转两个uint16字
 */
function floatToWords(val, swap = true) {
  const buf = Buffer.alloc(4)
  buf.writeFloatBE(val, 0)
  const w1 = buf.readUInt16BE(0)
  const w2 = buf.readUInt16BE(2)
  return swap ? swapWords([w1, w2]) : [w1, w2]
}

/**
 * uint16 转 int16（有符号）
 */
function uint16ToInt16(val) {
  return val >= 0x8000 ? val - 0x10000 : val
}

/**
 * int16 转 uint16
 */
function int16ToUint16(val) {
  return val < 0 ? val + 0x10000 : val
}

/**
 * 两个 uint16 字转 uint32
 * @param {number} w1 高字
 * @param {number} w2 低字
 * @param {boolean} swap 是否交换高低字
 */
function wordsToUint32(w1, w2, swap = true) {
  const arr = swap ? swapWords([w1, w2]) : [w1, w2]
  return (arr[0] << 16) | arr[1]
}

/**
 * uint32 转两个 uint16 字
 */
function uint32ToWords(val, swap = true) {
  const w1 = (val >> 16) & 0xFFFF
  const w2 = val & 0xFFFF
  return swap ? swapWords([w1, w2]) : [w1, w2]
}

/**
 * 两个 uint16 字转 int32
 */
function wordsToInt32(w1, w2, swap = true) {
  const uint32 = wordsToUint32(w1, w2, swap)
  return uint32 >= 0x80000000 ? uint32 - 0x100000000 : uint32
}

/**
 * int32 转两个 uint16 字
 */
function int32ToWords(val, swap = true) {
  const uint32 = val < 0 ? val + 0x100000000 : val
  return uint32ToWords(uint32, swap)
}

/**
 * uint16 数组转字符串
 * @param {number[]} words 寄存器数组
 * @param {number} length 字符串长度（字节数）
 */
function wordsToString(words, length) {
  const buf = Buffer.alloc(length)
  for (let i = 0; i < words.length && i * 2 < length; i++) {
    buf.writeUInt16BE(words[i], i * 2)
  }
  return buf.toString('utf8').replace(/\0+$/, '')
}

/**
 * 字符串转 uint16 数组
 * @param {string} str
 * @param {number} wordCount 寄存器数量
 */
function stringToWords(str, wordCount) {
  const buf = Buffer.alloc(wordCount * 2)
  buf.write(str, 0, 'utf8')
  const words = []
  for (let i = 0; i < wordCount; i++) {
    words.push(buf.readUInt16BE(i * 2))
  }
  return words
}

module.exports = {
  swapWords,
  wordsToFloat,
  floatToWords,
  uint16ToInt16,
  int16ToUint16,
  wordsToUint32,
  uint32ToWords,
  wordsToInt32,
  int32ToWords,
  wordsToString,
  stringToWords
}
