// @ts-nocheck

import { createEditor } from "./editor.js";
import { languages } from "./languages.js";
import {
  createImportMapScript,
  hasImports,
  createImportMap,
  getImports,
} from "./import-maps.js";
import { compile } from "./compiler.js";

//#region UI
const markupContainer = document.getElementById("markup");
const styleContainer = document.getElementById("style");
const scriptContainer = document.getElementById("script");
let markupEditor;
let styleEditor;
let scriptEditor;
let editors;
const iframe = document.querySelector("iframe");
const labels = document.querySelectorAll("#editors label");
const menus = document.querySelectorAll("#editors select");

labels.forEach((label) => {
  label.parentElement.addEventListener("click", () => {
    document.querySelectorAll(".editor").forEach((ed) => {
      ed.classList.remove("active");
    });
    label.parentElement.classList.add("active");
  });

  label.addEventListener("dblclick", () => {
    if (label.parentElement.style.flex.startsWith("15")) {
      label.parentElement.style.flex = "1";
    } else {
      labels.forEach((lb) => {
        lb.parentElement.style.flex = "1";
      });
      label.parentElement.style.flex = "15";
    }
  });
});

const getEditorLanguage = (editorId) =>
  [...menus].find((menu) => menu.dataset.editorid === editorId).value;

const loadMenus = () => {
  menus.forEach((menu) => {
    languages
      .filter((language) => language.editorId === menu.dataset.editorid)
      .forEach((language, index) => {
        const option = document.createElement("option");
        option.value = language.name;
        option.textContent = language.longTitle;
        option.selected = index === 0;
        menu.appendChild(option);
      });

    const showSelected = () => {
      const selected = languages.find(
        (language) => language.name === menu.value
      );
      menu.parentElement.querySelector("span").textContent = selected.title;
    };

    showSelected();
    menu.addEventListener("change", () => {
      showSelected();
      run();
      const editorId = menu.dataset.editorid;
      const language = getEditorLanguage(editorId);
      editors[editorId]?.setLanguage(language);
    });
  });
};

const getResult = ({ html, css, js }) => {
  const importmapScript = hasImports(js)
    ? createImportMapScript(createImportMap(getImports(js)))
    : "";

  const scriptType = hasImports(js) ? "module" : "text/javascript";

  return `
    <html>
      <head>
        <style>${css}</style>
        ${importmapScript}
      </head>
      <body>
      ${html}
      <script type="${scriptType}">${js}</script>
      </body>
    </html>
  `;
};

const run = async () => {
  const resultHTML = getResult({
    html: await compile(getEditorLanguage("markup"), markupEditor.getValue()),
    css: await compile(getEditorLanguage("style"), styleEditor.getValue()),
    js: await compile(getEditorLanguage("script"), scriptEditor.getValue()),
  });

  // TODO: Change This
  // big security issue
  iframe.srcdoc = resultHTML;
};

const createEditors = async () => {
  markupEditor = await createEditor({
    container: markupContainer,
    language: "html",
    value: "",
  });
  styleEditor = await createEditor({
    container: styleContainer,
    language: "css",
    value: "",
  });
  scriptEditor = await createEditor({
    container: scriptContainer,
    language: "javascript",
    value: "",
  });
  editors = { markup: markupEditor, style: styleEditor, script: scriptEditor };
  Object.values(editors).forEach((editor) => {
    editor.onChange(run);
  });
};

const start = async () => {
  loadMenus();
  await createEditors();

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      run();
    }
  });
};

start();
