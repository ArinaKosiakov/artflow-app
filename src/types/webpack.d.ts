/**
 * Webpack-specific require.context (not in Node types).
 */
declare global {
  interface NodeRequire {
    context(
      directory: string,
      useSubdirectories?: boolean,
      regExp?: RegExp,
      mode?: "sync" | "eager" | "weak" | "lazy"
    ): {
      keys(): string[];
      <T = string>(id: string): T;
    };
  }
}

export {};
