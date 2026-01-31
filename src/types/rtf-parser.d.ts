declare module "rtf-parser" {
  export function parse(cb: (err: Error | null, doc: { content: unknown[] }) => void): NodeJS.WritableStream;
  export namespace parse {
    function string(str: string, cb: (err: Error | null, doc: { content: unknown[] }) => void): void;
  }
}
