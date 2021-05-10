export default class Font {
  static maxFontSize = 130
  static minFontSize = 10
  static maxTransparency = 100
  static minTransparency = 1
  fontSize
  bold
  italic
  transparency
  color

  constructor ({
    fontSize = Font.minFontSize,
    transparency = Font.maxTransparency,
    color = '#000',
    bold = false,
    italic = false
  } = {}) {
    const {
      maxFontSize,
      minFontSize,
      maxTransparency,
      minTransparency
    } = Font
    this.fontSize = [maxFontSize, minFontSize, fontSize].sort()[1]
    this.transparency = [maxTransparency, minTransparency, transparency].sort()[1]
    this.bold = bold
    this.italic = italic
    this.color = color
  }
}
