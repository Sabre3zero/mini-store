import type { Config } from "stylelint";
const config: Config = {
  extends: ["stylelint-config-standard"],
  ignoreFiles: ["**/node_modules/**", "**/dist/**"],
  rules: { "selector-class-pattern": null },
};

export default config;
