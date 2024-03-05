import { createStore, action, persist } from "easy-peasy";

const getInitState = (creator, starter) => {
  const initState = {
    rows: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
    winner: "",
    turn: starter || "X",
    player: creator ? "X" : "O",
  };
  return initState;
};

export const store = createStore(
  persist(
    {
      isCreator: false,
      activeGame: "",
      activeGamePath: "",
      winner: "",
      gameState: getInitState(),
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

      setGameState: action((state, payload) => {
        state.gameState = { ...state.gameState, ...payload };

        console.log(state.gameState);
      }),

      setIsCreator: action((state, payload) => {
        state.isCreator = payload;
      }),

      setGame: action((state) => {
        state.gameState = getInitState(state.isCreator);
      }),

      resetGame: action((state) => {
        state.gameState = getInitState(
          state.isCreator,
          state.winner === "X" ? "O" : "X"
        );
      }),
    },
    {
      storage: "localStorage",
      allow: ["turn", "game"],
    }
  )
);

export default store;
