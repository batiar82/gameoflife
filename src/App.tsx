import React, {FC } from "react";
import "./App.css";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RangeSlider from "react-bootstrap-range-slider";
import { useGameOfLife } from "./GameOfLife";

const App: FC = () => {
  const {
    grid,
    toggleRunning,
    running,
    handleCellClick,
    reset,
    randomWeight,
    setRandomWeight
    } = useGameOfLife({numRows: 50})

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
                onClick={toggleRunning}
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
          <Col xs={12} style={{ display: "flex", justifyContent: "center" }}>
            <span style={{ marginRight: "20px" }}>Randomize</span>
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
                width: 50 * 20,
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
                    onClick={() => handleCellClick(i,j)}
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
