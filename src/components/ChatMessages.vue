<template>
  <div class="chat-messages">
    <div v-for="(chatMessage, index) in chatMessages" :key="index">
      {{chatMessage}}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  chatMessages: Array<string>
})
</script>
<style>

.chat-messages {
  border: 1px solid black;
  height: 100px;
  width: 100%;
  border-radius: 10px;
  background-color: lightgrey;
  overflow: scroll;
}
</style>
