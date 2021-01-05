import { useState, useCallback, useRef, useEffect } from "react";
import produce from "immer";
type config = {
  numRows: number
}
const numRows = 50;
const numCols = 50;
const initialRandomWeight = 100;
const operations = [
  [0, 1],
  [1, 1],
  [-1, 1],
  [-1, 0],
  [1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
];
const getNeighbors = (grid: boolean[][], i: number, j: number) => {
  let neighbors = 0;
  operations.forEach((op) => {
    const k = i + op[0];
    const l = j + op[1];
    if (k >= 0 && l >= 0 && k < 50 && l < 50 && grid[k][l]) neighbors++;
  });
  return neighbors;
};

const getNewGrid = (cellResolverFn = () => false) => {
  let grid: boolean[][] = [];
  for (let i = 0; i < numRows; i++) {
    grid.push(Array.from(Array(numCols), cellResolverFn));
  }
  return grid;
};

const randomize = (weight : number) => {
  return getNewGrid(() => Math.random() > weight / 100);
};

export function useGameOfLife({ numRows } : config) {
  const [grid, setGrid] = useState(getNewGrid);
  const [running, setRunning] = useState(false);
  const runningRef = useRef(false);
  runningRef.current = running;
  const [randomWeight, setRandomWeight] = useState(initialRandomWeight);

  useEffect(() => {
    setGrid(randomize(randomWeight));
  }, [randomWeight]);

  const reset = () => {
    setRandomWeight(100);
    setGrid(getNewGrid());
  };

  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;
    setGrid((g) => {
      return produce(g, (drafGrid) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numRows; j++) {
            const neighbors = getNeighbors(g, i, j);
            if (!g[i][j] && neighbors === 3) {
              drafGrid[i][j] = true;
            } else if (g[i][j] && (neighbors < 2 || neighbors > 3)) {
              drafGrid[i][j] = false;
            }
          }
        }
      });
      // Simulate
    });
    setTimeout(() => runSimulation(), 200);
  }, [numRows]);
  const handleCellClick = (row : number, col: number) => {
    const newGrid = produce(grid, (draftGrid) => {
      draftGrid[row][col] = !grid[row][col];
    });
    setGrid(newGrid);
  };
  const toggleRunning = () => {
    setRunning(!running);
    setTimeout(runSimulation, 1000);
  };

  return {
    grid,
    handleCellClick,
    toggleRunning,
    running,
    randomWeight,
    setRandomWeight,
    reset,
  };
}
