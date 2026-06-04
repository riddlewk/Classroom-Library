Seeding demo data

This repository includes web-app/scripts/seed.js to insert demo books for a given existing user.

Usage:
1. Create a demo user in Supabase dashboard: Authentication → Users → Invite user or create user.
2. Copy the user's id from the Users list.
3. Run the seed script locally (do NOT commit your service role key):

   SUPABASE_URL="https://your-project.supabase.co" \
   SUPABASE_SERVICE_ROLE_KEY="<SERVICE_ROLE_KEY>" \
   OWNER_USER_ID="<USER_ID>" \
   node scripts/seed.js

Notes:
- The script uses the Supabase service role key to bypass RLS for seeding. Keep this key secret.
- Alternatively, you can insert demo rows via the Supabase SQL editor using the following example:

INSERT INTO books (title, authors, isbn, cover_url, status, owner_user_id) VALUES
('Charlotte''s Web', ARRAY['E. B. White'], '9780064400558', NULL, 'available', '<USER_ID>');
