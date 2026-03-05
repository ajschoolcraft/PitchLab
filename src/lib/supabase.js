import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://meurhqiyqsyfydvgxddj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ldXJocWl5cXN5Znlkdmd4ZGRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NjE1MzQsImV4cCI6MjA4NTEzNzUzNH0.IbWoVV3EMOwrL5rN3QvKdqr1VRXeQrIsQsQqwNFITzg'

export const supabase = createClient(supabaseUrl, supabaseKey)