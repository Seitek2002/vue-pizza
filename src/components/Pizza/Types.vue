<template>
  <ul>
    <li
      v-for="(item, i) in items"
      :class="{ active: activeItem == i }"
      :key="item"
      @click="handleActiveItem(i)"
    >
      {{ item }}
    </li>
  </ul>
</template>

<script>
import { ref } from "@vue/reactivity";
export default {
  setup() {
    const items = ["Тонкое","Традиционное"];
    const activeItem = ref(0);

    const handleActiveItem = (index) => {
      activeItem.value = index;
    };

    return { items, handleActiveItem, activeItem };
  },
};
</script>

<style>
</style>