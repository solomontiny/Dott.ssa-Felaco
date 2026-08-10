const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function addBlogSection() {
  const { data, error } = await supabase
    .from('homepage_content')
    .insert([
      {
        section_key: 'blog',
        content: {
          label: 'Articoli',
          title: 'Ultimi Articoli',
          cta: 'Vedi tutti gli articoli'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);
    
  if (error) {
    console.error('Error adding section:', error);
  } else {
    console.log('Successfully added blog section:', data);
  }
}

addBlogSection();
