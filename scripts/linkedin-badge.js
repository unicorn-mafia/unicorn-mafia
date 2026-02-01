#!/usr/bin/env node

/**
 * LinkedIn Community Badge Script
 * 
 * Helps Unicorn Mafia members add "Community Member" status to their LinkedIn profile.
 * 
 * Usage:
 *   node scripts/linkedin-badge.js [options]
 * 
 * Options:
 *   --name <name>       Your name (for personalized output)
 *   --since <date>      When you joined (e.g., "2024" or "January 2024")
 *   --year <year>       Year you joined (for LinkedIn URL, e.g., "2024")
 *   --month <month>     Month you joined (1-12, for LinkedIn URL)
 *   --copy              Copy content to clipboard (macOS/Linux)
 *   --json              Output as JSON
 *   --url-only          Only output the LinkedIn URL
 *   --open              Open the LinkedIn URL in browser
 *   --help              Show this help message
 */

const ORGANIZATION = {
  name: 'Unicorn Mafia',
  headline: 'The highest signal community of developers in London',
  website: 'https://unicrnmafia.com',
  linkedin: 'https://www.linkedin.com/company/unicorn-mafia',
  logo: 'https://unicrnmafia.com/brand/um-black.svg',
  logoWhite: 'https://unicrnmafia.com/brand/um-white.svg',
  email: 'stable@unicrnmafia.com',
  location: 'London, United Kingdom',
};

/**
 * Generate LinkedIn Add to Profile URL
 * Uses LinkedIn's official certification add-to-profile feature
 * https://addtoprofile.linkedin.com/
 */
function generateLinkedInUrl(options = {}) {
  // Default to Unicorn Mafia inception date: March 2025
  const year = options.year || 2025;
  const month = options.month || 3;
  
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: 'Community Member',
    organizationName: ORGANIZATION.name,
    issueYear: year.toString(),
    issueMonth: month.toString(),
    certUrl: ORGANIZATION.website,
  });
  
  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

const BADGE_TEMPLATES = {
  // For a LinkedIn post announcing membership
  announcementPost: `🦄 Excited to be part of ${ORGANIZATION.name}!

${ORGANIZATION.headline} - a community of 500+ developers with:
✨ 500+ hackathon wins
🚀 30+ companies being built
🤝 Incredible collaborative energy

If you're building something cool in London, come join us!

#UnicornMafia #LondonTech #DeveloperCommunity #Hackathons

${ORGANIZATION.website}`,
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    name: null,
    since: null,
    year: null,
    month: null,
    copy: false,
    json: false,
    urlOnly: false,
    open: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--name':
        options.name = args[++i];
        break;
      case '--since':
        options.since = args[++i];
        break;
      case '--year':
        options.year = parseInt(args[++i], 10);
        break;
      case '--month':
        options.month = parseInt(args[++i], 10);
        break;
      case '--copy':
        options.copy = true;
        break;
      case '--json':
        options.json = true;
        break;
      case '--url-only':
        options.urlOnly = true;
        break;
      case '--open':
        options.open = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
    }
  }

  return options;
}

