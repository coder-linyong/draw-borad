<template lang="pug">
  q-page.items-center.justify-evenly.column.overflow-hidden
    div.row.full-width.bg-primary.text-white.q-pa-xs.justify-center.q-gutter-md
      q-btn(dense flat round icon="brush" @click="drawStatus='brush'")
        q-menu(
          anchor="bottom middle"
          self="top middle"
          transition-show="scale"
          transition-hide="scale")
          BrushComponent(:brushSync.sync="brush")
      q-btn(dense flat round icon="iconfont dbxingzhuang" @click="showImg()")
        q-tooltip 添加2D形状
      q-btn(dense flat round icon="image" @click="chooseFile")
        q-tooltip 添加图片
      q-btn(dense flat round icon="title" @click="openDialog('FontComponent')")
        q-tooltip 添加文本
      q-btn(dense flat round icon="iconfont dbxiangpicha" @click="drawStatus='eraser'")
        q-menu(
          anchor="bottom middle"
          self="top middle"
          transition-show="scale"
          transition-hide="scale")
          EraserComponent(:eraserSync.sync="eraser")
      q-btn(dense flat round icon="refresh" @click="reset")
        q-tooltip 重置画板
      q-btn(dense flat round icon="download" @click="download")
        q-tooltip 保存为图片
      q-btn(dense flat round icon="undo" @click="move(-1)")
        q-tooltip 撤销
      q-btn(dense flat round icon="redo" @click="move(1)")
        q-tooltip 重做
    div.col.full-width(
      :class="$style.content"
      ref="content"
      @mousedown="contentMouseDown"
      @wheel="contentWheel"
      @mouseup="contentMouseUp")
      canvas#board(
        ref="board"
        :style="{transform:`translate3d(${translatePos.x}px,${translatePos.y}px,${translatePos.z}px)`,cursor}"
        @mousedown="boardMouseDown"
        @mousemove="boardMouseMove"
        @mouseup="boardMouseUp"
        @dragenter.prevent="dropHandler"
        @dragleave.prevent="dropHandler"
        @dragover.prevent="dropHandler"
        @drop.prevent="dropHandler"
        @contextmenu.prevent)
    q-dialog(v-model="visible")
      component(:is="componentName" @complete="onDialogComplete")
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/unbound-method */
import { Vue, Component, Ref, Watch } from 'vue-property-decorator'
import BrushComponent from 'components/brush/brush.vue'
import Brush from 'components/brush/brush'
import EraserComponent from 'components/eraser/eraser.vue'
import FontComponent from 'components/font/font.vue'
import Eraser from 'components/eraser/eraser'
import Resizeable, { CompleteData } from 'components/resizeable/resizeable.vue'
import FixedHeap, { newFixedHeap } from 'src/fixed-heap'

type DrawStatus = 'brush' | 'eraser' | 'shape' | 'text'

// @todo 写注释外加优化代码（虽然可能优化不了啥）
// @todo readme完善

@Component({
  components: {
    Resizeable,
    EraserComponent,
    BrushComponent,
    FontComponent
  }
})
export default class DrawBoard extends Vue {
  ctrl = false
  visible=false
  componentName='FontComponent'
  isMouseDown = false
  history!: FixedHeap
  drawStatus: DrawStatus = 'brush'
  ctx!: CanvasRenderingContext2D
  brush: Brush = new Brush()
  eraser: Eraser = new Eraser()
  oldPoint = {
    x: 0,
    y: 0
  }

  translatePos = {
    x: 0,
    y: 0,
    z: 0
  }

  // 鼠标的形状
  get cursor () {
    const {
      ctrl,
      isMouseDown
    } = this
    if (ctrl) {
      return 'move'
    } else if (isMouseDown) {
      return 'crosshair'
    }
  }

  @Ref('board') board!: HTMLCanvasElement
  @Ref('content') content!: HTMLElement

  @Watch('brush', { deep: true })
  brushChange (brush: Brush) {
    const { ctx } = this
    ctx.lineWidth = brush.size
    ctx.strokeStyle = brush.color
    ctx.fillStyle = brush.color
    ctx.globalAlpha = brush.transparency / 255
  }

  @Watch('eraser', { deep: true })
  eraserChange (eraser: Eraser) {
    const { ctx } = this
    ctx.lineWidth = eraser.size
  }

  openDialog (component:string) {
    this.visible = true
    this.componentName = component
  }

  /**
   * 添加历史记录
   */
  putHistory () {
    const { board, ctx, history } = this
    history.push(ctx.getImageData(0, 0, board.width, board.height))
  }

  /**
   * 移动历史记录指针，并将移动位置的画面绘制到画布上
   * @param {number} num 移动步长，可以是正数或者负数
   */
  move (num:number) {
    const { ctx, history } = this
    if (num > 0 && history.realLength <= history.pointerPos + 1) return
    const imageData = history.move(num) as ImageData
    if (imageData) {
      this.reset()
      ctx.putImageData(imageData, 0, 0)
    }
  }

  reset () {
    const {
      ctx,
      board
    } = this
    ctx.clearRect(0, 0, board.width, board.height)
  }

  download () {
    const { board } = this
    const a = document.createElement('a')
    a.href = board.toDataURL()
    a.download = 'img'
    a.click()
  }

