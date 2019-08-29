declare module 'cacache' {
  interface CacheObject {
    data: Buffer,
  }

  export function put(
    cachePath: string,
    key: string,
    data: any,
  ): Promise<string>
  export function get(cachePath: string, key: string): Promise<CacheObject>
}
