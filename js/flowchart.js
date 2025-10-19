import * as go from "gojs";

export function createFlowchart(diagramDiv) {
  const $ = go.GraphObject.make;
  const myDiagram = $(go.Diagram, diagramDiv, {
    initialContentAlignment: go.Spot.Center,
    "undoManager.isEnabled": true,
    "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
    allowHorizontalScroll: true,
    allowVerticalScroll: true
  });

  myDiagram.nodeTemplate =
    $(go.Node, "Auto",
      { movable: true, resizable: true },
      $(go.Shape, "RoundedRectangle",
        { fill: "#f5f9ff", stroke: "#007bff", strokeWidth: 2 }),
      $(go.TextBlock,
        { margin: 8, editable: true, font: "500 14px Poppins, sans-serif" },
        new go.Binding("text", "key").makeTwoWay())
    );

  myDiagram.layout = $(go.LayeredDigraphLayout);

  myDiagram.model = new go.GraphLinksModel([
    { key: "Start" },
    { key: "Proses 1" },
    { key: "Decision" },
    { key: "End" }
  ], [
    { from: "Start", to: "Proses 1" },
    { from: "Proses 1", to: "Decision" },
    { from: "Decision", to: "End" }
  ]);

  return myDiagram;
}