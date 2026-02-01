import { NextResponse } from "next/server";

/** Returns full Atlas product content as plain text for AI training. Used when bot is trained on localhost. */
export async function GET() {
  const content = `SiteBotGPT - AI Chatbot Platform

What is SiteBotGPT Assistant?
SiteBotGPT Assistant is the AI-powered chatbot created by SiteBotGPT. It's like having ChatGPT specifically for your product. It answers visitor questions based on your website and document content. The chat bubble appears on your site and visitors can ask anything—SiteBotGPT responds using only your trained content.

How does the chatbot work?
1. Add your content: Enter your website URL, upload PDFs or docs. SiteBotGPT indexes everything and builds a searchable knowledge base.
2. Install on your site: Embed one script tag. The chat bubble appears in the corner. One bot, many pages.
3. Learn and refine: View chat history and analytics. See what visitors ask. Add training data where there are gaps.

The bot uses AI to match questions to your content and generates answers. When unsure, it can capture leads (email, name, phone) for follow-up.

Features:
- Personalized chatbot trained on your content. Set tone: formal, friendly, or casual.
- Quick prompts: Clickable questions to help visitors start (e.g. "What do you offer?", "How do I get started?").
- Lead capture: When the bot is unsure or visitor wants human help, capture their contact details.
- Analytics: Chat history, top questions, usage. Export to CSV.
- One snippet: Add the widget to any site. Same bot, consistent answers.

Training and setup:
- Train on: Website URL (we crawl and index), PDF, DOCX, TXT, MD files. Bot uses only your content.
- Training takes a few minutes. Most sites indexed in under 5 minutes.
- Supported files: PDF, DOCX, TXT, MD.

Embed and integrate:
- Copy one script tag, add to your HTML. Chat bubble appears. No iframes.
- Hand off to human: When bot is unsure, capture contact details for follow-up.

Pricing:
- Free tier available. Multiple bots, document uploads, core features.
- Upgrade when you need more volume.

Works with: Any website, WordPress, React, help centers, API.
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