  showImg (url?: string) {
    const {
      content,
      ctx
    } = this
    // 创建可变尺寸图形，并添加到页面
    const img = new Resizeable({
      propsData: {
        url,
        type: url ? 'img' : 'shape'
      }
    })
    img.$mount()
    content.appendChild(img.$el)
    img.$on('complete', (data: CompleteData) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const {
        x,
        y,
        width,
        height,
        rotate
      } = data
      ctx.save()
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      ctx.translate(x + width / 2, y + height / 2)
      ctx.rotate(rotate * Math.PI / 180)
      ctx.drawImage(img.img, -width / 2, -height / 2, width, height)
      ctx.restore()
      content.removeChild(img.$el)
      img.$destroy()
      this.putHistory()
    })
  }

  onDialogComplete (data:any) {
    // 如果返回数据是base64格式的字符串
    if (typeof data === 'string' && data.includes('data:image/png')) {
      this.showImg(data)
    }
    this.visible = false
  }

  chooseFile () {
    const input: HTMLInputElement = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.click()
    input.addEventListener('change', () => {
      const { files } = input
      if (files && files.length > 0) {
        const url = URL.createObjectURL(files[0])
        this.showImg(url)
      }
    })
  }

  keyUp (e: KeyboardEvent) {
    const { key } = e
    if (key === 'Control') {
      this.ctrl = e.ctrlKey
    }
  }

  keyDown (e: KeyboardEvent) {
    const { key } = e
    if (key === 'Control') {
      this.ctrl = e.ctrlKey
    }
  }

  boardMouseDown (e: MouseEvent) {
    if (e.ctrlKey) return

    const {
      offsetX,
      offsetY
    } = e
    const {
      ctx,
      drawStatus,
      brush,
      eraser
    } = this

    this.oldPoint = {
      x: offsetX,
      y: offsetY
    }
    this.isMouseDown = true
    if (drawStatus === 'brush') {
      ctx.lineWidth = brush.size
    } else if (drawStatus === 'eraser') {
      ctx.lineWidth = eraser.size
    }
  }

  boardMouseMove (e: MouseEvent) {
    const {
      offsetX,
      offsetY,
      ctrlKey
    } = e
    const {
      drawStatus,
      ctx,
      isMouseDown,
      board
    } = this
    if (offsetX <= 1 || offsetX >= (board.width - 1) || offsetY <= 1 || offsetY >= (board.height - 1) || ctrlKey) {
      this.isMouseDown = false
      return
    }
    if (isMouseDown) {
      const {
        oldPoint: {
          x,
          y
        }
      } = this
      if (drawStatus === 'brush') {
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(offsetX, offsetY)
        ctx.closePath()
        ctx.stroke()
      } else if (drawStatus === 'eraser') {
        ctx.save()
        // 重合部分透明
        ctx.globalCompositeOperation = 'destination-out'
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(offsetX, offsetY)
        ctx.closePath()
        ctx.stroke()
        ctx.restore()
      }
      this.oldPoint = {
        x: offsetX,
        y: offsetY
      }
    }
  }

  dropHandler (e: DragEvent) {
    if (e.type === 'drop') {
      if (e.dataTransfer) {
        const { files } = e?.dataTransfer ?? []
        if (files && files.length > 0) {
          const url = URL.createObjectURL(files[0])
          this.showImg(url)
        }
      }
    }
  }

  boardMouseUp (e: MouseEvent) {
    if (e.ctrlKey) return
    const {
      drawStatus,
      isMouseDown
    } = this
    if (isMouseDown) {
      if (drawStatus === 'brush' || drawStatus === 'eraser') {
        this.isMouseDown = false
      }
      this.putHistory()
    }
  }

  contentMouseDown () {
    const {
      content,
      ctrl
    } = this
    ctrl && content.addEventListener('mousemove', this.contentMouseMove)
  }

  contentMouseMove (e: MouseEvent) {
    const { translatePos } = this
    const {
      movementY,
      movementX
    } = e
    translatePos.x += movementX
    translatePos.y += movementY
  }

  contentWheel (e: WheelEvent) {
    const { translatePos } = this
    const {
      deltaY,
      ctrlKey
    } = e
    if (ctrlKey) {
      e.preventDefault()
    }
    if (deltaY < 0) {
      translatePos.z += 10
    } else {
      translatePos.z -= 10
    }
  }

  contentMouseUp () {
    const { content } = this
    content.removeEventListener('mousemove', this.contentMouseMove)
  }

  mounted () {
    const { board } = this
    window.addEventListener('keydown', this.keyDown)
    window.addEventListener('keyup', this.keyUp)
    if (board.getContext ?? false) {
      const ctx = this.ctx = this.board.getContext('2d') as CanvasRenderingContext2D
      setTimeout(() => {
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
      })
    }
    board.width = document.body.clientWidth
    board.height = document.body.clientHeight - 48
    this.history = newFixedHeap(10)
    this.putHistory()
  }

  beforeDestroy () {
    window.removeEventListener('keydown', this.keyDown)
    window.removeEventListener('keyup', this.keyUp)
  }
}
</script>

<style lang="stylus" module>
.content
  position relative
  overflow hidden
  transform-style preserve-3d
  perspective 999px
  background #b4adad

  & > canvas
    user-select none
    background #fff

  .dropImg
    position absolute
    max-width 100%
    max-height 100%
</style>
