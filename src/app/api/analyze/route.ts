import { NextResponse } from "next/server";

interface SEOCheck {
  name: string;
  status: "pass" | "warning" | "fail";
  recommendation?: string;
  steps?: string[];
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
  overallScoreDesktop?: number;
  overallScoreMobile?: number;
  categories: SEOCategory[];
  categoriesDesktop?: SEOCategory[];
  categoriesMobile?: SEOCategory[];
  desktop?: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  mobile?: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
}

const actionPlans: Record<string, { recommendation: string; steps: string[] }> = {
  "Page load speed": {
    recommendation: "Consider optimizing images and enabling compression",
    steps: [
      "1. Compress all images using tools like TinyPNG or ImageOptim",
      "2. Enable GZIP or Brotli compression on your server",
      "3. Minify CSS, JavaScript, and HTML files",
      "4. Consider using a CDN like Cloudflare or AWS CloudFront",
      "5. Remove unused code and defer non-critical JavaScript"
    ]
  },
  "Render-blocking resources": {
    recommendation: "Defer non-critical JavaScript and CSS",
    steps: [
      "1. Add 'defer' attribute to non-critical JavaScript in your <script> tags",
      "2. Move CSS to inline or use 'media' attributes for conditional loading",
      "3. Use 'preload' for critical resources that load first",
      "4. Consider using 'requestAnimationFrame' for non-critical operations",
      "5. Split large JavaScript bundles into smaller chunks"
    ]
  },
  "Server response time": {
    recommendation: "Consider using a faster hosting provider or CDN",
    steps: [
      "1. Switch to a faster hosting provider (SSD storage, modern data centers)",
      "2. Implement a Content Delivery Network (CDN)",
      "3. Enable server-side caching (Redis, Varnish)",
      "4. Optimize database queries and use query caching",
      "5. Consider upgrading to a dedicated server or VPS"
    ]
  },
  "Browser caching": {
    recommendation: "Set up proper cache headers for static assets",
    steps: [
      "1. Add Cache-Control headers to your server configuration",
      "2. Set long cache expiry for static assets (CSS, JS, images)",
      "3. Use versioned filenames for cache busting",
      "4. Configure ETag headers for conditional requests",
      "5. Consider using service workers for offline caching"
    ]
  },
  "Meta description": {
    recommendation: "Add a compelling meta description between 150-160 characters",
    steps: [
      "1. Write a unique meta description for each page",
      "2. Keep it between 150-160 characters",
      "3. Include your primary keyword naturally",
      "4. Add a clear call-to-action",
      "5. Add to HTML: <meta name=\"description\" content=\"Your description here\">"
    ]
  },
  "Open Graph tags": {
    recommendation: "Add OG tags for better social media sharing",
    steps: [
      "1. Add og:title - <meta property=\"og:title\" content=\"Page Title\">",
      "2. Add og:description - <meta property=\"og:description\" content=\"Description\">",
      "3. Add og:image - <meta property=\"og:image\" content=\"image-url.jpg\">",
      "4. Add og:url - <meta property=\"og:url\" content=\"page-url\">",
      "5. Add og:type - <meta property=\"og:type\" content=\"website\">",
      "6. Test with Facebook's Sharing Debugger"
    ]
  },
  "Canonical tag": {
    recommendation: "Add a canonical URL to prevent duplicate content issues",
    steps: [
      "1. Choose your preferred URL format (with or without www)",
      "2. Add to each page: <link rel=\"canonical\" href=\"https://example.com/page\">",
      "3. Set up 301 redirects from HTTP to HTTPS",
      "4. Set up 301 redirects from non-www to www (or vice versa)",
      "5. Configure canonical URLs in Google Search Console"
    ]
  },
  "Heading hierarchy": {
    recommendation: "Use headings in correct order (H1 > H2 > H3)",
    steps: [
      "1. Use only one H1 tag per page (your main title)",
      "2. Use H2 for main section headings",
      "3. Use H3 for subsections under H2",
      "4. Never skip heading levels (H1 -> H3 is wrong)",
      "5. Make headings descriptive and include keywords naturally"
    ]
  },
  "Descriptive headings": {
    recommendation: "Make headings descriptive and keyword-rich",
    steps: [
      "1. Include relevant keywords in your headings",
      "2. Keep headings clear and descriptive",
      "3. Avoid vague headings like 'More info' or 'Click here'",
      "4. Make headings benefit-driven when possible",
      "5. Use parallel structure across similar sections"
    ]
  },
  "Alt text on images": {
    recommendation: "Add descriptive alt text to all images",
    steps: [
      "1. Add alt attribute to every <img> tag",
      "2. Describe what the image shows concisely",
      "3. Include relevant keywords naturally",
      "4. Leave blank for decorative images (alt=\"\")",
      "5. Avoid keyword stuffing in alt text",
      "6. Example: <img src=\"product.jpg\" alt=\"Blue running shoes with white sole\">"
    ]
  },
  "Image file sizes": {
    recommendation: "Compress images and use modern formats like WebP",
    steps: [
      "1. Convert images to WebP format (smaller file size)",
      "2. Compress JPEG images to 80% quality",
      "3. Compress PNG images with tools like TinyPNG",
      "4. Use responsive images with srcset attribute",
      "5. Consider lazy loading for images below the fold"
    ]
  },
  "Lazy loading": {
    recommendation: "Enable lazy loading for images below the fold",
    steps: [
      "1. Add loading=\"lazy\" to image tags: <img loading=\"lazy\" src=\"...\">",
      "2. Use JavaScript libraries like lozad.js for broader support",
      "3. Implement Intersection Observer API for custom lazy loading",
      "4. Reserve space with width and height attributes",
      "5. Don't lazy load images above the fold (LCP impact)"
    ]
  },
  "Image dimensions": {
    recommendation: "Add width and height attributes to prevent layout shift",
    steps: [
      "1. Add width and height attributes to all <img> tags",
      "2. Example: <img src=\"image.jpg\" width=\"800\" height=\"600\" alt=\"...\">",
      "3. Use CSS aspect-ratio for responsive sizing",
      "4. Reserve space in CSS for images before they load",
      "5. Test with Google PageSpeed Insights to verify CLS score"
    ]
  },
  "External links": {
    recommendation: "Add relevant outbound links to authoritative sources",
    steps: [
      "1. Link to authoritative, relevant external websites",
      "2. Add rel=\"noopener noreferrer\" for security and SEO",
      "3. Example: <a href=\"https://authority-site.com\" rel=\"noopener noreferrer\">",
      "4. Don't overdo it - keep links relevant and valuable",
      "5. Consider linking to industry studies or resources"
    ]
  },
  "Anchor text quality": {
    recommendation: "Use descriptive anchor text for links",
    steps: [
      "1. Use descriptive text instead of 'click here' or 'read more'",
      "2. Include relevant keywords in anchor text naturally",
      "3. Make anchor text describe the destination",
      "4. Avoid generic anchors like 'here' or 'this page'",
      "5. Example: Instead of 'Click here' use 'Learn about our services'"
    ]
  },
  "Broken links": {
    recommendation: "Fix any broken links found on the page",
    steps: [
      "1. Use tools like Screaming Frog or Broken Link Checker",
      "2. Update or remove links that return 404 errors",
      "3. Set up 301 redirects for moved content",
      "4. Check links periodically (monthly recommended)",
      "5. Update internal links when changing URL structures"
    ]
  },
  "Robots.txt": {
    recommendation: "Create a robots.txt file to guide search crawlers",
    steps: [
      "1. Create a robots.txt file in your site root: example.com/robots.txt",
      "2. Add: User-agent: * to target all crawlers",
      "3. Add: Disallow: /private/ to block private pages",
      "4. Add: Sitemap: https://example.com/sitemap.xml",
      "5. Test with Google Search Console's robots.txt Tester"
    ]
  },
  "XML Sitemap": {
    recommendation: "Submit an XML sitemap to search engines",
    steps: [
      "1. Create an XML sitemap listing all important pages",
      "2. Submit to Google Search Console and Bing Webmaster Tools",
      "3. Update sitemap when adding new pages",
      "4. Keep sitemap under 50,000 URLs and 50MB",
      "5. Include lastmod, changefreq, and priority tags"
    ]
  },
  "SSL/HTTPS": {
    recommendation: "Enable HTTPS for secure browsing",
    steps: [
      "1. Purchase an SSL certificate or use Let's Encrypt (free)",
      "2. Install the certificate on your web server",
      "3. Update internal links from http:// to https://",
      "4. Set up 301 redirect from HTTP to HTTPS",
      "5. Update Google Search Console with HTTPS version"
    ]
  },
  "Schema markup": {
    recommendation: "Add structured data to help search engines understand content",
    steps: [
      "1. Choose relevant schema type (Organization, Product, Article, etc.)",
      "2. Use JSON-LD format (recommended by Google)",
      "3. Add to <head> or <body>: <script type=\"application/ld+json\">",
      "4. Test with Google's Rich Results Test tool",
      "5. Consider local business schema, FAQ schema, or review schema"
    ]
  },
  "Content length": {
    recommendation: "Aim for at least 300-500 words per page",
    steps: [
      "1. Write comprehensive content for each page (300+ words minimum)",
      "2. Cover topics in depth - longer content often ranks better",
      "3. Break up text with headings, lists, and images",
      "4. Focus on quality over quantity",
      "5. Update and expand existing thin content"
    ]
  },
  "Readability": {
    recommendation: "Use shorter sentences and simpler words",
    steps: [
      "1. Aim for 8th-grade reading level for general audiences",
      "2. Keep sentences under 20 words when possible",
      "3. Use bullet points and numbered lists",
      "4. Break up long paragraphs (3-4 sentences max)",
      "5. Use tools like Hemingway Editor to check readability"
    ]
  },
  "Mobile-friendly design": {
    recommendation: "Ensure your site is responsive on all screen sizes",
    steps: [
      "1. Use responsive design with media queries",
      "2. Test with Google's Mobile-Friendly Test tool",
      "3. Ensure tap targets are at least 44x44 pixels",
      "4. Avoid fixed-width elements that cause horizontal scroll",
      "5. Use flexible images and grids (CSS Flexbox/Grid)"
    ]
  },
  "Touch-friendly targets": {
    recommendation: "Make buttons and links at least 44px tall",
    steps: [
      "1. Ensure all clickable elements are at least 44x44 pixels",
      "2. Add adequate spacing between links (8px minimum)",
      "3. Avoid clustering too many clickable elements together",
      "4. Use CSS to increase button padding for mobile",
      "5. Test on actual mobile devices, not just emulators"
    ]
  },
  "Font size": {
    recommendation: "Use a minimum font size of 16px for body text",
    steps: [
      "1. Set body text to at least 16px (1rem)",
      "2. Use relative units (rem, em) for scalable text",
      "3. Ensure contrast meets WCAG guidelines (4.5:1 ratio)",
      "4. Allow users to zoom text without breaking layout",
      "5. Test readability on mobile devices"
    ]
  }
};

