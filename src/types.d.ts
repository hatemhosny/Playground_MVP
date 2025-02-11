export interface Language {
  name: "html" | "markdown" | "css" | "scss" | "javascript" | "typescript";
  title: string;
  longTitle: string;
  editorId: "markup" | "style" | "script";
  compiler: () => Promise<(code: string) => string>;
}

export interface CodeEditor {
  getValue: () => any;
  setValue: (value: any) => any;
  getLanguage: () => any;
  setLanguage: (language: any) => void;
  onChange: (callback: any) => any;
}

export interface EditorOptions {
  container: HTMLElement;
  language: string;
  value: string;
}
