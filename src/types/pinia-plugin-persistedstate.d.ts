import 'pinia'

declare module 'pinia' {
  export interface DefineStoreOptions<S, G, A, P> {
    persist?: boolean | { key?: string; paths?: (keyof S)[] }
  }
}
