export default interface ISVGOResult {
  data: string;
  info: {
    width: number;
    height: number;
    colors?: {
      fills?: string[];
      strokes?: string[];
    };
  };
}
