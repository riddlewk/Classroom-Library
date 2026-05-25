flowchart LR
    subgraph Client[“Browser on iPad / Laptop”]
        UI[“React / Next.js UI\n(ISBN scan, CRUD, tags)”]
    end

    subgraph Supabase[“Supabase Project (Postgres + Services)”]
        DB[“Postgres DB\nbooks, tags, users”]
        Auth[“Supabase Auth\n(teacher login)”]
        Storage[“Supabase Storage\n(optional: covers, exports)”]
        RPC[“Edge Functions / RPC\n(auto-tag rules, secure ops)”]
        Rest[“PostgREST API\n(auto-generated CRUD)”]
    end

    subgraph External[“Public ISBN / Book APIs”]
        OpenLib[“Open Library API”]
        GoogleBooks[“Google Books API”]
    end

    UI <—>|supabase-js SDK\n(auth, CRUD, RLS-secured| Rest
    UI —>|fetch() HTTPS| OpenLib
    UI —>|fetch() HTTPS| GoogleBooks

    Rest —> DB
    Auth —> DB
    RPC —> DB
    UI —> RPC

    UI —> Storage
