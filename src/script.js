// @ts-nocheck

const markup = document.getElementById("markup");
const style = document.getElementById("style");
const script = document.getElementById("script");
const editors = [markup, style, script];
const iframe = document.querySelector("iframe");
const labels = document.querySelectorAll("#editors label");

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

editors.forEach((editor) => {
  editor.addEventListener("input", () => {
    const resultHTML = getResult({
      html: markup.value,
      css: style.value,
      js: script.value,
    });

    // TODO: Change This
    // big security issue
    iframe.srcdoc = resultHTML;
  });
});

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
