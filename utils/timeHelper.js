// 秒数 --> 分：秒
function second2MinuteSecond(seconds) {
  return [
    parseInt(seconds / 60 % 60),
    parseInt(seconds % 60)
  ]
    .join(":")
    .replace(/\b(\d)\b/g, "0$1");
}

module.exports = {
  second2MinuteSecond: second2MinuteSecond,
}