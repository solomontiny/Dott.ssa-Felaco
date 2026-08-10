const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkHomepageContent() {
  const { data, error } = await supabase
    .from('homepage_content')
    .select('*');
    
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Homepage Content:', JSON.stringify(data, null, 2));
  }
}

checkHomepageContent();
