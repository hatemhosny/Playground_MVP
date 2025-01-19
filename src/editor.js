const monacoUrl =
  "https://cdn.jsdelivr.net/npm/@live-codes/monaco-editor/monaco.js";

export const createEditor = async (editorOptions) => {
  const { monaco } = await import(monacoUrl);
  const { container, language, value } = editorOptions;

  const baseOptions = {
    theme: "vs-dark",
    lineNumbers: "on",
    minimap: { enabled: false },
    automaticLayout: true,
    scrollBeyondLastLine: false,
  };

  const editor = monaco.editor.create(container, {
    ...baseOptions,
    language,
    value,
  });

  const getValue = () => editor.getValue();

  const setValue = (value) => editor.setValue(value);

  const getLanguage = () => editor.getModel().getLanguageId();

  const setLanguage = (language) => {
    monaco.editor.setModelLanguage(editor.getModel(), language);
  };

  const onChange = (callback) => editor.onDidChangeModelContent(callback);

  return {
    getValue,
    setValue,
    getLanguage,
    setLanguage,
    onChange,
  };
};
