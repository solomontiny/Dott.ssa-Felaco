const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function checkSchema() {
  const { data, error } = await supabase
    .from('homepage_content')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching schema:', error);
  } else {
    console.log('Sample data:', JSON.stringify(data, null, 2));
  }
}

checkSchema();
