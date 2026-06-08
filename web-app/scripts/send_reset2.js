const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
(async () => {
  const email = 'riddlewk@gmail.com';
  console.log('Sending reset to', email);
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: process.env.NEXT_PUBLIC_APP_URL + '/reset-password' });
  if (error) { console.error('ERROR', error); process.exit(2); }
  console.log('SENT', data);
})();
