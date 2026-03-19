# SEO Tool for New Websites - Specification

## Project Overview
- **Project Name**: SEO Scout
- **Type**: Web Application (Next.js)
- **Core Functionality**: Analyzes websites for SEO issues, providing actionable insights for new website owners
- **Target Users**: New website owners, small business owners, startups launching their first website

## UI/UX Specification

### Layout Structure
- **Header**: Fixed top navigation with logo and tool name
- **Hero Section**: Large search input for URL entry with submit button
- **Results Section**: Expandable cards showing analysis categories
- **Footer**: Minimal footer with credits

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Visual Design

#### Color Palette
- **Background**: #0A0A0F (deep navy-black)
- **Surface**: #12121A (card backgrounds)
- **Surface Elevated**: #1A1A24 (hover states)
- **Primary**: #22D3EE (cyan accent)
- **Primary Glow**: rgba(34, 211, 238, 0.15)
- **Success**: #10B981 (emerald green)
- **Warning**: #F59E0B (amber)
- **Error**: #EF4444 (red)
- **Text Primary**: #F4F4F5 (zinc-100)
- **Text Secondary**: #A1A1AA (zinc-400)
- **Border**: #27272A (zinc-800)

#### Typography
- **Font Family**: "JetBrains Mono" for headings (monospace tech feel), "DM Sans" for body
- **Heading Sizes**: 
  - H1: 48px / 3rem (hero title)
  - H2: 28px / 1.75rem (section titles)
  - H3: 18px / 1.125rem (card titles)
- **Body**: 16px / 1rem
- **Small**: 14px / 0.875rem

#### Spacing System
- Base unit: 4px
- Sections: 80px vertical padding
- Cards: 24px padding
- Elements: 16px gap

#### Visual Effects
- Card shadows: 0 4px 24px rgba(0, 0, 0, 0.4)
- Glow effect on primary buttons: box-shadow with cyan
- Subtle gradient overlays on cards
- Animated scanning line effect during analysis
- Staggered fade-in animations for results

### Components

#### URL Input
- Large text input with placeholder "Enter website URL..."
- Animated border glow on focus
- Clear button when input has value
- States: default, focused, error, loading

#### Analyze Button
- Primary CTA button with cyan background
- Pulse animation when idle
- Loading spinner during analysis
- Disabled state when URL is empty

#### Score Circle
- Circular progress indicator showing overall score
- Color changes based on score (red < 50, yellow 50-79, green >= 80)
- Animated fill on load

#### Result Category Cards
- Expandable/collapsible
- Icon + title + score badge
- List of checks with pass/fail/warning indicators
- Smooth expand/collapse animation

#### Check Item
- Icon indicator (checkmark, warning, x)
- Label text
- Optional recommendation text
- Status colors matching pass/warn/fail

## Functionality Specification

### Core Features

1. **URL Input & Validation**
   - Accept full URLs (https://example.com) or domain only (example.com)
   - Auto-prepend https:// if missing
   - Validate URL format before submission
   - Show error for invalid URLs

2. **SEO Analysis Categories**
   - **Performance** (loading speed, render-blocking resources)
   - **Meta Tags** (title, description, OG tags)
   - **Headings** (H1 presence, hierarchy)
   - **Images** (alt text, lazy loading)
   - **Links** (internal/external, broken links)
   - **Technical** (robots.txt, sitemap, canonical)
   - **Content** (word count, readability)
   - **Mobile** (viewport, mobile-friendly)

3. **Scoring System**
   - Each category scored 0-100
   - Overall score is weighted average
   - Pass (green): 80-100
   - Warning (yellow): 50-79
   - Fail (red): 0-49

4. **Analysis Results**
   - Expandable category cards
   - Individual check results with status
   - Actionable recommendations
   - Overall score summary

### User Interactions
1. User enters URL in input field
2. Clicks "Analyze" button
3. Loading animation displays (scanning simulation)
4. Results appear with staggered animation
5. User can expand/collapse category cards
6. User can analyze another URL

### Edge Cases
- Invalid URL format: Show validation error
- Unreachable URL: Show connection error with suggestions
- Empty results: Show "No issues found" message
- Very slow response: Show timeout message after 30s

## Technical Implementation

### API Route
- POST /api/analyze
- Accepts JSON: { url: string }
- Returns analysis results with categories and checks

### Analysis Logic (Simulated)
Since we can't actually crawl external sites in this environment, we'll:
1. Validate the URL is reachable (basic fetch)
2. Generate simulated analysis based on common SEO patterns
3. Provide realistic recommendations

## Acceptance Criteria

1. URL input accepts and validates website URLs
2. Analyze button triggers loading state
3. Results display with animated reveal
4. Overall score shows as circular progress
5. All 8 category cards are present and expandable
6. Individual checks show pass/warning/fail status
7. Recommendations are actionable
8. Mobile responsive layout works
9. No console errors on page load
10. TypeScript compiles without errors
11. ESLint passes
