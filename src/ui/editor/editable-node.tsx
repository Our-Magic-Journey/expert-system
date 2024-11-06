import { ChangeEventHandler, memo, useEffect, useRef, useState } from 'react';
import { Handle, NodeProps, Position, useEdges, useReactFlow } from '@xyflow/react';

type Props = {
  data: { label: string, edit: boolean },
  isConnectable?: boolean,
} & NodeProps

export const EditableNode = memo(({ id, data, isConnectable }: Props) => {
  const { setNodes } = useReactFlow();
  const [editMode, setEditMode] = useState(data.edit);
  const inputRef = useRef<HTMLInputElement>();

  const updateData: ChangeEventHandler<HTMLInputElement> = (e) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: e.target?.value ?? data.label
            }
          };
        }

        return node;
      })
    );
  };

  const handleDBClick = () => {
    setEditMode(editMode => !editMode);
  }

  const focus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  return (
    <div className='w-full h-full p-2' onClick={focus} onDoubleClick={handleDBClick}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />

      {editMode && (
        <input 
          type='text'
          ref={inputRef}
          value={data.label} 
          onChange={updateData}
          className='bg-transparent w-full px-1 text-white border border-yellow-400 focus:border-yellow-400' />
      )}

      {(!editMode && (
        <div>
          {data.label} 
        </div>
      ))}

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
});