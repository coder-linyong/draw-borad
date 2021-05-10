<template lang="pug">
  q-card.q-pa-md(:class="$style.fontContainer")
    q-card-section.row.justify-center.items-center
      canvas(width="490" height="300" ref="canvas")
    q-card-section
      q-input.q-my-md(
        @input="onChange"
        v-model="text"
        dense
        outlined
        placeholder="输入文本内容"
        clearable)
      div.row
        div 大小
        q-space
        div {{font.fontSize}}px
      q-slider(
        v-model="font.fontSize"
        :min="minSize"
        :max="maxSize"
        :step="1")
      div.row
        div 不透明度
        q-space
        div {{font.transparency}}%
      q-slider(
        v-model="font.transparency"
        :min="minTransparency"
        :max="maxTransparency"
        :step="1")
      div.row
        q-toggle(v-model="font.italic" :label="font.italic?'倾斜':'不倾斜'" left-label)
        q-space
        q-toggle(v-model="font.bold" :label="font.bold?'加粗':'不加粗'" left-label)
        q-space
        q-toggle(v-model="fill" @input="onChange" :label="fill?'填充':'描边'" left-label)
      div.row.items-center
        div 颜色
        q-space
        q-btn(:style="{background:font.color}" round dense)
          q-popup-proxy(transition-show="scale" transition-hide="scale")
            q-color(v-model="font.color")
      div.row.q-mt-md
        q-btn.full-width(label="完成" @click="onComplete")
</template>

<script lang="ts">
import { Component, Emit, Ref, Vue, Watch } from 'vue-property-decorator'
import Font from 'components/font/font'

@Component
export default class FontComponent extends Vue {
  text='请输入文本'
  fill=true
  minSize=Font.minFontSize
  maxSize=Font.maxFontSize
  minTransparency=Font.minTransparency
  maxTransparency=Font.maxTransparency
  font:Font=new Font()
  ctx!:CanvasRenderingContext2D

  @Ref('canvas') canvas!:HTMLCanvasElement

  @Watch('font', { deep: true })
  onChange () {
    const { text, font, ctx, fill, canvas: { width, height } } = this
    ctx.font = [
      `${font.bold ? 'bold' : ''}`,
      `${font.italic ? 'italic' : ''}`,
      `${font.fontSize}px`,
      'serif'
    ].join(' ').trim()
    ctx.globalAlpha = font.transparency / 100
    ctx.fillStyle = font.color
    ctx.strokeStyle = font.color
    ctx.clearRect(0, 0, width, height)
    fill ? ctx.fillText(text ?? '请输入文本', width / 2, height / 2, width) : ctx.strokeText(text, width / 2, height / 2, width)

    // // 如果文本宽度超过canvas，换行
    // const textMetrics = ctx.measureText(text)
    // if (textMetrics.width >= width) {
    //   this.text = `${text}\n`
    // }
  }

  @Emit('complete')
  onComplete () {
    const { ctx: { canvas } } = this
    return canvas.toDataURL()
  }

  mounted () {
    const { canvas } = this
    const ctx = this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    this.onChange()
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" module>
.fontContainer
  width 600px
</style>
