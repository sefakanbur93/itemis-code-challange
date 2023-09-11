<template>
  <div class="info-table">
    <div class="info-table__row" v-for="[key, value] in infoMap" :key="key">
      <div class="info-table__col">{{key}}</div>
      <div class="info-table__col">{{value}}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  infoMap: Map<string, string>
})
</script>
<style lang="scss">

.info-table {
  width: 33%;
  &__row {
    display: flex;
    border-bottom: 1px solid black;
  }
  &__col {
    width: 100%;
  }
}
</style>
