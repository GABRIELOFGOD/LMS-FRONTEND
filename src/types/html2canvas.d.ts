/// <reference types="html2canvas" />
/// <reference types="jspdf" />

declare module 'html2canvas' {
  export default function html2canvas(
    element: HTMLElement,
    options?: Partial<{
      async: boolean;
      allowTaint: boolean;
      backgroundColor: string | null;
      canvas: HTMLCanvasElement | null;
      foreignObjectRendering: boolean;
      imageTimeout: number;
      ignoreElements: (element: Element) => boolean;
      logging: boolean;
      onclone: ((clonedDocument: Document, element: HTMLElement) => void) | null;
      proxy: string | null;
      removeContainer: boolean;
      scale: number;
      useCORS: boolean;
      width: number;
      height: number;
      x: number;
      y: number;
      scrollX: number;
      scrollY: number;
      windowWidth: number;
      windowHeight: number;
    }>
  ): Promise<HTMLCanvasElement>;
}
