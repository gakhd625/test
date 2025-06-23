import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pwcsbrwhnafbggjfvttg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3Y3NicndobmFmYmdnamZ2dHRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NjA3MDksImV4cCI6MjA2NjIzNjcwOX0.EJ7U-StMFGz3YwDJqZPuxZoYYNYXonCmWigZpOcYNjA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


