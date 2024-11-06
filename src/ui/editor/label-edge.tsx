import { BaseEdge, EdgeLabelRenderer, getStraightPath, useReactFlow } from '@xyflow/react';
 
export function LabelEdge({ id, sourceX, sourceY, targetX, targetY }) {
  const { setEdges } = useReactFlow();
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
 
  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <div></div>
      </EdgeLabelRenderer>
    </>
  );
}