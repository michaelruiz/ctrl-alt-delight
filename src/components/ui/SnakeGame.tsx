import React, { useState, useEffect } from 'react';
import { useSound } from 'use-sound';
import { Button } from './Button';

interface SnakeGameProps {
  onExit: () => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onExit }) => {
  const [snake, setSnake] = useState<[number, number][]>([[5, 5]]);
  const [food, setFood] = useState<[number, number]>([10, 10]);
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [foodValue, setFoodValue] = useState(1);
  const [walls, setWalls] = useState<[number, number][]>([]);
  const [speed, setSpeed] = useState(200);
  const [score, setScore] = useState(0);

  const gridSize = 20;
  const cellSize = 16; // Reduced cell size to fit better

  const [playFoodSound] = useSound('/sounds/food.mp3', { volume: 1.0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault(); // Prevent default behavior for WASD keys

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const generateWalls = (level: number): [number, number][] => {
    const walls: [number, number][] = [];
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
        let newHead: [number, number];

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
          setScore(prev => prev + foodValue);
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
  }, [direction, food, gameOver, foodValue, level, walls, speed, playFoodSound]);

  const resetGame = () => {
    setSnake([[5, 5]]);
    setFood([Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)]);
    setDirection('RIGHT');
    setGameOver(false);
    setLevel(1);
    setFoodValue(1);
    setWalls([]);
    setSpeed(200);
    setScore(0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="bg-gray-900 w-full max-w-3xl h-[80vh] rounded-lg shadow-xl flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-green-400 font-mono">Snake Game - Level {level}</h2>
          <div className="text-green-400 font-mono">Score: {score}</div>
        </div>

        <div className="flex-1 overflow-hidden p-4 flex flex-col items-center justify-center">
          {gameOver ? (
            <div className="text-center">
              <p className="text-red-400 font-mono mb-4">Game Over! Final Score: {score}</p>
              <div className="space-x-4">
                <Button onClick={resetGame} className="bg-green-500 hover:bg-green-600 text-black">
                  Play Again
                </Button>
                <Button onClick={onExit} className="bg-red-500 hover:bg-red-600 text-white">
                  Exit
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="mx-auto"
              style={{
                display: 'grid',
                gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
                gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
                backgroundColor: 'black',
                border: '2px solid #10B981',
                gap: '1px',
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
                    className={`${
                      isSnake
                        ? 'bg-green-400'
                        : isFood
                        ? 'bg-red-400'
                        : isWall
                        ? 'bg-gray-600'
                        : 'bg-gray-900'
                    }`}
                    style={{ width: cellSize, height: cellSize }}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-700 text-green-400 font-mono text-sm">
          <p>Controls: Arrow keys to move</p>
          <p>Level {level}: {walls.length} walls, Speed: {Math.round(1000/speed)} moves/sec</p>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame; 