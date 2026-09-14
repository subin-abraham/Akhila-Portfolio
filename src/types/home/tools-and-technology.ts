export interface ToolsAndTechnologyItem {
  id: string;
  name: string;
  sortOrder: number;
}

export interface ToolsAndTechnologyCategory {
  category: string;
  items: ToolsAndTechnologyItem[];
}
