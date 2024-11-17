import { nanoid } from "nanoid";
import { Branch } from "./branch";

export class Node {
  public readonly text: string
  public readonly children: Branch[]
  public readonly index: string;

  public constructor(text: string, ...children: Branch[]) {
    this.text = text;
    this.children = children;
    this.index = nanoid();
  }

  public addChildren(...children: Branch[]) {
    this.children.push(...children);
  }
}
