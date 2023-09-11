<template>
  <div class="main">
    <div class="main__wrapper">
      <ChatMessages :chat-messages="messages" />
      <input class="main__input" v-model="input" type="text">
      <button type="button" @click="sendMessage">send</button>
      <div class="main__info-table">
        <InfoTable v-if="romanArabicMap.size > 0" :info-map="romanArabicMap"/>
        <InfoTable v-if="translationMap.size > 0" :info-map="translationMap"/>
        <InfoTable v-if="resourceCostMap.size > 0" :info-map="resourceCostMap"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import useCodeChallenge from "./composables/useCodeChallenge";
import ChatMessages from "./components/ChatMessages.vue";
import InfoTable from "./components/InfoTable.vue";

const input = ref<string>('')
const messages = ref<Array<string>>([])

const { handleInput, translationMap, resourceCostMap, romanArabicMap } = useCodeChallenge()

function sendMessage() {
  messages.value.push('Me: '+input.value)
  const result = handleInput(input.value)
  input.value = ''
  messages.value.push('Alien: '+result)
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
    align-items: center;
    flex-direction: column;
    min-width: 500px
  }

  &__info-table {
    width: 100%;
    gap: 5px;
    display: flex;
    justify-content: flex-start;
  }

  &__input {
    width: 100%;
  }
}
</style>
