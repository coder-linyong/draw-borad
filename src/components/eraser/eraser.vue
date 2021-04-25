<template lang="pug">
  q-card.q-pa-md(:class="$style.eraserContainer")
    q-card-section
      div.row
        div 大小
        q-space
        div {{eraser.size}}px
      q-slider(
        v-model="eraser.size"
        :min="minSize"
        :max="maxSize"
        :step="1")
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator'
import Eraser from 'components/eraser/eraser'

@Component
export default class EraserComponent extends Vue {
  minSize=Eraser.minSize
  maxSize=Eraser.maxSize

  @PropSync('eraserSync')
  eraser!:Eraser
}
</script>

<style lang="stylus" rel="stylesheet/stylus" module>
.eraserContainer
  width 300px
</style>
