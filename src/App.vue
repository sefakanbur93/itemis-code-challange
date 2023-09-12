<template>
  <div class="main">
    <div class="main__wrapper">
      <ChatMessages :messages="messages" />
      <form class="main__form" @submit="sendMessage">
        <input class="main__input" v-model="input" type="text" placeholder="Type here...">
        <button class="main__button" type="submit">send</button>
      </form>
      <div class="main__info-table">
        <InfoTable v-if="romanArabicMap.size > 0" :info-map="romanArabicMap" col-name1="Roman" col-name2="Arabic"/>
        <InfoTable v-if="translationMap.size > 0" :info-map="translationMap" col-name1="Intergalactic" col-name2="Roman"/>
        <InfoTable v-if="resourceCostMap.size > 0" :info-map="resourceCostMap" col-name1="Resource" col-name2="Credits per pcs"/>
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

function sendMessage(event) {
  event.preventDefault();

  if(input.value === '') {
    return
  }


  const result = handleInput(input.value)
  messages.value.push('Me: '+input.value)
  messages.value.push('Alien: '+result)
  input.value = ''

}

</script>

<style lang="scss">
.main {
  display: flex;
  justify-content: center;

  &__wrapper {
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

  &__button {
    background-color: cadetblue;
    width: 100px;
    height: 30px;
  }

  &__form {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 5px;
  }

  &__input {
    width: 100%;
    border-radius: 5px;
    margin-top: 5px;
  }
}
</style>
