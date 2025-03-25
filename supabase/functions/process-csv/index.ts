
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { parse } from "https://deno.land/std@0.196.0/csv/parse.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase environment variables are not set");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const formData = await req.formData();
    const csvFile = formData.get("csv") as File;
    
    if (!csvFile) {
      return new Response(
        JSON.stringify({ error: "No CSV file provided" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Read and parse the CSV file
    const text = await csvFile.text();
    const rows = parse(text, { skipFirstRow: true, columns: true });
    
    console.log(`Parsed ${rows.length} rows from CSV`);

    // Process each row and update database
    const results = {
      created: 0,
      updated: 0,
      errors: [],
    };

    for (const row of rows) {
      try {
        // Check if tool exists by company_name or id
        const { data: existingTools, error: queryError } = await supabase
          .from("tools")
          .select("id")
          .eq("company_name", row.company_name)
          .maybeSingle();

        if (queryError) {
          throw queryError;
        }

        // Prepare tool data
        const toolData = {
          company_name: row.company_name,
          logo_url: row.logo_url,
          short_description: row.short_description,
          full_description: row.full_description,
          primary_task: row.primary_task,
          applicable_tasks: row.applicable_tasks ? row.applicable_tasks.split(',').map(task => task.trim()) : [],
          pros: row.pros ? row.pros.split(',').map(pro => pro.trim()) : [],
          cons: row.cons ? row.cons.split(',').map(con => con.trim()) : [],
          pricing: row.pricing,
          featured_image_url: row.featured_image_url,
          visit_website_url: row.visit_website_url,
          detail_url: row.detail_url,
          updated_at: new Date().toISOString(),
        };

        // Process FAQ data if present in the CSV
        const faqData = {};
        Object.keys(row).forEach(key => {
          if (key.startsWith('q') && /^q\d+$/.test(key)) {
            const num = key.substring(1);
            const answerKey = `a${num}`;
            
            if (row[key] && row[answerKey]) {
              faqData[key] = row[key];
              faqData[answerKey] = row[answerKey];
            }
          }
        });

        if (Object.keys(faqData).length > 0) {
          toolData.faqs = faqData;
        }

        if (existingTools) {
          // Update existing tool
          const { error: updateError } = await supabase
            .from("tools")
            .update(toolData)
            .eq("id", existingTools.id);

          if (updateError) throw updateError;
          results.updated++;
        } else {
          // Create new tool
          const { error: insertError } = await supabase
            .from("tools")
            .insert([toolData]);

          if (insertError) throw insertError;
          results.created++;
        }
      } catch (err) {
        console.error(`Error processing row for ${row.company_name}:`, err);
        results.errors.push({
          company_name: row.company_name,
          error: err.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${rows.length} tools. Created: ${results.created}, Updated: ${results.updated}, Errors: ${results.errors.length}`,
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing CSV:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
