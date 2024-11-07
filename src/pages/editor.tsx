import { Navigation } from "../ui/navigation";
import { Title } from "../ui/title";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Node } from '../logic/node';
import { unpackTree, FlowEdge, FlowNode, markRoot, UnpackedTree } from '../logic/unpacked';
import { Branch } from '../logic/branch';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, reconnectEdge, Connection, MarkerType} from '@xyflow/react';
import * as Dagre from '@dagrejs/dagre';
import { nanoid } from "nanoid";

import { EditableNode } from "../ui/editor/editable-node";
import { EditableEdge } from "../ui/editor/editable-edge";
import '@xyflow/react/dist/style.css';

function saveState(tree: UnpackedTree) {
  localStorage.setItem("tree-data", JSON.stringify(tree));
}

function loadState(): UnpackedTree {
  try {
    let data = JSON.parse(localStorage.getItem("tree-data"));

    if (data) {
      return data;
    }
    
  }
  catch {}

  let root = nanoid();
  return { edges: [], nodes: [{ id: root, data: { label: "Start", root: true }, position: { x: 0, y: 0 }, type: "editableNode"}], root }
}

function generate(elements: number): Node {
  let children = [];
  
  if (elements > 0) {
    children.push(new Branch("Tak jak pan jezus powiedział!", generate(elements - 1)));
  }

  children.push(new Branch("Nie wiem!", new Node("Koniec!")));  

  return new Node("A jak pan jezus powiedział?", ...children);
}

const getLayoutedElements = (nodes: FlowNode[], edges: FlowEdge[]) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB' });
 
  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    }),
  );
 
  Dagre.layout(g);
 
  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      // https://reactflow.dev/learn/layouting/layouting#dagre
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;
 
      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

const nodeTypes = { editableNode: EditableNode };
const edgeTypes = { editableEdge: EditableEdge };

export const EditorPage = () => {
  const initialTree = useMemo(loadState, []); //useMemo(() => markRoot(unpackTree(generate(5))), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialTree.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialTree.edges);
  const root = useMemo(() => nodes.find(node => node.id === initialTree.root), [nodes]);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);
  const [layout, setLayout] = useState(0);

  const updateLayout = () => {
    const layouted = getLayoutedElements(nodes, edges);

    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);
  }

  const onConnect = useCallback(
    (params) => {
      setEdges((edges) => addEdge({ ...params, label: "Answer", markerEnd: { type: MarkerType.ArrowClosed }, type: "editableEdge"}, edges));
      setLayout(0);
    },
    [setEdges],
  );

  const onReconnect = useCallback(
    (oldEdge: FlowEdge, newConnection: Connection) => {
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
      setLayout(0);
    },
    [setEdges],
  );

  const onSelectionChange = useCallback(({ nodes, edges }) => {
    setSelectedNodes(nodes.map((node: FlowNode) => node.id));
    setSelectedEdges(edges.map((edge: FlowEdge) => edge.id));
  }, []);

  useEffect(() => () => saveState({ edges, nodes, root: root.id }), [root, edges, nodes]);

  useEffect(() => {
    const event = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (selectedNodes.length > 1) {
          return;
        }

        const selected = nodes.find((node) => selectedNodes[0] === node.id);

        if (!selected) {
          return;
        }

        const node = nanoid();
        const edge = `${selected.id}${node}`;

        setNodes((nodes) => [...nodes, {
          id: node,
          data: { label: "Answer", edit: true },
          position: { x: selected.position.x, y: selected.position.y },          
          type: "editableNode"
        }]);

        setEdges((edges) => addEdge({ 
          id: edge, 
          source: selected.id,
          target: node,
          label: "Question", 
          markerEnd: { type: MarkerType.ArrowClosed },
          type: "editableEdge"
        }, edges));
        
        setLayout(0);
      }

      else if (e.key === "Delete") {
        console.log(initialTree, root, nodes);

        if (selectedNodes.includes(root.id)) {
          return;
        }

        setNodes((nodes) => nodes.filter((node) => !selectedNodes.includes(node.id))); 
        setEdges((edges) => edges.filter((edge) => !selectedEdges.includes(edge.id)));
        setLayout(0);
      }
    };
    
    document.addEventListener('keyup', event);
    return () => document.removeEventListener('keyup', event);
  }, [selectedEdges, selectedNodes, updateLayout]);

  useEffect(() => {
    const filterDisconnectedEdges = (edges: FlowEdge[]): FlowEdge[] => {
      return edges.filter(edge => [edge.source, edge.target].every(id => nodes.some(node => node.id === id)))
    }

    setEdges(filterDisconnectedEdges);
  }, [setEdges, nodes])

  useEffect(() => {
    if (edges.length == 0 || nodes.length === 0 || layout > 3) {
      return;
    }

    updateLayout();
    setLayout(layout => layout + 1);
  }, [edges, nodes, updateLayout, layout])

  return (
    <div className="bg-black w-screen h-screen p-10 flex flex-col justify-center items-stretch">
      <Title>Editor Page</Title>
      
      <Navigation 
        items={[
          ["/quiz", "Go to quiz"],
          ["/", "Go to main page"],
        ]}
      />  
      
      <div className="border border-yellow-400 p-1 m-1 w-full min-h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          colorMode="dark"
          proOptions={{hideAttribution: true}}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onReconnect={onReconnect}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          nodesDraggable={false} 
          zoomOnDoubleClick={false}
          deleteKeyCode={[]}
        >
          <Controls />
          <MiniMap />
          <Background />
        </ReactFlow>
      </div>
    </div>
  )
}