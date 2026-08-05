import { useCallback, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useHomepage() {
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);

  const fetchSections = useCallback(async (language = 'it') => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .eq('language', language)
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSections(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching homepage sections:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllSections = useCallback(async (language = 'it') => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .eq('language', language)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching all homepage sections:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSection = useCallback(async (id, payload) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .update({
          ...payload,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating homepage section:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSection = useCallback(async (payload) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .insert({
          ...payload,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating homepage section:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSection = useCallback(async (id) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('homepage_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting homepage section:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const reorderSections = useCallback(async (reorderedSections) => {
    setLoading(true);
    try {
      const updates = reorderedSections.map((section, index) => ({
        id: section.id,
        order_index: (index + 1) * 10,
        updated_at: new Date().toISOString()
      }));

      // Supabase doesn't support bulk update with different values easily in one call via JS client
      // so we do it in a loop or use a RPC if available. For now, a loop is fine for ~15 sections.
      for (const update of updates) {
        await supabase
          .from('homepage_content')
          .update({ order_index: update.order_index })
          .eq('id', update.id);
      }
      
      return true;
    } catch (error) {
      console.error('Error reordering homepage sections:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    sections,
    fetchSections,
    fetchAllSections,
    updateSection,
    createSection,
    deleteSection,
    reorderSections
  };
}