// Copy to clipboard (macOS/Linux)
function copyToClipboard(text) {
  const { execSync } = require('child_process');
  const platform = process.platform;
  
  try {
    if (platform === 'darwin') {
      execSync('pbcopy', { input: text });
      return true;
    } else if (platform === 'linux') {
      execSync('xclip -selection clipboard', { input: text });
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

// Generate the full badge content
function generateBadgeContent(options) {
  const linkedInUrl = generateLinkedInUrl(options);

  const content = {
    organization: ORGANIZATION,
    announcementPost: BADGE_TEMPLATES.announcementPost,
    linkedInUrl: linkedInUrl,
  };

  return content;
}

// Open URL in browser
function openInBrowser(url) {
  const { exec } = require('child_process');
  const platform = process.platform;
  
  let command;
  if (platform === 'darwin') {
    command = `open "${url}"`;
  } else if (platform === 'win32') {
    command = `start "" "${url}"`;
  } else {
    command = `xdg-open "${url}"`;
  }
  
  exec(command, (error) => {
    if (error) {
      console.error('Could not open browser:', error.message);
    }
  });
}

// Print help message
function printHelp() {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║          🦄 Unicorn Mafia LinkedIn Badge Generator 🦄            ║
╚══════════════════════════════════════════════════════════════════╝

Add your Unicorn Mafia community membership to LinkedIn!

USAGE:
  node scripts/linkedin-badge.js [options]

OPTIONS:
  --open            Open LinkedIn directly to add badge (recommended!)
  --url-only        Output just the LinkedIn URL
  --name <name>     Your name (for personalized output)
  --since <date>    When you joined (e.g., "2024" or "January 2024")
  --year <year>     Year you joined (for LinkedIn, e.g., "2024")
  --month <month>   Month you joined (1-12, for LinkedIn)
  --copy            Copy LinkedIn URL to clipboard
  --json            Output as JSON (for programmatic use)
  --help, -h        Show this help message

EXAMPLES:
  node scripts/linkedin-badge.js --open              # Opens LinkedIn directly!
  node scripts/linkedin-badge.js --url-only          # Get the URL only
  node scripts/linkedin-badge.js --year 2024 --month 6 --open
  node scripts/linkedin-badge.js --name "Alex" --since "2024"
  node scripts/linkedin-badge.js --json

WEBSITE:
  ${ORGANIZATION.website}
`);
}

// Print formatted output
function printOutput(content, options) {
  // Handle URL-only mode
  if (options.urlOnly) {
    console.log(content.linkedInUrl);
    return;
  }

  // Handle open mode
  if (options.open) {
    console.log(`\n🦄 Opening LinkedIn to add your Unicorn Mafia badge...\n`);
    console.log(`URL: ${content.linkedInUrl}\n`);
    openInBrowser(content.linkedInUrl);
    return;
  }

  if (options.json) {
    console.log(JSON.stringify(content, null, 2));
    return;
  }

  const divider = '═'.repeat(66);
  const thinDivider = '─'.repeat(66);

  console.log(`
╔${divider}╗
║          🦄 Unicorn Mafia LinkedIn Badge Generator 🦄            ║
╚${divider}╝
`);

  // LinkedIn Direct Link - MOST IMPORTANT
  console.log(`🚀 ONE-CLICK ADD TO LINKEDIN
${thinDivider}

Click this link to add your Unicorn Mafia membership to LinkedIn:

  ${content.linkedInUrl}

Or run: node scripts/linkedin-badge.js --open
`);

  // Logo Info
  console.log(`
🖼️  LOGO FOR YOUR PROFILE
${thinDivider}
Download our logo to use on LinkedIn:
  Black version: ${content.organization.logo}
  White version: ${content.organization.logoWhite}

Brand guidelines: ${content.organization.website}/brand
`);

  // Announcement Post
  console.log(`
📣 LINKEDIN ANNOUNCEMENT POST
${thinDivider}
Share this post to announce you've joined:

${content.announcementPost}
`);

  // Contact
  console.log(`
Need help? Contact us at ${content.organization.email}
`);

  // Copy to clipboard if requested
  if (options.copy) {
    if (copyToClipboard(content.linkedInUrl)) {
      console.log(`
✅ LinkedIn URL copied to clipboard!
`);
    } else {
      console.log(`
⚠️  Could not copy to clipboard automatically.
`);
    }
  }

  console.log(`
╔${divider}╗
║  Visit ${ORGANIZATION.website} for more community resources!    ║
╚${divider}╝
`);
}

// Main function
function main() {
  const options = parseArgs();

  if (options.help) {
    printHelp();
    return;
  }

  const content = generateBadgeContent(options);
  printOutput(content, options);
}

// Run
main();

// Export for use as module
module.exports = {
  generateBadgeContent,
  ORGANIZATION,
  BADGE_TEMPLATES,
};
