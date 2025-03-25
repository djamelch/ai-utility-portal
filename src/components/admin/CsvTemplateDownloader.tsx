
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CsvTemplateDownloaderProps {
  className?: string;
}

export function CsvTemplateDownloader({ className }: CsvTemplateDownloaderProps) {
  const generateTemplate = () => {
    const headers = [
      'company_name',
      'short_description',
      'full_description',
      'primary_task',
      'applicable_tasks',
      'pros',
      'cons',
      'pricing',
      'logo_url',
      'featured_image_url',
      'visit_website_url',
      'detail_url',
      'q1',
      'a1',
      'q2',
      'a2',
      'q3',
      'a3'
    ].join(',');
    
    const sampleData = [
      'ChatGPT,Advanced AI chatbot that can engage in conversational dialogue.,ChatGPT is an AI language model developed by OpenAI...,AI Chatbot,"writing, research, coding",24/7 availability,May generate incorrect information,Freemium,https://example.com/chatgpt-logo.png,https://example.com/chatgpt-feature.jpg,https://chat.openai.com,https://openai.com/chatgpt,What are the pricing tiers?,Free and premium plans starting at $20/month,Is it available on mobile?,Yes available on iOS and Android,What languages are supported?,Supports over 50 languages',
      'Midjourney,AI image generator for creating stunning artwork.,Midjourney is an AI program that generates images from textual descriptions...,Image Generation,"digital art, concept design, illustrations",High-quality results,Requires Discord to use,Paid,https://example.com/midjourney-logo.png,https://example.com/midjourney-feature.jpg,https://midjourney.com,https://midjourney.com,How much does it cost?,Plans start at $10/month,Can I use the images commercially?,Yes with the appropriate plan,What art styles can it create?,Nearly any style from photorealistic to abstract'
    ].join('\n');
    
    const csvContent = `${headers}\n${sampleData}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ai-tools-template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button 
      onClick={generateTemplate} 
      variant="outline" 
      className={className}
      size="sm"
    >
      <Download className="h-4 w-4 mr-2" />
      Download CSV Template
    </Button>
  );
}
