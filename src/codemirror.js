import { basicSetup, EditorView } from "codemirror";
import { Compartment } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";

const languageUrls = {
  html: "@codemirror/lang-html",
  markdown: "@codemirror/lang-markdown",
  css: "@codemirror/lang-css",
  scss: "@codemirror/lang-scss",
  javascript: "@codemirror/lang-javascript",
};

const editorLanguages = {
  html: async () => (await import(languageUrls.html)).html(),
  markdown: async () => (await import(languageUrls.markdown)).markdown(),
  css: async () => (await import(languageUrls.css)).css(),
  scss: async () => (await import(languageUrls.scss)).sass(),
  javascript: async () => (await import(languageUrls.javascript)).javascript(),
  typescript: async () =>
    (await import(languageUrls.javascript)).javascript({ typescript: true }),
};

/**
 * @param {import('./types').EditorOptions} editorOptions
 * @returns {Promise<import('./types').CodeEditor>}
 */
export const createCodeMirrorEditor = async (editorOptions) => {
  const { container, value } = editorOptions;
  let language = editorOptions.language;

  const listeners = [];
  const notifyListeners = (update) => {
    if (update.docChanged) {
      listeners.forEach((fn) => fn(update));
    }
  };

  const getLanguageSupport = async (lang) =>
    editorLanguages[lang]?.() || editorLanguages.html?.();

  let languageSupport = await getLanguageSupport(language);
  const languageExtension = new Compartment();

  const view = new EditorView({
    doc: value,
    extensions: [
      basicSetup,
      languageExtension.of(languageSupport),
      EditorView.updateListener.of(notifyListeners),
      oneDark,
    ],
    parent: container,
  });

  const getValue = () => view.state.doc.toString();
  const setValue = (value = "") => {
    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: value,
      },
    });
  };

  const getLanguage = () => language;
  const setLanguage = (lang) => {
    language = lang;
    getLanguageSupport(language).then((langSupport) => {
      languageSupport = langSupport;
      view.dispatch({
        effects: [languageExtension.reconfigure(languageSupport)],
      });
    });
  };

  const onChange = (fn) => {
    listeners.push(fn);
  };

  return {
    getValue,
    setValue,
    getLanguage,
    setLanguage,
    onChange,
  };
};
