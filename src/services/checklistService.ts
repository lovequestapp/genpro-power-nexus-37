
import { supabase } from '@/lib/supabase';
import type { ProjectChecklist, ChecklistItem, ChecklistUpdateData } from '@/types/checklist';

export const checklistService = {
  // Get checklist for a project
  async getProjectChecklist(projectId: string): Promise<ProjectChecklist | null> {
    try {
      const { data: checklist, error: checklistError } = await supabase
        .from('project_checklists')
        .select('*')
        .eq('project_id', projectId)
        .eq('checklist_type', 'generator_placement')
        .single();

      if (checklistError) {
        if (checklistError.code === 'PGRST116') {
          // No checklist found, create one
          return await this.createProjectChecklist(projectId);
        }
        throw checklistError;
      }

      // Get checklist items
      const { data: items, error: itemsError } = await supabase
        .from('checklist_items')
        .select('*')
        .eq('checklist_id', checklist.id)
        .order('order_index');

      if (itemsError) throw itemsError;

      return {
        ...checklist,
        items: items || []
      };
    } catch (error) {
      console.error('Error fetching project checklist:', error);
      throw error;
    }
  },

  // Create a new checklist for a project
  async createProjectChecklist(projectId: string): Promise<ProjectChecklist> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Create checklist
      const { data: checklist, error: checklistError } = await supabase
        .from('project_checklists')
        .insert({
          project_id: projectId,
          checklist_type: 'generator_placement',
          created_by: user?.id
        })
        .select()
        .single();

      if (checklistError) throw checklistError;

      // Create default checklist items
      const defaultItems = [
        { rule_name: 'Distance from House', requirement: 'Minimum 18 inches', order_index: 1 },
        { rule_name: 'Front & Side Clearance', requirement: '3 feet (all open/maintenance sides)', order_index: 2 },
        { rule_name: 'Window/Door Clearance', requirement: '5 feet from operable windows or doors', order_index: 3 },
        { rule_name: 'Top Clearance', requirement: 'No overhangs, decks, or coverings', order_index: 4 },
        { rule_name: 'Gas Meter Clearance', requirement: 'At least 3 feet away', order_index: 5 },
        { rule_name: 'AC or Pool Equipment Clearance', requirement: 'At least 3 feet away', order_index: 6 },
        { rule_name: 'Property Line Setback', requirement: 'Min 3-5 feet, confirm with city code', order_index: 7 },
        { rule_name: 'Noise Ordinance', requirement: 'Typically <70 dBA at property line', order_index: 8 },
        { rule_name: 'Concrete/Composite Pad', requirement: 'Level and per manufacturer specs', order_index: 9 },
        { rule_name: 'Accessible for Maintenance', requirement: 'Clear access required on service panel side', order_index: 10 },
        { rule_name: 'Not in Easement Area', requirement: 'Verify using recorded plat or survey', order_index: 11 },
        { rule_name: 'Drainage', requirement: 'Do not block or sit in water flow paths', order_index: 12 },
        { rule_name: 'Not in Front Yard (if restricted)', requirement: 'Many cities prohibit this — check local ordinance', order_index: 13 },
        { rule_name: 'Fence/Shrub Screening', requirement: 'Required by some HOAs or city codes for visual impact', order_index: 14 }
      ];

      const itemsToInsert = defaultItems.map(item => ({
        ...item,
        checklist_id: checklist.id
      }));

      const { data: items, error: itemsError } = await supabase
        .from('checklist_items')
        .insert(itemsToInsert)
        .select();

      if (itemsError) throw itemsError;

      return {
        ...checklist,
        items: items || []
      };
    } catch (error) {
      console.error('Error creating project checklist:', error);
      throw error;
    }
  },

  // Update a checklist item
  async updateChecklistItem(itemId: string, updateData: ChecklistUpdateData): Promise<ChecklistItem> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const updatePayload = {
        ...updateData,
        updated_by: user?.id,
        verified_by: updateData.is_verified ? user?.id : null,
        verified_at: updateData.is_verified ? new Date().toISOString() : null
      };

      const { data, error } = await supabase
        .from('checklist_items')
        .update(updatePayload)
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating checklist item:', error);
      throw error;
    }
  },

  // Get checklist completion percentage
  getCompletionPercentage(items: ChecklistItem[]): number {
    if (!items || items.length === 0) return 0;
    const completedItems = items.filter(item => item.is_verified).length;
    return Math.round((completedItems / items.length) * 100);
  }
};
