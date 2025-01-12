// @ts-nocheck

//#region UI
const markup = document.getElementById("markup");
const style = document.getElementById("style");
const script = document.getElementById("script");
const editors = [markup, style, script];
const iframe = document.querySelector("iframe");
const labels = document.querySelectorAll("#editors label");
const menus = document.querySelectorAll("#editors select");

labels.forEach((label) => {
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

//#endregion

//#region import maps
// https://regexr.com/8a2j7
const importsPattern =
  /(import\s+?(?:(?:(?:[\w*\s{},\$]*)\s+from\s+?)|))((?:".*?")|(?:'.*?'))([\s]*?(?:;|$|))/g;

const getImports = (code) =>
  [...code.matchAll(new RegExp(importsPattern))].map((arr) =>
    arr[2].replace(/"/g, "").replace(/'/g, "")
  );

const createImportMap = (imps) => ({
  imports: imps.reduce(
    (acc, imp) => ({
      ...acc,
      [imp]: `https://esm.sh/${imp}`,
    }),
    {}
  ),
});

const createImportMapScript = (importmap) => `
<script type="importmap">
${JSON.stringify(importmap, null, 2)}
</script>
`;

const hasImports = (code) => getImports(code).length > 0;

//#endregion

// name, title, longTitle, editorId, compile
const languages = [
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
      const marked = await import("https://esm.sh/marked");
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
      const sass = await import("https://esm.sh/sass");
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
      const ts = await import("https://esm.sh/typescript");
      return (code) => ts.transpile(code);
    },
  },
];

const compilers = {};

const getCompiler = async (language) => {
  if (!compilers[language]) {
    compilers[language] = await languages
      .find((l) => l.name === language)
      .compiler();
  }
  return compilers[language];
};

const compile = async (language, code) => {
  const compiler = await getCompiler(language);
  return compiler(code);
};

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
    html: await compile(getEditorLanguage("markup"), markup.value),
    css: await compile(getEditorLanguage("style"), style.value),
    js: await compile(getEditorLanguage("script"), script.value),
  });

  // TODO: Change This
  // big security issue
  iframe.srcdoc = resultHTML;
};

const start = () => {
  loadMenus();

  editors.forEach((editor) => {
    editor.addEventListener("input", run);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      run();
    }
  });
};

start();
