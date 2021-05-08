<template lang="pug">
  div(
    :class="$style.imgContainer"
    ref="container"
    @wheel.stop
    @mousemove="mouseMove"
    @mouseup="mouseup"
    @mousedown.prevent="mouseDown")
    div(
      :style="imgStyle"
      ref="box"
      :class="$style.img"
      @mousedown.prevent)
      img(v-if="type==='img'" :src="url" :width="width-padding*2" :height="height-padding*2" @mousedown.prevent ref="img")
      canvas(v-if="type==='shape'" :width="width-padding*2" :height="height-padding*2" @mousedown.prevent ref="img")
      div(
        v-for="drop of dropBlock"
        :data-pos="drop"
        @mousedown.prevent
        :class="[$style.drop,$style[drop]]")
      q-btn.absolute-center.bg-white(
        :style="{transform:`translate(-50%,-50%) rotate(${-rotate}deg)`}"
        flat
        dense
        icon="done"
        round
        @click="complete")
    q-slider.absolute-bottom(
      :max="360"
      :min="0"
      v-model="rotate"
      style="width:300px;"
      label
      :class="$style.rotate"
      :label-value="`${rotate}°`")
    q-btn.absolute-bottom-right.bg-white(icon="edit" round dense @click="visible=true"  v-if="type==='shape'")
    q-dialog( v-model="visible" position="right" v-if="type==='shape'")
      q-card.relative-position(style="width:300px;")
        q-card-section.row.items-center.justify-end
          q-btn(dense round icon="close" @click="visible=false" flat size="sm")
        ShapeEditor(:shapeSync.sync="shape" @change="onShapeChange" @choose="onChoose")
</template>

<script lang="ts">
import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator'
import ShapeEditor, { ShapeClassName } from 'components/resizeable/shapes.vue'
import Polygon from 'components/resizeable/polygon'
import Capsule from 'components/resizeable/capsule'
import RightTriangle from 'components/resizeable/right-triangle'
import Arrow from 'components/resizeable/arrow'
import Star from 'components/resizeable/star'
import Bubble from 'components/resizeable/bubble'
import Hook from 'components/resizeable/hook'
import Fork from 'components/resizeable/fork'

type BlockPosition = 'lt' | 'rt' | 'rb' | 'lb'

export interface CompleteData {
  x: number;
  y: number;
  rotate: number;
  width: number;
  height: number;
}

@Component({
  components: { ShapeEditor }
})
export default class ResizeableImage extends Vue {
  padding = 10
  width = 0
  height = 0
  drop = false
  visible = true
  dropDirection: BlockPosition = 'rb'
  rotate = 0
  move = false
  ctx!: CanvasRenderingContext2D
  pos = {
    x: 0,
    y: 0
  }

  shape: Polygon | Capsule = new Polygon({
    borderNumber: Polygon.minBorderNumber,
    radius: Polygon.minRadius
  })

  @Prop({
    type: String
  })
  url!: string

  @Prop({
    type: String,
    required: true
  })
  type!: 'img' | 'shape'

  dropBlock: Array<BlockPosition> = ['lt', 'rt', 'rb', 'lb']

  get imgStyle () {
    const {
      pos,
      width,
      height,
      padding,
      rotate
    } = this
    return {
      left: `${pos.x}px`,
      top: `${pos.y}px`,
      padding: `${padding}px`,
      width: width ? `${width}px` : 'auto',
      height: height ? `${height}px` : 'auto',
      transform: `translate(-50%, -50%) rotate(${rotate}deg)`
    }
  }

  @Ref('container') container!: HTMLElement
  @Ref('box') box!: HTMLElement
  @Ref('img') img!: HTMLImageElement | HTMLCanvasElement

  @Emit('complete')
  complete (): CompleteData {
    const {
      rotate,
      img,
      pos: {
        x,
        y
      }
    } = this
    const {
      clientWidth,
      clientHeight
    } = img
    return {
      rotate,
      x: x - clientWidth / 2,
      y: y - clientHeight / 2,
      width: clientWidth,
      height: clientHeight
    }
  }

