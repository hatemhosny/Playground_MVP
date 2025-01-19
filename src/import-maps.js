// https://regexr.com/8a2j7
const importsPattern =
  /(import\s+?(?:(?:(?:[\w*\s{},\$]*)\s+from\s+?)|))((?:".*?")|(?:'.*?'))([\s]*?(?:;|$|))/g;

export const getImports = (code) =>
  [...code.matchAll(new RegExp(importsPattern))].map((arr) =>
    arr[2].replace(/"/g, "").replace(/'/g, "")
  );

export const createImportMap = (imps) => ({
  imports: imps.reduce(
    (acc, imp) => ({
      ...acc,
      [imp]: `https://esm.sh/${imp}`,
    }),
    {}
  ),
});

export const createImportMapScript = (importmap) => `
<script type="importmap">
${JSON.stringify(importmap, null, 2)}
</script>
`;

export const hasImports = (code) => getImports(code).length > 0;
