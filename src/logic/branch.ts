import { Node } from "./node"

export class Branch {
    constructor(
        public readonly text: string,
        public readonly target: Node
    ) {}
}