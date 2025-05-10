import React, { useState, useEffect } from 'react';
import { useSound } from 'use-sound'; 

const SnakeGame = ({ onExit }) => {
  const [snake, setSnake] = useState([[5, 5]]);
  const [food, setFood] = useState([10, 10]);
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1); 
  const [foodValue, setFoodValue] = useState(1); 
  const [walls, setWalls] = useState([]); 
  const [speed, setSpeed] = useState(200);

  const gridSize = 20;

  const [playFoodSound] = useSound('/sounds/food.mp3', { volume: 1.0 }); 

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

  const generateWalls = (level) => {
    const walls = [];
    const wallCount = Math.min(level * 2, gridSize);

    for (let i = 0; i < wallCount; i++) {
      const wallX = Math.floor(Math.random() * gridSize);
      const wallY = Math.floor(Math.random() * gridSize);

      if (
        !snake.some((segment) => segment[0] === wallX && segment[1] === wallY) &&
        !(food[0] === wallX && food[1] === wallY)
      ) {
        walls.push([wallX, wallY]);
      }
    }

    return walls;
  };

  useEffect(() => {
    setWalls(generateWalls(level)); 
    setSpeed((prevSpeed) => Math.max(prevSpeed - 10, 50)); 
  }, [level]);

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
          newSnake.some((segment) => segment[0] === newHead[0] && segment[1] === newHead[1]) ||
          walls.some((wall) => wall[0] === newHead[0] && wall[1] === newHead[1])
        ) {
          setGameOver(true);
          return prevSnake;
        }

        newSnake.push(newHead);

        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          playFoodSound(); 
          if (foodValue >= 9) {
            setLevel((prevLevel) => prevLevel + 1); 
            setFoodValue(1); 
          } else {
            setFoodValue(foodValue + 1);
          }
          setFood([Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)]);
        } else {
          newSnake.shift();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, speed); 
    return () => clearInterval(interval);
  }, [direction, food, gameOver, foodValue, level, walls, speed]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '20px',
        backgroundColor: 'blue',
        color: 'white',
        padding: '10px',
        border: '5px solid pink', 
      }}
    >
      <h1 style={{ fontFamily: 'Courier New, monospace' }}>Nibbles Game - Level {level}</h1>
      {gameOver ? (
        <>
          <p style={{ fontFamily: 'Courier New, monospace' }}>Game Over! Thank you for playing Nibbles by Michael.</p>
          <button
            onClick={() => {
              setSnake([[5, 5]]); 
              setFood([Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)]); 
              setDirection('RIGHT'); 
              setGameOver(false); 
              setLevel(1);
              setFoodValue(1); 
              setWalls([]); 
              setSpeed(200); 
            }}
            style={{
              backgroundColor: 'white',
              color: 'black',
              border: '1px solid black',
              padding: '5px 10px',
              cursor: 'pointer',
              fontFamily: 'Courier New, monospace',
              marginRight: '10px',
            }}
          >
            Play Again
          </button>
          <button
            onClick={onExit}
            style={{
              backgroundColor: 'white',
              color: 'black',
              border: '1px solid black',
              padding: '5px 10px',
              cursor: 'pointer',
              fontFamily: 'Courier New, monospace',
            }}
          >
            Exit
          </button>
        </>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateRows: `repeat(${gridSize}, 20px)`,
            gridTemplateColumns: `repeat(${gridSize}, 20px)`,
            backgroundColor: 'black', 
            border: '2px solid white',
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, index) => {
            const x = Math.floor(index / gridSize);
            const y = index % gridSize;
            const isSnake = snake.some((segment) => segment[0] === x && segment[1] === y);
            const isFood = food[0] === x && food[1] === y;
            const isWall = walls.some((wall) => wall[0] === x && wall[1] === y);

            return (
              <div
                key={index}
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: isSnake
                    ? 'yellow' 
                    : isWall
                    ? 'pink' 
                    : 'blue', // Removed background for food
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontFamily: 'Courier New, monospace',
                  color: isFood ? 'white' : 'black', // Food numbers will still be visible
                }}
              >
                {isFood ? foodValue : ''}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SnakeGame;