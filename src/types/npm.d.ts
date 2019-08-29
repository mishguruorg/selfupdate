declare module 'npm' {
  interface LoadOptions {
    loglevel?: string,
    global?: boolean,
  }
  export function load(
    options: LoadOptions,
    callback: (error: Error) => void,
  ): void
}
