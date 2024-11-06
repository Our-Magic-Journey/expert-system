import { RelationType } from "react-archer/lib/types";
import { ArcherElement } from 'react-archer';
import { UnpackedBranch, UnpackedTree } from "../../logic/unpacked";
import { useMemo } from "react";
import { clsx } from "clsx";


type Props = {
  selected: string,
  nodeKey: string,
  tree: UnpackedTree
  onSelect: (selected: string) => void,
}

function makeRelation(tree: UnpackedTree): (branch: UnpackedBranch) => RelationType {
  return (branch) => ({
    targetId: branch.target,
    targetAnchor: 'top',
    sourceAnchor: 'bottom',
    label: branch.text,
    className: "text-white text-sm"
  })
}

export const Tree = ({ selected, tree, nodeKey, onSelect }: Props) => {
  let node = useMemo(() => tree.nodes[nodeKey], [tree.nodes, nodeKey]);
  let branches = useMemo(() => node.branches.flatMap(id => tree.branches[id]), [node, tree.branches, nodeKey]);

  return (
    <div className="flex flex-col w-full h-full items-center gap-52 min-w-52 min-h-52">
      <div 
        className={clsx("border text-white text-center p-2 z-10 bg-black cursor-pointer translate", selected === nodeKey ? "border-blue-300" : "border-yellow-400")}
        onClick={() => onSelect(nodeKey)}
      >
        <ArcherElement id={nodeKey} relations={branches.map(makeRelation(tree))}>
          <div>
            { node.text }
          </div>
        </ArcherElement>
      </div>

      { branches.length > 0 && (
        <div className="w-full flex gap-2">
          {branches.map(branch => (
            <Tree 
              key={branch.target} 
              nodeKey={branch.target} 
              onSelect={onSelect} 
              selected={selected} 
              tree={tree} 
            />
          ))}
      </div>
      )}
    </div> 
  );
}