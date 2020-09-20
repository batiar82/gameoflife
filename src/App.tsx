import React, { useState, FC, useCallback, useRef, useEffect } from "react";
import "./App.css";
import produce from "immer";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RangeSlider from "react-bootstrap-range-slider";
import Form from "react-bootstrap/Form";
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

const getNewGrid = () => {
  let grid: boolean[][] = [];
  for (let i = 0; i < numRows; i++) {
    grid.push(Array.from(Array(numCols), () => false));
  }
  return grid;
};

const App: FC = () => {
  const [grid, setGrid] = useState(getNewGrid);

  const [running, setRunning] = useState(false);
  const [randomWeight, setRandomWeight] = useState(initialRandomWeight);
  const runningRef = useRef(false);
  useEffect(() => {
    randomize();
  }, [randomWeight]);
  runningRef.current = running;

  const reset = () => {
    setGrid(getNewGrid());
  };
  const randomize = () => {
    let grid: boolean[][] = [];
    for (let i = 0; i < numRows; i++) {
      grid.push(
        Array.from(Array(numCols), () => Math.random() > randomWeight / 100)
      );
    }
    setGrid(grid);
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
  }, []);

  return (
    <Jumbotron>
      <h1 className="text-center">John Conway's Game of Life</h1>
      <Container>
        <Row className="justify-content-xs-center">
          <Col xs={12}>
            <ButtonGroup
              style={{ display: "flex", justifyContent: "center" }}
              toggle
              className="mb-2"
            >
              <Button
                variant="outline-primary"
                onClick={() => {
                  setRunning(!running);
                  setTimeout(runSimulation, 1000);
                }}
              >
                {running ? "Stop" : "Start"}
              </Button>
              <Button
                variant="outline-primary"
                onClick={reset}
                disabled={running}
              >
                Reset
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
        <Row className="justify-content-xs-center">
          <Col xs={12} style={{ display: "flex", justifyContent: "center"}}>
            <span style={{marginRight: "20px"}}>Randomize</span>
          <RangeSlider
              value={randomWeight}
              tooltip="off"
              onChange={(e) => setRandomWeight(e.target.value)}
              disabled={running}
            />   
            
          </Col>
        </Row>
        <Row>
          <Col xs={12} style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                display: "grid",
                width: numRows * 20,
                gridTemplateColumns: "repeat(50,20px)",
                gridTemplateRows: "repeat(50,20px)",
                borderTop: "1px solid black",
                borderLeft: "1px solid black",
              }}
            >
              {grid.map((row, i) =>
                row.map((col, j) => (
                  <div
                    key={`${i}-${j}`}
                    style={{
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                      background: grid[i][j] ? "pink" : undefined,
                    }}
                    onClick={() => {
                      const newGrid = produce(grid, (draftGrid) => {
                        draftGrid[i][j] = !grid[i][j];
                      });
                      setGrid(newGrid);
                    }}
                  />
                ))
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </Jumbotron>
  );
};

export default App;
