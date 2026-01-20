/// <reference types="vite/client" />
/// <reference path="./types/electron.d.ts" />

declare module '*.css' {
  const content: string;
  export default content;
}
