import { createStore, action } from 'easy-peasy';

export const store = createStore({
  activeGame: '',

  setActiveGame: action((state, payload) => {
    state.activeGame = payload;
  }),
});

export default store;
