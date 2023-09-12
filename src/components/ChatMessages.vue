<template>
  <div ref="chatMessages" class="chat-messages">
    <div v-for="(chatMessage, index) in messages" :key="index">
      {{ chatMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  messages: Array<string>
})

const chatMessages = ref<HTMLElement>(null)

watch(() => props.messages?.length, ()=> {
  chatMessages.value.scrollTo(0, chatMessages.value.scrollHeight)
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
