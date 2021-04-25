<template lang="pug">
  q-card.q-pa-md(:class="$style.brushContainer")
    q-card-section
      div.row
        div 粗细
        q-space
        div {{brush.size}}px
      q-slider(
        v-model="brush.size"
        :min="minSize"
        :max="maxSize"
        :step="1")
      div.row
        div 不透明度
        q-space
        div {{(brush.transparency*100/255).toFixed(2)}}%
      q-slider(
        v-model="brush.transparency"
        :min="minTransparency"
        :max="maxTransparency"
        :step="1")
      div.row.items-center
        div 颜色
        q-space
        q-btn(:style="{background:brush.color}" round dense)
          q-popup-proxy(transition-show="scale" transition-hide="scale")
            q-color(v-model="brush.color")
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator'
import Brush from 'components/brush/brush'

@Component
export default class BrushComponent extends Vue {
  minSize=Brush.minSize
  maxSize=Brush.maxSize
  minTransparency=Brush.minTransparency
  maxTransparency=Brush.maxTransparency

  @PropSync('brushSync')
  brush!:Brush
}
</script>

<style lang="stylus" rel="stylesheet/stylus" module>
.brushContainer
  width 300px
</style>
