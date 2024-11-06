import { MarkerType } from "@xyflow/react";
import { Node } from "./node";

export type FlowEdge = { id: string, type?: string, source: string, target: string, label: string, markerEnd: { type: MarkerType } };
export type FlowNode = { id: string, type?: string, data: { label: string }, position: { x: number, y: number }, measured?: { width: number, height: number } };

export function packTree(edges: FlowEdge[], nodes: FlowNode[]): Node {
  throw "unimplemented";
}

export function unpackTree(node: Node): { edges: FlowEdge[], nodes: FlowNode[] } {
  let edges: FlowEdge[] = [];
  let nodes: FlowNode[] = [];

  nodes.push({ 
    id: node.index,
    data: { label: node.text },
    position: { x: 0, y: 0 },
    type: 'editableNode',
  })

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

  return { edges, nodes };
}