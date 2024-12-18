// @ts-nocheck

const markup = document.getElementById("markup");
const style = document.getElementById("style");
const script = document.getElementById("script");
const editors = [markup, style, script];
const iframe = document.querySelector("iframe");
const labels = document.querySelectorAll("#editors label");

const getResult = ({ html, css, js }) => {
  return `
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
      ${html}
      <script>${js}</script>
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
