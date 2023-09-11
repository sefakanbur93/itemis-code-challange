<template>
  <div class="main">
    <div class="main__wrapper">
      <ChatMessages :chat-messages="messages" />
      <input v-model="input" type="text">
      <button type="button" @click="sendMessage">send</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import useCodeChallenge from "./composables/useCodeChallenge";
import ChatMessages from "./components/ChatMessages.vue";

const input = ref<string>('')
const messages = ref<Array<string>>([])

const {handleInput} = useCodeChallenge()

function sendMessage() {
  input.value = ''
  const result = handleInput(input.value)
  messages.value.push(result)
}

</script>

<style lang="scss">
.main {
  display: flex;
  justify-content: center;

  &__wrapper {
    gap: 10px;
    margin-top: 20rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
}
</style>
