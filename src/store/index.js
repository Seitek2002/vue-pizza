import { createStore } from "vuex";

export default createStore({
  state: {
    pizzas: [],
    category: null,
    sortBy: {
      id: 0,
      name: "rating",
    },
    cartItems: new Map(),
  },
  getters: {
    getAddedPizzasCount(state) {
      let totalCount = 0;
      const pizzas = state.cartItems.values();

      for (const pizza of pizzas) {
        totalCount += pizza.count;
      }
      return totalCount;
    },
    getAddedPizzasPrice(state) {
      let totalPrice = 0;
      const pizzas = state.cartItems.values();

      for (const pizza of pizzas) {
        const pizzaTotalPrice = pizza.price * pizza.count;
        totalPrice += pizzaTotalPrice;
      }

      return totalPrice;
    },
    getCartItemPizzas(state) {
      let addedPizzas = [];

      for (const pizza of state.cartItems.values()) {
        addedPizzas = [...addedPizzas, pizza];
      }

      return addedPizzas;
    },
    getCartItemTotalPrice: () => (pizza) => {
      const pizzaTotalPrice = pizza.price * pizza.count;

      return pizzaTotalPrice;
    },
  },
  mutations: {
    GET_PIZZA(state, pizzas) {
      state.pizzas = pizzas;
    },
    SET_CATEGORY(state, categoryIndex) {
      state.category = categoryIndex;
    },
    SET_SORT(state, sortItem) {
      switch (sortItem.sortBy) {
        case "rating":
          {
            state.pizzas.sort((a, b) => a.rating - b.rating);
            state.sortBy = { name: sortItem.sortBy, id: sortItem.id };
          }
          break;
        case "name":
          {
            state.pizzas.sort((a, b) => a.name.localeCompare(b.name));
            state.sortBy = { name: sortItem.sortBy, id: sortItem.id };
          }
          break;
        case "price":
          {
            state.pizzas.sort((a, b) => a.price - b.price);
            state.sortBy = { name: sortItem.sortBy, id: sortItem.id };
          }
          break;
      }
    },
    ADD_CART(state, pizza) {
      const stringifiedPizza = JSON.stringify(pizza);
      const isPizzaAdded = state.cartItems.get(stringifiedPizza);

      if (!isPizzaAdded) {
        state.cartItems.set(stringifiedPizza, { ...pizza, count: 1 });
        return;
      } else {
        const addedPizza = state.cartItems.get(stringifiedPizza);
        state.cartItems.set(stringifiedPizza, {
          ...pizza,
          count: addedPizza.count + 1,
        });
        return;
      }
    },
    DECREMENT_ITEM_PIZZA(state, pizza) {
      const copyPizza = { ...pizza };
      delete copyPizza.count;
      const stringifiedPizza = JSON.stringify(copyPizza);

      if (pizza.count > 1) {
        state.cartItems.set(stringifiedPizza, {
          ...pizza,
          count: pizza.count - 1,
        });
      }
    },
    DELETE_CART_ITEM(state, pizza) {
      delete pizza.count;
      const stringifiedPizza = JSON.stringify(pizza);

      state.cartItems.delete(stringifiedPizza);
    },
    INCREMENT_ITEM_PIZZA(state, pizza) {
      const copyPizza = { ...pizza };
      delete copyPizza.count;
      const stringifiedPizza = JSON.stringify(copyPizza);

      state.cartItems.set(stringifiedPizza, {
        ...pizza,
        count: pizza.count + 1,
      });
    },
    CLEAR_CART(state) {
      state.cartItems.clear();
    },
  },
  actions: {
    async getPizzaAction({ commit }) {
      const response = await fetch("http://localhost:3000/pizzas");
      const jsonPizzas = await response.json();
      commit("GET_PIZZA", jsonPizzas);
    },
    async getFilteredPizzas({ commit }, category) {
      const response = await fetch(
        `http://localhost:3000/pizzas?category=${category}`
      );
      const jsonPizzas = await response.json();
      commit("SET_CATEGORY", category);
      commit("GET_PIZZA", jsonPizzas);
    },
    async getSortedPizzas({ commit }, object) {
      console.log(object);
      const response = await fetch(
        `http://localhost:3000/pizzas?_sort=${object.sortBy}&_order=desc`
      );
      const jsonPizzas = await response.json();
      commit("GET_PIZZA", jsonPizzas);
      commit("SET_SORT", object);
      commit("SET_CATEGORY", null);
    },
  },
  modules: {},
});
