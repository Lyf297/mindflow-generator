const $ = go.GraphObject.make;
let myDiagram, currentMode='mindmap', currentTemplate='Rectangle';

/* --- Diagram Creation --- */
function createDiagram(mode) {
  const layout = mode==='mindmap' ? $(go.TreeLayout,{angle:90}) : $(go.LayeredDigraphLayout);
  const diagram = $(go.Diagram,'diagramDiv',{
    'undoManager.isEnabled': true,
    layout,
    'toolManager.mouseWheelBehavior': go.ToolManager.WheelZoom
  });

  diagram.nodeTemplate = $(go.Node,'Auto',
    { movable:true, resizable:true },
    $(go.Shape,'RoundedRectangle',{fill:'#f5f9ff', stroke:'#007bff', strokeWidth:2},
      new go.Binding('figure','figure')),
    $(go.TextBlock,{margin:8, editable:true, font:'500 14px Poppins, sans-serif'},
      new go.Binding('text','key').makeTwoWay())
  );

  if(mode==='mindmap') {
    diagram.model = new go.GraphLinksModel(
      [{key:'Topik Utama', figure: currentTemplate}, {key:'Sub 1', figure: currentTemplate}, {key:'Sub 2', figure: currentTemplate}],
      [{from:'Topik Utama', to:'Sub 1'}, {from:'Topik Utama', to:'Sub 2'}]
    );
  } else {
    diagram.model = new go.GraphLinksModel(
      [{key:'Start', figure: currentTemplate}, {key:'Proses 1', figure: currentTemplate}, {key:'Decision', figure: currentTemplate}, {key:'End', figure: currentTemplate}],
      [{from:'Start', to:'Proses 1'}, {from:'Proses 1', to:'Decision'}, {from:'Decision', to:'End'}]
    );
  }

  return diagram;
}

/* --- Init Diagram --- */
function initDiagram(){ myDiagram = createDiagram('mindmap'); }
initDiagram();

/* --- Mode Switch --- */
document.getElementById('mindmapMode').addEventListener('click',()=>{
  currentMode='mindmap';
  document.getElementById('mindmapMode').classList.add('active');
  document.getElementById('flowchartMode').classList.remove('active');
  myDiagram.div=null;
  myDiagram=createDiagram('mindmap');
});
document.getElementById('flowchartMode').addEventListener('click',()=>{
  currentMode='flowchart';
  document.getElementById('flowchartMode').classList.add('active');
  document.getElementById('mindmapMode').classList.remove('active');
  myDiagram.div=null;
  myDiagram=createDiagram('flowchart');
});

/* --- Template Switch --- */
document.getElementById('nodeTemplateSelect').addEventListener('change',e=>{ currentTemplate=e.target.value; });

/* --- Add Node --- */
document.getElementById('addNode').addEventListener('click',()=>{
  const sel=myDiagram.selection.first();
  if(!sel){ alert('Pilih node terlebih dahulu!'); return; }
  myDiagram.startTransaction('add node');
  const newKey='Node '+(myDiagram.model.nodeDataArray.length+1);
  myDiagram.model.addNodeData({key:newKey, figure: currentTemplate});
  myDiagram.model.addLinkData({from:sel.data.key, to:newKey});
  myDiagram.commitTransaction('add node');
});

/* --- Duplicate Node --- */
document.getElementById('duplicateNode').addEventListener('click',()=>{
  const sel=myDiagram.selection.first();
  if(!sel){ alert('Pilih node untuk duplikasi!'); return; }
  myDiagram.startTransaction('duplicate node');
  const newKey='Node '+(myDiagram.model.nodeDataArray.length+1);
  myDiagram.model.addNodeData({key:newKey, figure: sel.data.figure});
  myDiagram.model.addLinkData({from:sel.data.key, to:newKey});
  myDiagram.commitTransaction('duplicate node');
});

/* --- Delete Node --- */
document.getElementById('deleteNode').addEventListener('click',()=>{
  const sel=myDiagram.selection.first();
  if(!sel){ alert('Pilih node terlebih dahulu!'); return; }
  myDiagram.startTransaction('delete node');
  myDiagram.remove(sel);
  myDiagram.commitTransaction('delete node');
});

/* --- Undo / Redo --- */
document.getElementById('undoBtn').addEventListener('click',()=>{ myDiagram.commandHandler.undo(); });
document.getElementById('redoBtn').addEventListener('click',()=>{ myDiagram.commandHandler.redo(); });

/* --- Export PNG --- */
document.getElementById('exportPNG').addEventListener('click',()=>{
  const img=myDiagram.makeImageData({scale:1, background:'white'});
  const link=document.createElement('a'); link.href=img; link.download='mindflow.png'; link.click();
});

/* --- Export JSON --- */
document.getElementById('exportJSON').addEventListener('click',()=>{
  const json=myDiagram.model.toJson();
  const blob=new Blob([json],{type:'application/json'});
  const link=document.createElement('a'); link.href=URL.createObjectURL(blob); link.download='mindflow.json'; link.click();
});

/* --- Import JSON --- */
const importFileInput=document.getElementById('importFile');
document.getElementById('importJSONBtn').addEventListener('click',()=>importFileInput.click());
importFileInput.addEventListener('change',e=>{
  const file=e.target.files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=event=>{ myDiagram.model=go.Model.fromJson(event.target.result); };
  reader.readAsText(file);
});

/* --- Search Node --- */
document.getElementById('searchNode').addEventListener('input',()=>{
  const query=document.getElementById('searchNode').value.toLowerCase();
  myDiagram.nodes.each(n=>{ n.isSelected=n.data.key.toLowerCase().includes(query); });
});