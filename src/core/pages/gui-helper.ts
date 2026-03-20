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