  onChoose (name: ShapeClassName) {
    if (name === 'Polygon') {
      this.shape = new Polygon({
        borderNumber: Polygon.minBorderNumber,
        radius: Polygon.minRadius
      })
    } else if (name === 'Capsule') {
      this.shape = new Capsule({})
    } else if (name === 'RightTriangle') {
      this.shape = new RightTriangle({})
    } else if (name === 'Arrow') {
      this.shape = new Arrow({})
    } else if (name === 'Star') {
      this.shape = new Star({ angleNum: 5 })
    } else if (name === 'Bubble') {
      this.shape = new Bubble({ })
    } else if (name === 'Hook') {
      this.shape = new Hook({})
    } else if (name === 'Fork') {
      this.shape = new Fork({})
    }
    this.onShapeChange()
  }

  onShapeChange () {
    const {
      shape,
      img,
      ctx
    } = this
    shape.x = img.width / 2
    shape.y = img.height / 2
    shape.draw(ctx)
  }

  mouseDown (e: MouseEvent) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { pos } = e?.target?.dataset ?? false
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const nodeName = e?.target?.nodeName ?? ''
    if (pos) {
      this.drop = true
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.dropDirection = pos
    } else if (nodeName === 'IMG' || nodeName === 'CANVAS') {
      this.move = true
    }
  }

  mouseMove (e: MouseEvent) {
    const {
      drop,
      move,
      dropDirection
    } = this
    const {
      movementX,
      movementY
    } = e

    if (drop) {
      let w = 0
      let h = 0
      if (dropDirection === 'rb') {
        w = this.width + movementX
        h = this.height + movementY
      } else if (dropDirection === 'lt') {
        w = this.width - movementX
        h = this.height - movementY
      } else if (dropDirection === 'rt') {
        w = this.width + movementX
        h = this.height - movementY
      } else if (dropDirection === 'lb') {
        w = this.width - movementX
        h = this.height + movementY
      }
      this.width = Math.max(100, w)
      this.height = Math.max(100, h)
      if (this.ctx) {
        setTimeout(() => {
          this.onShapeChange()
        }, 10)
      }
    } else if (move) {
      this.pos.x += movementX
      this.pos.y += movementY
    }
  }

  mouseup () {
    this.drop = false
    this.move = false
  }

  async init () {
    return new Promise(resolve => {
      setTimeout(() => {
        const {
          container,
          box,
          img
        } = this
        this.pos = {
          x: container.clientWidth / 2,
          y: container.clientHeight / 2
        }
        this.width = box.clientWidth
        this.height = box.clientHeight
        if (img instanceof HTMLCanvasElement) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this.ctx = (img).getContext('2d')
          this.shape.draw(this.ctx)
        }
        resolve(true)
      }, 50)
    })
  }

  async mounted () {
    await this.init()
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" module>
.imgContainer
  position absolute
  top 50%
  left 50%
  transform translate(-50%, -50%)
  width 100%
  height 100%
  background rgba(150, 150, 150, .1)

  .img
    position absolute
    transform translate(-50%, -50%) rotate(0deg)
    padding 10px
    border 1px dashed #7d7676

    .drop
      position absolute
      width 10px
      height 10px
      background #b3acac
      border 1px solid #000
      z-index 9
      cursor nw-resize

      &.lt
        transform translate(-50%, -50%)
        top 0
        left 0
        cursor nw-resize

      &.rt
        transform translate(50%, -50%)
        top 0
        right 0
        cursor sw-resize

      &.rb
        transform translate(50%, 50%)
        bottom 0
        right 0
        cursor nwse-resize

      &.lb
        transform translate(-50%, 50%)
        bottom 0
        left 0
        cursor nesw-resize

    img
      width 100%
      height 100%
      cursor move
      user-select none

  .rotate
    bottom 10px
    left 50%
    transform translateX(-50%)
</style>
