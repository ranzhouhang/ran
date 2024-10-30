import type { LINE_CAP, LINE_JOIN, RendererType } from '@/utils/visual/enums';

export interface IApplicationOptions {
  prefer?: RendererType.Canvas | RendererType.WebGl | RendererType.WEB_GPU; // 优先使用哪种 renderer
  view: HTMLCanvasElement;
  backgroundColor?: string;
  backgroundAlpha?: number;
}

export interface IFillStyleOptions {
  color?: string;
  alpha?: number;
  visible?: boolean;
}

export interface ILineStyleOptions extends IFillStyleOptions {
  width?: number;
  cap?: LINE_CAP;
  join?: LINE_JOIN;
}
