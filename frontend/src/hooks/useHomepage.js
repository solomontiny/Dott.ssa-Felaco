import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useHomepage() {
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*');

      if (error) throw error;
      
      let sections = data || [];
      if (!sections.find(s => s.section_key === 'blog')) {
        sections.push({
          id: 'temp-blog',
          section_key: 'blog',
          content: {
            label: 'Articoli',
            title: 'Ultimi Articoli',
            cta: 'Vedi tutti gli articoli'
          }
        });
      }
      if (!sections.find(s => s.section_key === 'services')) {
        sections.push({
          id: 'temp-services',
          section_key: 'services',
          content: {
            label: 'SERVIZI',
            title: 'Cosa trovi qui',
            subtitle: 'Benessere Bio-Psico-Sociale'
          }
        });
      }
      setSections(sections);
      return data;
    } catch (error) {
      console.error('Error fetching homepage sections:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: error,
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllSections = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*');

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
      console.error('Error updating homepage section:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: error,
      });
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
      console.error('Error creating homepage section:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: error,
      });
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
      console.error('Error deleting homepage section:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: error,
      });
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
    deleteSection
  };
}
