##Supabase:
    DB Password: VibecodingRef!2026
    Project URL: https://nhvjjlejsbtbcdlqfpcv.supabase.co
    Publishable API Key: sb_publishable_S4wPt3d8aR5KS8J67nw9WA_fyJSChY8
    DB URL: postgresql://postgres:VibecodingRef!2026@db.nhvjjlejsbtbcdlqfpcv.supabase.co:5432/postgres


# Connect to Supabase via connection pooling
DATABASE_URL=postgresql://postgres.nhvjjlejsbtbcdlqfpcv:VibecodingRef!2026@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Direct connection to the database. Used for migrations
DIRECT_URL=postgresql://postgres.nhvjjlejsbtbcdlqfpcv:VibecodingRef!2026@aws-1-eu-west-1.pooler.supabase.com:5432/postgres


###Prisma
    Schema:
            generator client {
            provider = "prisma-client-js"
            }

            datasource db {
            provider  = "postgresql"
            url       = env("DATABASE_URL")
            directUrl = env("DIRECT_URL")
            }


###Resend
    API Key: re_eRPbf8jy_DgrhNEy9qn1D4DoeQX4uf1QL




