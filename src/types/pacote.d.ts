import { Result } from 'npm-package-arg'

declare module 'pacote' {
  interface PackumentOptions {}

  interface Info {
    'dist-tags': Record<string, string>,
  }
  export function packument(result: Result, options: PackumentOptions): Info
}
