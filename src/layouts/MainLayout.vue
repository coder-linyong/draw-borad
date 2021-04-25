<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-page-container(:class="$style")
      router-view
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class MainLayout extends Vue {
}
</script>

<style module lang="stylus">
.test
  width 100%
</style>
