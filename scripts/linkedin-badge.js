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
 *   --copy              Copy content to clipboard (macOS/Linux)
 *   --json              Output as JSON
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

const BADGE_TEMPLATES = {
  // For LinkedIn Experience/Volunteer section
  experience: {
    title: 'Community Member',
    organization: ORGANIZATION.name,
    description: `Active member of ${ORGANIZATION.name} - ${ORGANIZATION.headline}.

🦄 500+ hackathon wins across the community
🚀 30+ companies being built by members
👥 500+ developers collaborating and building together

Key activities:
• Attending hackathons, meetups, and community events
• Collaborating with fellow developers on innovative projects
• Contributing to the London tech ecosystem
• Sharing knowledge and supporting fellow community members`,
    skills: [
      'Hackathons',
      'Community Building',
      'Software Development',
      'Networking',
      'Innovation',
      'Collaboration',
    ],
  },

  // For LinkedIn headline/bio
  headline: `${ORGANIZATION.name} Community Member | Developer`,
  
  // For LinkedIn about section
  aboutAddition: `\n\n🦄 Proud member of ${ORGANIZATION.name} - ${ORGANIZATION.headline}.\n\nLearn more: ${ORGANIZATION.website}`,

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
    copy: false,
    json: false,
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
      case '--copy':
        options.copy = true;
        break;
      case '--json':
        options.json = true;
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
  const template = { ...BADGE_TEMPLATES.experience };
  
  // Customize description with name if provided
  if (options.name) {
    template.description = template.description.replace(
      'Active member',
      `${options.name} is an active member`
    );
  }

  const content = {
    organization: ORGANIZATION,
    experience: template,
    headline: BADGE_TEMPLATES.headline,
    aboutAddition: BADGE_TEMPLATES.aboutAddition,
    announcementPost: BADGE_TEMPLATES.announcementPost,
    dates: {
      startDate: options.since || 'Present',
      endDate: 'Present',
    },
  };

  return content;
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
  --name <name>     Your name (for personalized output)
  --since <date>    When you joined (e.g., "2024" or "January 2024")
  --copy            Copy main content to clipboard
  --json            Output as JSON (for programmatic use)
  --help, -h        Show this help message

EXAMPLES:
  node scripts/linkedin-badge.js
  node scripts/linkedin-badge.js --name "Alex" --since "2024"
  node scripts/linkedin-badge.js --copy
  node scripts/linkedin-badge.js --json

WEBSITE:
  ${ORGANIZATION.website}
`);
}

// Print formatted output
function printOutput(content, options) {
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

  // LinkedIn Experience/Volunteer Section
  console.log(`📋 LINKEDIN EXPERIENCE / VOLUNTEER SECTION
${thinDivider}

Copy these fields into LinkedIn:

TITLE:
  ${content.experience.title}

ORGANIZATION:
  ${content.organization.name}

LOCATION:
  ${content.organization.location}

DATES:
  Start: ${content.dates.startDate}
  End: ${content.dates.endDate} (check "I currently work here")

DESCRIPTION:
${thinDivider}
${content.experience.description}
${thinDivider}

SKILLS TO ADD:
  ${content.experience.skills.join(', ')}
`);

  // LinkedIn Headline
  console.log(`
📝 LINKEDIN HEADLINE SUGGESTION
${thinDivider}
${content.headline}

(Add this to your existing headline, e.g., "Software Engineer | ${ORGANIZATION.name} Community Member")
`);

  // About Section Addition
  console.log(`
📄 LINKEDIN ABOUT SECTION ADDITION
${thinDivider}
Add this to the end of your About section:
${content.aboutAddition}
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

  // Step-by-step instructions
  console.log(`
📖 STEP-BY-STEP INSTRUCTIONS
${thinDivider}

1. ADDING TO EXPERIENCE/VOLUNTEER SECTION:
   a. Go to your LinkedIn profile
   b. Click "Add profile section" 
   c. Choose "Add volunteer experience" (recommended) or "Add position"
   d. Fill in the fields above
   e. Click Save

2. ADDING TO YOUR HEADLINE:
   a. Click the pencil icon on your profile intro
   b. Add "${ORGANIZATION.name} Community Member" to your headline
   c. Click Save

3. UPDATING YOUR ABOUT SECTION:
   a. Click the pencil icon on your About section
   b. Add the suggested text at the end
   c. Click Save

4. SHARING THE ANNOUNCEMENT:
   a. Create a new post on LinkedIn
   b. Copy and paste the announcement text above
   c. Add a photo or the community logo
   d. Post!

Need help? Contact us at ${content.organization.email}
`);

  // Copy to clipboard if requested
  if (options.copy) {
    const mainContent = `Title: ${content.experience.title}
Organization: ${content.organization.name}
Location: ${content.organization.location}
Description:
${content.experience.description}

Skills: ${content.experience.skills.join(', ')}`;

    if (copyToClipboard(mainContent)) {
      console.log(`
✅ Experience section content copied to clipboard!
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
