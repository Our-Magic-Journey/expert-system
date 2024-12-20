import { MarkerType } from "@xyflow/react";
import { Node } from "./node";
import { Branch } from "./branch";

export type FlowEdge = { id: string, type?: string, source: string, target: string, label: string, markerEnd: { type: MarkerType } };
export type FlowNode = { id: string, type?: string, data: { label: string, root?: boolean }, position: { x: number, y: number }, measured?: { width: number, height: number } };
export type UnpackedTree = { edges: FlowEdge[], nodes: FlowNode[], root: string }

export function packTree(data: UnpackedTree): Node {
  let nodes: {[ key: string ]: Node} = {};

  for (let node of data.nodes) {
    nodes[node.id] = new Node(node.data.label);
  }

  for (let edge of data.edges) {
    nodes[edge.source]?.addChildren(new Branch(edge.label, nodes[edge.target]));
  }

  return nodes[data.root];
}

export function unpackTree(node: Node): UnpackedTree {
  let edges: FlowEdge[] = [];
  let nodes: FlowNode[] = [];

  nodes.push({ 
    id: node.index,
    data: { label: node.text },
    position: { x: 0, y: 0 },
    type: 'editableNode',
  });

  for (let branch of node.children) {
    edges.push({
      id: `${node.index}${branch.target.index}`,
      target: branch.target.index,
      source: node.index,
      label: branch.text,
      markerEnd: { type: MarkerType.ArrowClosed },
      type: 'editableEdge',
    })

    let subTree = unpackTree(branch.target);

    edges.push(...subTree.edges.filter(edge => !edges.some(({ id }) => id === edge.id)));
    nodes.push(...subTree.nodes.filter(node => !nodes.some(({ id }) => id === node.id)));
  }

  return { edges, nodes, root: node.index };
}

export function markRoot({ edges, nodes, root }: UnpackedTree): UnpackedTree {
  return { edges, root, nodes: nodes.map(node => node.id === root ? { ...node, data: { ...node.data, root: true }} : node)}
}
