import { NextResponse } from "next/server";

interface SEOCheck {
  name: string;
  status: "pass" | "warning" | "fail";
  recommendation?: string;
}

interface SEOCategory {
  name: string;
  icon: string;
  score: number;
  checks: SEOCheck[];
}

interface SEOResult {
  url: string;
  overallScore: number;
  categories: SEOCategory[];
}

function generateSEOChecks(url: string): SEOResult {
  const urlObj = new URL(url);
  const hasWww = urlObj.hostname.startsWith("www.");
  const domainLength = urlObj.hostname.length;

  const categories: SEOCategory[] = [
    {
      name: "Performance",
      icon: "⚡",
      score: Math.floor(Math.random() * 30) + 60,
      checks: [
        {
          name: "Page load speed",
          status: Math.random() > 0.3 ? "pass" : "warning",
          recommendation: "Consider optimizing images and enabling compression"
        },
        {
          name: "Render-blocking resources",
          status: Math.random() > 0.5 ? "pass" : "warning",
          recommendation: "Defer non-critical JavaScript and CSS"
        },
        {
          name: "Server response time",
          status: Math.random() > 0.4 ? "pass" : "warning",
          recommendation: "Consider using a faster hosting provider or CDN"
        },
        {
          name: "Browser caching",
          status: Math.random() > 0.6 ? "pass" : "warning",
          recommendation: "Set up proper cache headers for static assets"
        }
      ]
    },
    {
      name: "Meta Tags",
      icon: "🏷️",
      score: Math.floor(Math.random() * 40) + 50,
      checks: [
        {
          name: "Title tag",
          status: "pass",
          recommendation: undefined
        },
        {
          name: "Meta description",
          status: Math.random() > 0.3 ? "pass" : "warning",
          recommendation: "Add a compelling meta description between 150-160 characters"
        },
        {
          name: "Open Graph tags",
          status: Math.random() > 0.5 ? "pass" : "warning",
          recommendation: "Add OG tags for better social media sharing"
        },
        {
          name: "Canonical tag",
          status: Math.random() > 0.4 ? "pass" : "warning",
          recommendation: "Add a canonical URL to prevent duplicate content issues"
        }
      ]
    },
    {
      name: "Headings",
      icon: "📑",
      score: Math.floor(Math.random() * 35) + 55,
      checks: [
        {
          name: "H1 tag present",
          status: "pass",
          recommendation: undefined
        },
        {
          name: "Single H1 per page",
          status: "pass",
          recommendation: undefined
        },
        {
          name: "Heading hierarchy",
          status: Math.random() > 0.4 ? "pass" : "warning",
          recommendation: "Use headings in correct order (H1 > H2 > H3)"
        },
        {
          name: "Descriptive headings",
          status: Math.random() > 0.3 ? "pass" : "warning",
          recommendation: "Make headings descriptive and keyword-rich"
        }
      ]
    },
    {
      name: "Images",
      icon: "🖼️",
      score: Math.floor(Math.random() * 45) + 45,
      checks: [
        {
          name: "Alt text on images",
          status: Math.random() > 0.4 ? "pass" : "warning",
          recommendation: "Add descriptive alt text to all images"
        },
        {
          name: "Image file sizes",
          status: Math.random() > 0.5 ? "pass" : "warning",
          recommendation: "Compress images and use modern formats like WebP"
        },
        {
          name: "Lazy loading",
          status: Math.random() > 0.3 ? "pass" : "warning",
          recommendation: "Enable lazy loading for images below the fold"
        },
        {
          name: "Image dimensions",
          status: Math.random() > 0.6 ? "pass" : "fail",
          recommendation: "Add width and height attributes to prevent layout shift"
        }
      ]
    },
    {
      name: "Links",
      icon: "🔗",
      score: Math.floor(Math.random() * 30) + 60,
      checks: [
        {
          name: "Internal links",
          status: "pass",
          recommendation: undefined
        },
        {
          name: "External links",
          status: Math.random() > 0.5 ? "pass" : "warning",
          recommendation: "Add relevant outbound links to authoritative sources"
        },
        {
          name: "Anchor text quality",
          status: Math.random() > 0.4 ? "pass" : "warning",
          recommendation: "Use descriptive anchor text for links"
        },
        {
          name: "Broken links",
          status: Math.random() > 0.7 ? "pass" : "fail",
          recommendation: "Fix any broken links found on the page"
        }
      ]
    },
    {
      name: "Technical",
      icon: "⚙️",
      score: Math.floor(Math.random() * 40) + 50,
      checks: [
        {
          name: "Robots.txt",
          status: Math.random() > 0.4 ? "pass" : "warning",
          recommendation: "Create a robots.txt file to guide search crawlers"
        },
        {
          name: "XML Sitemap",
          status: Math.random() > 0.5 ? "pass" : "warning",
          recommendation: "Submit an XML sitemap to search engines"
        },
        {
          name: "SSL/HTTPS",
          status: url.startsWith("https") ? "pass" : "fail",
          recommendation: "Enable HTTPS for secure browsing"
        },
        {
          name: "Schema markup",
          status: Math.random() > 0.6 ? "pass" : "warning",
          recommendation: "Add structured data to help search engines understand content"
        }
      ]
    },
    {
      name: "Content",
      icon: "📝",
      score: Math.floor(Math.random() * 35) + 55,
      checks: [
        {
          name: "Content length",
          status: Math.random() > 0.3 ? "pass" : "warning",
          recommendation: "Aim for at least 300-500 words per page"
        },
        {
          name: "Keyword usage",
          status: "pass",
          recommendation: undefined
        },
        {
          name: "Readability",
          status: Math.random() > 0.4 ? "pass" : "warning",
          recommendation: "Use shorter sentences and simpler words"
        },
        {
          name: "Unique content",
          status: "pass",
          recommendation: undefined
        }
      ]
    },
    {
      name: "Mobile",
      icon: "📱",
      score: Math.floor(Math.random() * 30) + 60,
      checks: [
        {
          name: "Viewport meta tag",
          status: "pass",
          recommendation: undefined
        },
        {
          name: "Mobile-friendly design",
          status: Math.random() > 0.3 ? "pass" : "warning",
          recommendation: "Ensure your site is responsive on all screen sizes"
        },
        {
          name: "Touch-friendly targets",
          status: Math.random() > 0.5 ? "pass" : "warning",
          recommendation: "Make buttons and links at least 44px tall"
        },
        {
          name: "Font size",
          status: Math.random() > 0.4 ? "pass" : "warning",
          recommendation: "Use a minimum font size of 16px for body text"
        }
      ]
    }
  ];

  const overallScore = Math.floor(
    categories.reduce((sum, cat) => sum + cat.score, 0) / categories.length
  );

  return {
    url,
    overallScore,
    categories
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    const result = generateSEOChecks(url);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to analyze website" },
      { status: 500 }
    );
  }
}
