
/**
 * This file documents the database functions available in Supabase
 * 
 * NOTE: This file is for documentation only and doesn't affect the actual database functions.
 * You must create these functions in the Supabase dashboard or via SQL.
 */

/**
 * Function: get_primary_task_counts
 * 
 * Returns the counts of tools per primary_task
 * 
 * SQL:
 * CREATE OR REPLACE FUNCTION public.get_primary_task_counts()
 * RETURNS TABLE (primary_task text, count bigint) 
 * LANGUAGE sql
 * SECURITY DEFINER
 * AS $$
 *   SELECT primary_task, COUNT(*) 
 *   FROM tools 
 *   WHERE primary_task IS NOT NULL 
 *   GROUP BY primary_task 
 *   ORDER BY COUNT(*) DESC;
 * $$;
 */