function getStatusFromScore(score: number): "pass" | "warning" | "fail" {
  if (score >= 90) return "pass";
  if (score >= 50) return "warning";
  return "fail";
}

async function fetchPageSpeedInsights(url: string, strategy: "DESKTOP" | "MOBILE" = "DESKTOP") {
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=AIzaSyBWoi7GqNOw6gmS4W3K5T8mKf4WVq-UQYM&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO&strategy=${strategy}`;
  
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`PageSpeed API error: ${response.status}`);
    }
    const data = await response.json();
    
    const lighthouse = data.lighthouseResult || {};
    const categories = lighthouse.categories || {};
    
    return {
      performance: Math.round((categories.performance?.score || 0) * 100),
      accessibility: Math.round((categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
      seo: Math.round((categories.seo?.score || 0) * 100),
    };
  } catch (error) {
    console.error("PageSpeed Insights error:", error);
    return null;
  }
}

async function fetchHTMLContent(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEO-Scout/1.0)',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    const html = await response.text();
    return html;
  } catch (error) {
    console.error("HTML fetch error:", error);
    return null;
  }
}

function analyzeHTML(html: string | null, url: string, desktop: { performance: number; accessibility: number; bestPractices: number; seo: number } | null, mobile: { performance: number; accessibility: number; bestPractices: number; seo: number } | null, strategy: "desktop" | "mobile" = "desktop"): SEOResult {
  const pageSpeed = strategy === "desktop" ? desktop : mobile;
  const isHttps = url.startsWith("https");
  
  let titleTag = null;
  let metaDescription = null;
  let hasViewport = false;
  let h1Count = 0;
  let h1Text = "";
  let hasCanonical = false;
  let ogTags = { title: false, description: false, image: false };
  let imagesWithoutAlt = 0;
  let totalImages = 0;
  let hasRobotsTxt = false;
  let hasSitemap = false;
  let hasSchema = false;
  
  if (html) {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    titleTag = titleMatch ? titleMatch[1].trim() : null;
    
    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    metaDescription = metaDescMatch ? metaDescMatch[1].trim() : null;
    
    hasViewport = /<meta[^>]*name=["']viewport["']/i.test(html);
    
    const h1Matches = html.match(/<h1[^>]*>([^<]+)<\/h1>/gi);
    h1Count = h1Matches ? h1Matches.length : 0;
    if (h1Matches && h1Matches[0]) {
      h1Text = h1Matches[0].replace(/<[^>]+>/g, "").trim();
    }
    
    hasCanonical = /<link[^>]*rel=["']canonical["']/i.test(html);
    
    ogTags.title = /<meta[^>]*property=["']og:title["']/i.test(html);
    ogTags.description = /<meta[^>]*property=["']og:description["']/i.test(html);
    ogTags.image = /<meta[^>]*property=["']og:image["']/i.test(html);
    
    const imgMatches = html.match(/<img[^>]*>/gi) || [];
    totalImages = imgMatches.length;
    imagesWithoutAlt = imgMatches.filter(img => !/alt=["'][^"']+["']/i.test(img)).length;
    
    hasSchema = /<script[^>]*type=["']application\/ld\+json["']/i.test(html);
  }
  
  const urlObj = new URL(url);
  const domain = urlObj.hostname;
  
  fetch(`https://${domain}/robots.txt`).then(r => { if (r.ok) hasRobotsTxt = true; }).catch(() => {});
  fetch(`https://${domain}/sitemap.xml`).then(r => { if (r.ok) hasSitemap = true; }).catch(() => {});
  
  const performanceScore = pageSpeed?.performance || 65;
  const seoScore = pageSpeed?.seo || 70;
  const accessibilityScore = pageSpeed?.accessibility || 75;
  const bestPracticesScore = pageSpeed?.bestPractices || 80;
  
  const categories: SEOCategory[] = [
    {
      name: "Performance",
      icon: "⚡",
      score: performanceScore,
      checks: [
        {
          name: "Page load speed",
          status: getStatusFromScore(performanceScore),
          ...(performanceScore < 90 ? actionPlans["Page load speed"] : {})
        },
        {
          name: "Largest Contentful Paint",
          status: performanceScore >= 90 ? "pass" : performanceScore >= 50 ? "warning" : "fail",
          recommendation: performanceScore < 90 ? "Optimize images and reduce server response time" : undefined
        },
        {
          name: "Cumulative Layout Shift",
          status: performanceScore >= 80 ? "pass" : "warning",
          recommendation: performanceScore < 80 ? "Add width and height attributes to images" : undefined
        },
        {
          name: "First Input Delay",
          status: performanceScore >= 85 ? "pass" : "warning",
          recommendation: performanceScore < 85 ? "Reduce JavaScript execution time" : undefined
        }
      ]
    },
    {
      name: "SEO",
      icon: "🔍",
      score: seoScore,
      checks: [
        {
          name: "Title tag",
          status: titleTag ? "pass" : "fail",
          recommendation: titleTag ? undefined : "Add a title tag to your page"
        },
        {
          name: "Meta description",
          status: metaDescription ? "pass" : "warning",
          recommendation: metaDescription ? undefined : actionPlans["Meta description"].recommendation
        },
        {
          name: "H1 tag",
          status: h1Count === 1 ? "pass" : h1Count === 0 ? "fail" : "warning",
          recommendation: h1Count === 0 ? "Add an H1 heading to your page" : h1Count > 1 ? "Use only one H1 tag per page" : undefined
        },
        {
          name: "Canonical tag",
          status: hasCanonical ? "pass" : "warning",
          ...(hasCanonical ? {} : actionPlans["Canonical tag"])
        },
        {
          name: "Robots.txt",
          status: "warning",
          recommendation: "Check if robots.txt exists"
        },
        {
          name: "XML Sitemap",
          status: "warning",
          recommendation: "Submit a sitemap to search engines"
        }
      ]
    },
    {
      name: "Mobile",
      icon: "📱",
      score: accessibilityScore,
      checks: [
        {
          name: "Viewport meta tag",
          status: hasViewport ? "pass" : "fail",
          recommendation: hasViewport ? undefined : "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">"
        },
        {
          name: "Mobile-friendly",
          status: accessibilityScore >= 80 ? "pass" : "warning",
          recommendation: accessibilityScore < 80 ? "Ensure your site is responsive" : undefined
        },
        {
          name: "Tap targets size",
          status: accessibilityScore >= 70 ? "pass" : "warning",
          ...(accessibilityScore < 70 ? actionPlans["Touch-friendly targets"] : {})
        },
        {
          name: "Font size",
          status: accessibilityScore >= 75 ? "pass" : "warning",
          ...(accessibilityScore < 75 ? actionPlans["Font size"] : {})
        }
      ]
    },
    {
      name: "Security & Best Practices",
      icon: "🛡️",
      score: bestPracticesScore,
      checks: [
        {
          name: "HTTPS",
          status: isHttps ? "pass" : "fail",
          ...(isHttps ? {} : actionPlans["SSL/HTTPS"])
        },
        {
          name: "Schema markup",
          status: hasSchema ? "pass" : "warning",
          ...(hasSchema ? {} : actionPlans["Schema markup"])
        },
        {
          name: "Image alt text",
          status: imagesWithoutAlt === 0 ? "pass" : "warning",
          recommendation: imagesWithoutAlt > 0 ? `Add alt text to ${imagesWithoutAlt} images` : undefined,
          ...(imagesWithoutAlt > 0 ? actionPlans["Alt text on images"] : {})
        }
      ]
    },
    {
      name: "Social Tags",
      icon: "📣",
      score: ogTags.title && ogTags.description && ogTags.image ? 100 : ogTags.title && ogTags.description ? 75 : 50,
      checks: [
        {
          name: "Open Graph title",
          status: ogTags.title ? "pass" : "warning",
          ...(ogTags.title ? {} : actionPlans["Open Graph tags"])
        },
        {
          name: "Open Graph description",
          status: ogTags.description ? "pass" : "warning",
          ...(ogTags.description ? {} : actionPlans["Open Graph tags"])
        },
        {
          name: "Open Graph image",
          status: ogTags.image ? "pass" : "warning",
          ...(ogTags.image ? {} : actionPlans["Open Graph tags"])
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
    let { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const [desktop, mobile, html] = await Promise.all([
      fetchPageSpeedInsights(url, "DESKTOP").catch(() => null),
      fetchPageSpeedInsights(url, "MOBILE").catch(() => null),
      fetchHTMLContent(url).catch(() => null)
    ]);

    const desktopResult = analyzeHTML(html, url, desktop, mobile, "desktop");
    const mobileResult = analyzeHTML(html, url, desktop, mobile, "mobile");

    const desktopScore = desktop 
      ? Math.round((desktop.performance + desktop.accessibility + desktop.bestPractices + desktop.seo) / 4)
      : 65;
    const mobileScore = mobile 
      ? Math.round((mobile.performance + mobile.accessibility + mobile.bestPractices + mobile.seo) / 4)
      : 65;
    const overallScore = Math.round((desktopScore + mobileScore) / 2);

    return NextResponse.json({
      url,
      overallScore,
      overallScoreDesktop: desktopScore,
      overallScoreMobile: mobileScore,
      categories: desktopResult.categories,
      categoriesDesktop: desktopResult.categories,
      categoriesMobile: mobileResult.categories,
      desktop,
      mobile
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze website" },
      { status: 500 }
    );
  }
}
