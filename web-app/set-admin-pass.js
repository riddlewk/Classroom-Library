import
 { createClient } 
from
 
"@supabase/supabase-js"
;
const
 SUPABASE_URL = process.env.SUPABASE_URL;
const
 SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const
 EMAIL = 
"riddlewk@gmail.com"
;
const
 NEW_PASSWORD = process.env.NEW_PASSWORD;
if
 (!SUPABASE_URL) 
throw
 
new
 
Error
(
"Missing SUPABASE_URL"
);
if
 (!SUPABASE_SERVICE_ROLE_KEY) 
throw
 
new
 
Error
(
"Missing SUPABASE_SERVICE_ROLE_KEY"
);
if
 (!NEW_PASSWORD) 
throw
 
new
 
Error
(
"Missing NEW_PASSWORD"
);
const
 supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const
 { 
data
: user, 
error
: userErr } = 
await
 supabase.auth.admin.getUserByEmail(EMAIL);
if
 (userErr) 
throw
 userErr;
const
 { 
error
: updateErr } = 
await
 supabase.auth.admin.updateUserById(user.id, {
  
password
: NEW_PASSWORD,
});
if
 (updateErr) 
throw
 updateErr;
console
.log(
"✅ Password updated for:"
, user.id);