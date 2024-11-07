import { nanoid } from "nanoid";
import { Branch } from "./branch";

export class Node {
  public readonly text: string
  public readonly children: Branch[]
  public readonly index: string;
  private layer: number;

  public constructor(text: string, ...children: Branch[]) {
    this.text = text;
    this.children = children;
    this.index = nanoid();
    this.layer = 0;

    for (let branch of children) {
      if (branch.target.layer === 0) {
        branch.target.layer = this.layer + 1;
      }
    }
  }

  public addChildren(...children: Branch[]) {
    this.children.push(...children);
  }

  public isFinalAnswer(): boolean {
    return this.children.length === 0;
  }

  public getLayer() {
    return this.layer;
  }
}