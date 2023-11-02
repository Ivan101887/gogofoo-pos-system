import { createStore } from 'vuex';

interface State {
  currentElement: HTMLInputElement | null;
}

export default createStore({
  state: {
    currentElement: null,
  },
  getters: {
    getCurrentElement: (state: State) => state.currentElement,
  },
  mutations: {
    ASSIGN_EL(state: State, el: HTMLInputElement) {
      state.currentElement = el;
    },
  },
  actions: {
    assign_el({ commit }, el: HTMLInputElement) {
      commit('ASSIGN_EL', el);
    },
  },
});
