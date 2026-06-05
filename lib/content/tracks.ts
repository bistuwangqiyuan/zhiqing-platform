// The model data (lib/data.ts) carries Chinese canonical track names. This maps
// them to English for display; Chinese is returned unchanged.
export const TRACK_NAME_EN: Record<string, string> = {
  "AI 应用与数据服务": "AI Applications & Data Services",
  "企业软件与自动化": "Enterprise Software & Automation",
  "先进制造": "Advanced Manufacturing",
  "绿色低碳与能源材料": "Green & Energy Materials",
  "医疗健康与器械": "Healthcare & Devices"
};

export function localizeTrack(name: string, locale: string): string {
  return locale === "en" ? TRACK_NAME_EN[name] ?? name : name;
}
