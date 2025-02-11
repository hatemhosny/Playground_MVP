const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

/**
 * @param {import('./types').EditorOptions} editorOptions
 * @returns {Promise<import('./types').CodeEditor>}
 */
export const createEditor = async (editorOptions) => {
  if (isMobile()) {
    const codemirrorModule = await import("./codemirror.js");
    return codemirrorModule.createCodeMirrorEditor(editorOptions);
  } else {
    const monacoModule = await import("./monaco.js");
    return monacoModule.createMonacoEditor(editorOptions);
  }
};
