import React, { useState, FC, useCallback, useRef } from 'react';
import './App.css';
import produce from "immer"
const numRows = 50;
const numCols = 50;
const operations = [
  [0, 1],
  [1, 1],
  [-1, 1],
  [-1, 0],
  [1, 0],
  [-1, -1],
  [0, -1],
  [1, -1]
]
const getNeighbors = (grid: boolean[][], i: number, j: number) => {
  let neighbors = 0;
  operations.forEach(op => {
    const k = i + op[0];
    const l = j + op[1];
    if (k >= 0 && l >= 0 && k < 50 && l < 50 && grid[k][l])
      neighbors++;
  })
  return neighbors;
}

const App: FC = () => {
  const [grid, setGrid] = useState(() => {
    let grid = [];
    for (let i = 0; i < numRows; i++) {
      grid.push(Array.from(Array(numCols), () => false))
    }
    return grid;
  })
  const [running, setRunning] = useState(false);
  const runningRef = useRef(false);
  runningRef.current = running;

  const randomize = () => {
    let grid = [];
    for (let i = 0; i < numRows; i++) {
      grid.push(Array.from(Array(numCols), () => Math.random() > 0.7))
    }
    setGrid(grid);
  }
  
  const runSimulation = useCallback(() => {
    if (!runningRef.current) return
    setGrid(g => {
      return produce(g, drafGrid => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numRows; j++) {
            const neighbors = getNeighbors(g, i, j);
            if (neighbors > 0) { console.log(neighbors) }
            if (!g[i][j] && neighbors === 3) {
              drafGrid[i][j] = true;
            }
            else if (g[i][j] && (neighbors < 2 || neighbors > 3)) {
              drafGrid[i][j] = false;
            }
          }
        }
      });
      // Simulate
    })
    setTimeout(() => runSimulation(), 200);
  }, []);

  return (
    <>
      <button onClick={() => {
        setRunning(!running)
        setTimeout(
          runSimulation, 1000);
      }}>{running ? 'Stop' : 'Start'}</button>
      <button onClick={randomize} disabled={running}>Randoimze</button>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(50,20px)',
        gridTemplateRows: 'repeat(50,20px)'
      }

      }>
        {grid.map((row, i) => row.map((col, j) => <div key={`${i}-${j}`} style={{
          width: 20,
          height: 20,
          border: '1px solid black',
          background: grid[i][j] ? 'pink' : undefined
        }}
          onClick={() => {
            const newGrid = produce(grid, draftGrid => {
              draftGrid[i][j] = !grid[i][j];
            })
            setGrid(newGrid);
          }}
        />
        ))}

      </div>
    </>
  );
}

export default App;
