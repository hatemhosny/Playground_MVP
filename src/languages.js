const markedUrl = "https://esm.sh/marked";
const sassUrl = "https://esm.sh/sass";
const typescriptUrl = "https://esm.sh/typescript";

/**
 * @type {import("./types").Language[]}
 */
export const languages = [
  {
    name: "html",
    title: "HTML",
    longTitle: "HTML",
    editorId: "markup",
    compiler: async () => (code) => code,
  },
  {
    name: "markdown",
    title: "MD",
    longTitle: "Markdown",
    editorId: "markup",
    compiler: async () => {
      const marked = await import(markedUrl);
      return (code) => marked.parse(code);
    },
  },
  {
    name: "css",
    title: "CSS",
    longTitle: "CSS",
    editorId: "style",
    compiler: async () => (code) => code,
  },
  {
    name: "scss",
    title: "SCSS",
    longTitle: "SCSS",
    editorId: "style",
    compiler: async () => {
      const sass = await import(sassUrl);
      return (code) => sass.compileString(code).css;
    },
  },
  {
    name: "javascript",
    title: "JS",
    longTitle: "JavaScript",
    editorId: "script",
    compiler: async () => (code) => code,
  },
  {
    name: "typescript",
    title: "TS",
    longTitle: "TypeScript",
    editorId: "script",
    compiler: async () => {
      const ts = await import(typescriptUrl);
      return (code) => ts.transpile(code);
    },
  },
];
