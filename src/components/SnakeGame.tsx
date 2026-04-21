import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 18;
const INITIAL_SNAKE = [{ x: 9, y: 9 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 120;

type Point = { x: number; y: number };

const generateFood = (snake: Point[]) => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 4, y: 4 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef(direction);
  
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y,
      };

      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, isGameOver, isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInputOrButton = activeTag === 'input' || activeTag === 'button';

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) && !isInputOrButton) {
        e.preventDefault();
      }
      if (e.key === " " && !isInputOrButton) {
        e.preventDefault();
      }

      if (isInputOrButton && e.key === " ") return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (isGameOver) resetGame();
          else setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver]);

  useEffect(() => {
    const interval = setInterval(moveSnake, Math.max(40, INITIAL_SPEED - score));
    return () => clearInterval(interval);
  }, [moveSnake, score]);

  return (
    <div className="flex flex-col items-center bg-black border-4 border-fuchsia-500 p-4 shadow-[10px_10px_0_0_#00ffff] relative screen-tear max-w-[400px] w-full">
      <div className="flex justify-between items-center w-full mb-4 border-b-4 border-cyan-400 pb-2">
        <div 
          className="font-digital text-6xl leading-none text-cyan-400 glitch-heavy" 
          data-text={`SCORE: ${score.toString().padStart(4, '0')}`}
        >
          SCORE: {score.toString().padStart(4, '0')}
        </div>
        <div className="text-fuchsia-500 font-digital text-3xl leading-none flex items-center justify-center uppercase">
          {isGameOver ? (
            <span className="bg-fuchsia-500 text-black px-2">DEAD</span>
          ) : isPaused ? (
            <span className="animate-pulse">PAUSED</span>
          ) : (
            <span>RUN</span>
          )}
        </div>
      </div>

      <div 
        className="grid bg-[#0a0a0a] border-4 border-cyan-400 relative z-10 p-0"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: '320px',
          height: '320px',
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake.some((seg, idx) => idx !== 0 && seg.x === x && seg.y === y);
          const isFoodNode = food.x === x && food.y === y;

          let cellClass = "";
          if (isSnakeHead) {
            cellClass = "bg-white border-[1px] border-black z-10 shadow-[0_0_10px_#fff]";
          } else if (isSnakeBody) {
            cellClass = "bg-cyan-400 border-[1px] border-black";
          } else if (isFoodNode) {
            cellClass = "bg-fuchsia-500 animate-pulse border-[1px] border-black";
          }

          return (
            <div key={i} className={`w-full h-full ${cellClass}`} />
          );
        })}
        
        {isGameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 space-y-6 border-4 border-fuchsia-500">
            <h2 className="text-6xl font-digital text-fuchsia-500 glitch-heavy text-center leading-none" data-text="SYSTEM HALTED">
              SYSTEM HALTED
            </h2>
            <button 
              onClick={resetGame}
              className="px-6 py-2 bg-black border-4 border-cyan-400 text-cyan-400 font-digital text-3xl hover:bg-cyan-400 hover:text-black uppercase shadow-[4px_4px_0_0_#f0f] active:shadow-none active:translate-y-1 active:translate-x-1 transition-all"
            >
              [ REBOOT CACHE ]
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 text-cyan-400 text-lg font-digital uppercase w-full text-center bg-fuchsia-500/20 py-1 border border-fuchsia-500">
        &gt;&gt; WASD_ARROWS TO MOVE // SPACE: BREAK
      </p>
    </div>
  );
}
