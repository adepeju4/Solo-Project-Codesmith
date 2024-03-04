import { createStore, action } from "easy-peasy";

export const store = createStore({
  activeGame: "",
  activeGamePath: "",
  user: null,
  channel: null,
  rivals: [],
  setActiveGame: action((state, payload) => {
    state.activeGame = payload;
  }),
  setUser: action((state, payload) => {
    state.user = payload;
  }),
  setChannel: action((state, payload) => {
    state.channel = payload;
  }),
  setRivals: action((state, payload) => {
    state.rivals = payload;
  }),
  setActiveGamePath: action((state, payload) => {
    state.activeGamePath = payload;
  }),
});

export default store;
