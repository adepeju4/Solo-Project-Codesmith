import React, { useEffect } from 'react';
import selectImg from '../assets/selectgame.svg';
import ludo from '../assets/ludo.svg';
import chess from '../assets/chess.svg';
import tictactoe from '../assets/tictactoe.svg';
import { useStoreActions } from 'easy-peasy';
import { useStoreState } from 'easy-peasy';
import JoinGame from './JoinGame.js';

function ChooseGame() {
  const setGame = useStoreActions((state) => state.setActiveGame);
  const selectedGame = useStoreState((state) => state.activeGame);

  const gameOptions = [
    {
      gameImg: tictactoe,
      gameName: 'Tic Tac Toe',
    },
    {
      gameImg: chess,
      gameName: 'Chess',
    },
    {
      gameImg: ludo,
      gameName: 'Ludo',
    },
  ];

  const colorScheme = [
    {
      imgBg: '#FFA800',
      borderBg: '#FF8A00',
      textBg: '#F3501D',
    },
    {
      imgBg: '#EB00FF',
      borderBg: '#FF00A8',
      textBg: '#7213EB',
    },
    {
      imgBg: '#391898',
      borderBg: '#843CE0',
      textBg: '#451CBB',
    },
  ];

  const handleActiveGame = (game) => {
    setGame(game);
  };

  return (
    <>
      {selectedGame ? (
        <JoinGame />
      ) : (
        <div className="selectGame_wrapper">
          <header className="selectGame_header">
            <p className="selectgame-title">Select Game</p>

            <div className="gamePoints">
              <img src={selectImg} alt={'select game'} />
              <p className="gamePoints">0</p>
            </div>
          </header>

          <section className="gameList">
            {gameOptions.map((game, index) => (
              <div
                className="gameSelector"
                onClick={() => {
                  handleActiveGame(game.gameName);
                }}
                key={`keykey${index}`}
              >
                <div
                  className="game_img"
                  style={{
                    background: colorScheme[index].imgBg,
                    border: `2px solid ${colorScheme[index].borderBg}`,
                  }}
                >
                  <img src={game.gameImg} alt={game.gameName} />
                </div>
                <div
                  className="game_title"
                  style={{
                    backgroundColor: colorScheme[index].textBg,
                    border: `2px solid ${colorScheme[index].borderBg}`,
                  }}
                >
                  {game.gameName}
                </div>
              </div>
            ))}
          </section>
        </div>
      )}
    </>
  );
}

export default ChooseGame;
