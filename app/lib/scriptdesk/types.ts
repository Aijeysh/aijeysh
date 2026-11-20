export const ELEMENT_TYPES = [
  "scene",
  "action",
  "character",
  "parenthetical",
  "dialogue",
  "transition",
] as const;

export type ElementType = (typeof ELEMENT_TYPES)[number];

export const TYPE_LABELS: Record<ElementType, string> = {
  scene: "Scene heading",
  action: "Action",
  character: "Character",
  parenthetical: "Parenthetical",
  dialogue: "Dialogue",
  transition: "Transition",
};

export interface ScriptElement {
  id: string;
  type: ElementType;
  text: string;
}

export interface Script {
  id: string;
  title: string;
  author: string;
  elements: ScriptElement[];
  createdAt: string;
  updatedAt: string;
}

export type ScriptSummary = Pick<Script, "id" | "title" | "author" | "updatedAt">;
