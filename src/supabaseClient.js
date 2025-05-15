import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wtdmudjsdlpscziphfku.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0ZG11ZGpzZGxwc2N6aXBoZmt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NzA4OTQsImV4cCI6MjA1OTE0Njg5NH0.7_mCcGMuU71R2jElPcCok1TRBNNhCyO9rSFBLmja78M'; 

export const supabase = createClient(supabaseUrl, supabaseKey);