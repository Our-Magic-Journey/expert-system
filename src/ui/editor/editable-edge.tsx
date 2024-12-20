import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSimpleBezierPath, useReactFlow } from '@xyflow/react';
import { ChangeEventHandler, KeyboardEventHandler, useState } from 'react';
import reactToText from 'react-to-text';
 
type Props = {
} & EdgeProps

function getPath(sourceX: number, sourceY: number, targetX: number, targetY: number, source: string, target: string ) {
  if (source !== target) {
    return getSimpleBezierPath({ sourceX, sourceY, targetX, targetY });
  }

  const width = 70;
  const edgePath = `
    M ${targetX} ${Math.min(sourceY, targetY)}
    q 0 -10 10 -10 
    l ${width} 0         
    q 10 0 10 10   
    l 0 ${Math.abs(sourceY - targetY)}         
    q 0 10 -10 10  
    l ${-width} 0        
    q -10 0 -10 -10
    l 0 -10
  `;
  const labelX = sourceX + 45;
  const labelY = sourceY + 10;

  return [edgePath, labelX, labelY] as const;
}

export function EditableEdge({ id, sourceX, sourceY, targetX, targetY, label, source, target }: Props) {
  const [editMode, setEditMode] = useState(false);
  const { setEdges } = useReactFlow();

  const [edgePath, labelX, labelY] = getPath(sourceX, sourceY, targetX, targetY, source, target);

  const updateData: ChangeEventHandler<HTMLInputElement> = (e) => {
    setEdges((edges) =>
      edges.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            label: e.target?.value ?? reactToText(label)
          };
        }

        return edge;
      })
    );
  };
 
  const handleDBClick = () => {
    setEditMode(editMode => !editMode);
  }

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      setEditMode(false);
      e.stopPropagation();
    }
  }

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        { editMode && (
          <input 
            type='text'
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`, pointerEvents: 'all' }}
            value={reactToText(label)} 
            onChange={updateData}
            onDoubleClick={handleDBClick}
            onKeyUp={handleKeyUp}
            className='absolute text-2xs bg-transparent w-20 px-1 text-white border border-yellow-400 focus:border-yellow-400 z-20' 
          />
        )}

        {!editMode && (
          <div
            className='absolute text-white text-2xs w-28 text-center'
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`, pointerEvents: 'all' }}
            onDoubleClick={handleDBClick}
          >
            {label}
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
}
