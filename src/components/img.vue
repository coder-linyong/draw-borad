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
      img(:src="url" @mousedown.prevent ref="img")
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
</template>

<script lang="ts">
import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator'

type BlockPosition = 'lt' | 'rt' | 'rb' | 'lb'

export interface CompleteData {
  x: number;
  y: number;
  rotate: number;
  width:number;
  height:number;
}

@Component
export default class ResizeableImage extends Vue {
  width = 0
  height = 0
  drop = false
  dropDirection: BlockPosition = 'rb'
  rotate = 0
  move = false
  pos = {
    x: 0,
    y: 0
  }

  @Prop({ type: String, required: true })
  url!:string

  dropBlock: Array<BlockPosition> = ['lt', 'rt', 'rb', 'lb']

  get imgStyle () {
    const {
      pos,
      width,
      height,
      rotate
    } = this
    return {
      left: `${pos.x}px`,
      top: `${pos.y}px`,
      width: width ? `${width}px` : 'auto',
      height: height ? `${height}px` : 'auto',
      transform: `translate(-50%, -50%) rotate(${rotate}deg)`
    }
  }

  @Ref('container') container!: HTMLElement
  @Ref('box') box!: HTMLElement
  @Ref('img') img!: HTMLImageElement

  @Emit('complete')
  complete ():CompleteData {
    const { rotate, img, pos: { x, y } } = this
    const { clientWidth, clientHeight } = img
    return {
      rotate,
      x: x - clientWidth / 2,
      y: y - clientHeight / 2,
      width: clientWidth,
      height: clientHeight
    }
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
    } else if (nodeName === 'IMG') {
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
          box
        } = this
        this.pos = {
          x: container.clientWidth / 2,
          y: container.clientHeight / 2
        }
        this.width = box.clientWidth
        this.height = box.clientHeight
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
