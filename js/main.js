import { createMindmap } from "./mindmap.js";
import { createFlowchart } from "./flowchart.js";

let diagramDiv = "diagramDiv";
let currentMode = "mindmap";
let myDiagram = createMindmap(diagramDiv);

// Mode switch
const mindmapBtn = document.getElementById("mindmapMode");
const flowchartBtn = document.getElementById("flowchartMode");

mindmapBtn.addEventListener("click", () => {
  currentMode = "mindmap";
  mindmapBtn.classList.add("active");
  flowchartBtn.classList.remove("active");
  myDiagram.div = null;
  myDiagram = createMindmap(diagramDiv);
});

flowchartBtn.addEventListener("click", () => {
  currentMode = "flowchart";
  flowchartBtn.classList