import html2canvas from "html2canvas";

export const GUI_HELPER = {
  captureElement: async (selector: string): Promise<string | null> => {
    const el = document.querySelector(selector) as HTMLElement | null;

    if (!el) {
      return null;
    }

    try {
      const canvas = await html2canvas(el, {
        useCORS: true,
        backgroundColor: null,
        scale: window.devicePixelRatio,
      });

      return canvas.toDataURL("image/png");
    } catch (err) {
      return null;
    }
  },
} as const;

/**
 * 
 * @param e 
 * @param element 
 * @returns 
 */
export const getRelativeMousePositionByEvent = (e: MouseEvent, element: HTMLElement) => {
  return getRelativeMousePositionByClient(e.clientX, e.clientY, element)
}

/**
 * 
 * @param e 
 * @param element 
 * @returns 
 */
export const getRelativeMousePositionByClient = (clientX: number, clientY: number, element: HTMLElement) => {
  const rect = element.getBoundingClientRect();

  // GUI coordinate (đã tính scale, transform)
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  // Real scale
  const scaleX = rect.width / element.offsetWidth;
  const scaleY = rect.height / element.offsetHeight;

  // Normalize to root coordinate (before transform, scroll)
  const logicalX = x / scaleX + element.scrollLeft;
  const logicalY = y / scaleY + element.scrollTop;

  return { x: logicalX, y: logicalY };
}