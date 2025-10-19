import * as go from "gojs";

export function createMindmap(diagramDiv) {
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

  myDiagram.layout = $(go.TreeLayout, { angle: 90, arrangement: go.TreeLayout.ArrangementVertical });

  myDiagram.model = new go.GraphLinksModel([
    { key: "Topik Utama" },
    { key: "Sub 1" },
    { key: "Sub 2" }
  ], [
    { from: "Topik Utama", to: "Sub 1" },
    { from: "Topik Utama", to: "Sub 2" }
  ]);

  return myDiagram;
}