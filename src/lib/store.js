import { createStore, action, persist } from "easy-peasy";

export const store = createStore(
  persist(
    {
      activeGame: "",
      activeGamePath: "",
      user: null,
      channel: null,
      rivals: [],
      gameStats: {}, // Adjusted part
      // Other actions...
      setGameStat: action((state, { gameId, statType }) => {
        if (!state.gameStats[gameId]) {
          state.gameStats[gameId] = { wins: 0, losses: 0, draws: 0 };
        }
        state.gameStats[gameId][statType] += 1;
      }),
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
    },
    {
      storage: "localStorage",
      allow: ["gameStats"],
    }
  )
);

export default store;
