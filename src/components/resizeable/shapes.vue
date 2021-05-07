<template lang="pug">
  q-card-section
    div.row 形状
    div.q-gutter-sm.row.q-pa-none.q-py-sm
      q-btn(
        v-for="shape of shapes"
        :Key="shape.name"
        :icon="`iconfont ${shape.icon}`"
        size="20px"
        @click="onChoose(shape.name)"
        :color="currClassName===shape.name?'primary':'white'"
        :text-color="currClassName===shape.name?'white':'primary'")
        q-tooltip {{shape.label}}
    div.row.items-center.q-py-sm(v-if="currClassName==='Polygon'")
      div 半径
      q-space
      q-input(
        type="number"
        outlined
        v-model="option.radius"
        style="width:70px;"
        dense
        :min="minRadius")
      div 像素
    div.row.items-center.q-py-sm(v-if="currClassName==='Polygon'")
      div 边数
      q-space
      q-input(
        type="number"
        outlined
        v-model="option.borderNumber"
        style="width:70px;"
        dense
        :min="minBorderNumber")
    div.row.items-center.q-py-sm
      q-toggle(v-model="option.fill" :color="option.fillColor" :label="option.fill?'填充':'不填充'")
      q-space
      q-btn.shadow-0.q-mr-sm(
        round
        :style="{background:option.fillColor}"
        dense
        :disable="!option.fill")
        q-popup-proxy(transition-show="scale" transition-hide="scale")
          q-color(v-model="option.fillColor")
    div.row.items-center.q-py-sm
      q-toggle(v-model="option.border" :color="option.borderColor" :label="option.border?'描边':'不描边'")
      q-space
      q-btn.shadow-0.q-mr-sm(round :style="{background:option.borderColor}" dense :disable="!option.border")
        q-popup-proxy(transition-show="scale" transition-hide="scale")
          q-color(v-model="option.borderColor")
    div.row
      div 描边粗细
      q-space
      div {{(option.borderWidth)}}像素
    q-slider(
      v-model="option.borderWidth"
      :min="minBorderWidth"
      :max="maxBorderWidth"
      :step="1")
    div.row.items-center.q-py-sm
      div 描边线长
      q-space
      q-input(
        type="number"
        outlined
        v-model="option.lineDash[0]"
        style="width:70px;"
        dense
        :min="0")
      div 像素
    div.row.items-center.q-py-sm
      div 描边线间隙
      q-space
      q-input(
        type="number"
        outlined
        v-model="option.lineDash[1]"
        style="width:70px;"
        dense
        :min="0")
      div 像素
    div.row
      div 不透明度
      q-space
      div {{(option.transparency)}}%
    q-slider(
      v-model="option.transparency"
      :min="minTransparency"
      :max="maxTransparency"
      :step="1")
</template>

<script lang="ts">
import { Component, Emit, PropSync, Vue, Watch } from 'vue-property-decorator'
import Shape from 'components/resizeable/shape'
import Polygon, { PolygonOption } from 'components/resizeable/polygon'
import Capsule from 'components/resizeable/capsule'

export type ShapeClassName = 'Polygon' | 'Capsule' | 'RightTriangle' | 'Arrow' | 'Star' | 'Bubble' | 'Hook' | 'Fork'

interface ShapeListOption {
  icon: string;
  name: ShapeClassName;
  label: string;
}

@Component({})
export default class ShapeEditor extends Vue {
  minTransparency = Shape.minTransparency
  maxTransparency = Shape.maxTransparency
  minBorderWidth = Shape.minBorderWidth
  maxBorderWidth = Shape.maxBorderWidth
  minRadius = Polygon.minRadius
  minBorderNumber = Polygon.minBorderNumber

  option: PolygonOption = {
    border: false,
    borderColor: '',
    borderNumber: Polygon.minBorderNumber,
    borderWidth: 0,
    fill: false,
    fillColor: '',
    lineDash: [0, 0],
    radius: Polygon.minRadius,
    transparency: 0,
    x: 0,
    y: 0
  }

  shapes: Array<ShapeListOption> = [
    {
      icon: 'dbduobianxing',
      name: 'Polygon',
      label: '多边形'
    },
    {
      icon: 'dbliuchengtujiaonangxing',
      name: 'Capsule',
      label: '胶囊形'
    },
    {
      icon: 'dbzhijiaosanjiaoxing',
      name: 'RightTriangle',
      label: '直角三角形'
    },
    {
      icon: 'dbjiantou',
      name: 'Arrow',
      label: '指向箭头'
    },
    {
      icon: 'dbxing',
      name: 'Star',
      label: '五角星'
    },
    {
      icon: 'dbqipao',
      name: 'Bubble',
      label: '气泡'
    },
    {
      icon: 'dbgou',
      name: 'Hook',
      label: '钩'
    },
    {
      icon: 'dbcuohao',
      name: 'Fork',
      label: '叉号'
    }
  ]

  @PropSync('shapeSync')
  shape!: Polygon | Capsule

  get currClassName () {
    return this.shape[Symbol.toStringTag]
  }

  @Emit('change')
  onChange () {
    return true
  }

  @Emit('choose')
  onChoose (name: ShapeClassName) {
    return name
  }

  @Watch('option', { deep: true })
  optionChange (val: PolygonOption) {
    const { shape } = this
    for (const key of Object.keys(val)) {
      if (key in shape) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        shape[key] = val[key]
      }
    }
    this.onChange()
  }

  updateOption () {
    const {
      shape,
      option
    } = this
    for (const key of Object.keys(shape)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      option[key] = shape[key]
    }
  }

  mounted () {
    setTimeout(() => {
      this.updateOption()
    }, 100)
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" module>
</style>
