import { languages } from "./languages.js";

const compilers = {};

const getCompiler = async (language) => {
  if (!compilers[language]) {
    compilers[language] = await languages
      ?.find((l) => l.name === language)
      ?.compiler();
  }
  return compilers[language];
};

export const compile = async (language, code) => {
  const compiler = await getCompiler(language);
  return compiler(code);
};
