
export interface ChecklistItem {
  id: string;
  checklist_id: string;
  rule_name: string;
  requirement: string;
  is_verified: boolean;
  notes?: string;
  verified_by?: string;
  verified_at?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}

export interface ProjectChecklist {
  id: string;
  project_id: string;
  checklist_type: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  items?: ChecklistItem[];
}

export interface ChecklistUpdateData {
  is_verified: boolean;
  notes?: string;
  verified_by?: string;
  verified_at?: string;
}
