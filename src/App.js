import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Container from "./Container.js";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
        <h2>Drag and drop multiple items with React DnD</h2>
        <h4>Use Shift or Cmd key to multi-select</h4>
      <DndProvider backend={HTML5Backend}>
        <Container />
      </DndProvider>
    </div>
  );
}
