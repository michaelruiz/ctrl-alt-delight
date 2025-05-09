import React, { useState, useEffect } from 'react';

const SnakeGame = ({ onExit }) => {
  const [snake, setSnake] = useState([[5, 5]]);
  const [food, setFood] = useState([10, 10]);
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);

  const gridSize = 20;

  useEffect(() => {
    console.log('SnakeGame mounted');
    return () => console.log('SnakeGame unmounted');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = newSnake[newSnake.length - 1];
        let newHead;

        switch (direction) {
          case 'UP':
            newHead = [head[0] - 1, head[1]];
            break;
          case 'DOWN':
            newHead = [head[0] + 1, head[1]];
            break;
          case 'LEFT':
            newHead = [head[0], head[1] - 1];
            break;
          case 'RIGHT':
            newHead = [head[0], head[1] + 1];
            break;
          default:
            return prevSnake;
        }

        if (
          newHead[0] < 0 ||
          newHead[1] < 0 ||
          newHead[0] >= gridSize ||
          newHead[1] >= gridSize ||
          newSnake.some((segment) => segment[0] === newHead[0] && segment[1] === newHead[1])
        ) {
          setGameOver(true);
          return prevSnake;
        }

        newSnake.push(newHead);

        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setFood([Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)]);
        } else {
          newSnake.shift();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      <h1>Snake Game</h1>
      {gameOver ? (
        <>
          <p>Game Over! Thank you for playing.</p>
          <button onClick={onExit}>Exit</button>
        </>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateRows: `repeat(${gridSize}, 20px)`,
            gridTemplateColumns: `repeat(${gridSize}, 20px)`,
            gap: '1px',
            backgroundColor: 'black',
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, index) => {
            const x = Math.floor(index / gridSize);
            const y = index % gridSize;
            const isSnake = snake.some((segment) => segment[0] === x && segment[1] === y);
            const isFood = food[0] === x && food[1] === y;

            return (
              <div
                key={index}
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: isSnake ? 'green' : isFood ? 'red' : 'white',
                }}
              ></div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SnakeGame;