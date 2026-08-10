const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function checkRows() {
  const { data, error } = await supabase
    .from('homepage_content')
    .select('section_key');
    
  if (error) {
    console.error('Error fetching data:', error);
  } else {
    console.log('Existing section keys:', data.map(d => d.section_key));
  }
}

checkRows();
