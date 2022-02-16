<template>
  <h2 class="content__title">Все пиццы</h2>
  <div class="content__items">
      <Item v-for="pizza in pizzas" :key="pizza.id" :pizza="pizza"/>
  </div>
</template>

<script>
import { computed, onMounted, ref } from '@vue/runtime-core';
import { useStore } from 'vuex';
import Item from './Item';
export default {
    components: { Item },
    setup(){
        const store = useStore();
        const pizzas = computed(() => store.state.pizzas);

        store.dispatch('getPizzaAction');

        return {
            pizzas
        };

    }
}
</script>

<style>

</style>