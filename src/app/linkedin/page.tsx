'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ORGANIZATION = {
  name: 'Unicorn Mafia',
  headline: 'The highest signal community of developers in London',
  website: 'https://unicrnmafia.com',
  location: 'London, United Kingdom',
  email: 'stable@unicrnmafia.com',
};

/**
 * Generate LinkedIn Add to Profile URL
 * Uses LinkedIn's official certification add-to-profile feature
 */
function generateLinkedInUrl(year?: number, month?: number): string {
  const currentDate = new Date();
  const issueYear = year || currentDate.getFullYear();
  const issueMonth = month || currentDate.getMonth() + 1;
  
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: 'Community Member',
    organizationName: ORGANIZATION.name,
    issueYear: issueYear.toString(),
    issueMonth: issueMonth.toString(),
    certUrl: ORGANIZATION.website,
  });
  
  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

const BADGE_CONTENT = {
  title: 'Community Member',
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
  aboutAddition: `🦄 Proud member of ${ORGANIZATION.name} - ${ORGANIZATION.headline}.

Learn more: ${ORGANIZATION.website}`,
  announcementPost: `🦄 Excited to be part of ${ORGANIZATION.name}!

${ORGANIZATION.headline} - a community of 500+ developers with:
✨ 500+ hackathon wins
🚀 30+ companies being built
🤝 Incredible collaborative energy

If you're building something cool in London, come join us!

#UnicornMafia #LondonTech #DeveloperCommunity #Hackathons

${ORGANIZATION.website}`,
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="px-4 py-2 text-sm border border-black bg-white hover:bg-black hover:text-white transition-colors duration-200 font-medium"
    >
      {copied ? '✓ Copied!' : label}
    </button>
  );
}

function ContentSection({
  title,
  children,
  copyText,
}: {
  title: string;
  children: React.ReactNode;
  copyText?: string;
}) {
  return (
    <div className="border border-black p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        {copyText && <CopyButton text={copyText} label="Copy" />}
      </div>
      {children}
    </div>
  );
}

export default function LinkedInBadgePage() {
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [joinYear, setJoinYear] = useState<number>(new Date().getFullYear());
  const [joinMonth, setJoinMonth] = useState<number>(new Date().getMonth() + 1);

  useEffect(() => {
    setLinkedInUrl(generateLinkedInUrl(joinYear, joinMonth));
  }, [joinYear, joinMonth]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="min-h-screen p-8 md:p-12 lg:p-16">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-sm hover:underline mb-4 inline-block">
          ← Back to Home
        </Link>
        <div className="flex items-center gap-6 mb-6">
          <Image
            src="/brand/um-black.svg"
            alt="Unicorn Mafia Logo"
            width={80}
            height={80}
            className="w-20 h-20"
          />
          <div>
            <h1 className="font-title text-4xl md:text-5xl lg:text-6xl">
              LinkedIn Badge
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Add Unicorn Mafia to your LinkedIn profile
            </p>
          </div>
        </div>
      </div>

      {/* Main CTA - Add to LinkedIn Button */}
      <div className="mb-12 p-8 border-2 border-black bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">One-Click Add to LinkedIn</h2>
        <p className="text-gray-600 mb-6">
          Click the button below to instantly add your Unicorn Mafia community membership to your LinkedIn profile.
        </p>
        
        {/* Date Selection */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              When did you join?
            </label>
            <div className="flex gap-2">
              <select
                value={joinMonth}
                onChange={(e) => setJoinMonth(parseInt(e.target.value))}
                className="px-3 py-2 border border-black bg-white text-sm"
              >
                {months.map((month, idx) => (
                  <option key={month} value={idx + 1}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                value={joinYear}
                onChange={(e) => setJoinYear(parseInt(e.target.value))}
                className="px-3 py-2 border border-black bg-white text-sm"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Big Add Button */}
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#0A66C2] text-white text-lg font-bold hover:bg-[#004182] transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          Add to LinkedIn
        </a>

        <p className="text-sm text-gray-500 mt-4">
          This will open LinkedIn and pre-fill your community membership details.
        </p>
      </div>

      {/* Introduction */}
      <div className="mb-12 max-w-3xl">
        <p className="text-lg leading-relaxed">
          Alternatively, you can manually add content to your profile. Copy the content below to add as a 
          <strong> Volunteer Experience</strong>, update your <strong>Headline</strong>, or share an <strong>Announcement Post</strong>.
        </p>
      </div>

      {/* Volunteer/Experience Section */}
      <ContentSection
        title="1. LinkedIn Experience / Volunteer Section"
        copyText={`Title: ${BADGE_CONTENT.title}\nOrganization: ${ORGANIZATION.name}\nLocation: ${ORGANIZATION.location}\nDescription:\n${BADGE_CONTENT.description}`}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Title</p>
              <p className="font-medium">{BADGE_CONTENT.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Organization</p>
              <p className="font-medium">{ORGANIZATION.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Location</p>
              <p className="font-medium">{ORGANIZATION.location}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Dates</p>
              <p className="font-medium">Present (check &quot;I currently volunteer here&quot;)</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
            <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 border border-gray-200 font-body">
              {BADGE_CONTENT.description}
            </pre>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Skills to Add</p>
            <div className="flex flex-wrap gap-2">
              {BADGE_CONTENT.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-sm border border-black bg-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Step by step */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-500 mb-2">How to add:</p>
          <ol className="text-sm space-y-1 text-gray-600 list-decimal list-inside">
            <li>Go to your LinkedIn profile</li>
            <li>Click &quot;Add profile section&quot;</li>
            <li>Select &quot;Add volunteer experience&quot;</li>
            <li>Fill in the fields above</li>
            <li>Click Save</li>
          </ol>
        </div>
      </ContentSection>

      {/* Headline Section */}
      <ContentSection
        title="2. LinkedIn Headline"
        copyText={`${ORGANIZATION.name} Community Member`}
      >
        <p className="text-sm text-gray-600 mb-2">
          Add this to your existing headline:
        </p>
        <p className="font-medium bg-gray-100 p-4 border border-gray-200">
          {ORGANIZATION.name} Community Member
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Example: &quot;Software Engineer | {ORGANIZATION.name} Community Member&quot;
        </p>
      </ContentSection>

      {/* About Section */}
      <ContentSection
        title="3. About Section Addition"
        copyText={BADGE_CONTENT.aboutAddition}
      >
        <p className="text-sm text-gray-600 mb-2">
          Add this to the end of your About section:
        </p>
        <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 border border-gray-200 font-body">
          {BADGE_CONTENT.aboutAddition}
        </pre>
      </ContentSection>

      {/* Announcement Post */}
      <ContentSection
        title="4. Announcement Post"
        copyText={BADGE_CONTENT.announcementPost}
      >
        <p className="text-sm text-gray-600 mb-2">
          Share this post to announce you&apos;ve joined:
        </p>
        <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 border border-gray-200 font-body">
          {BADGE_CONTENT.announcementPost}
        </pre>
      </ContentSection>

      {/* Logo Download */}
      <ContentSection title="5. Download Logo">
        <p className="text-sm text-gray-600 mb-4">
          Download our logo to use on your profile or in posts:
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="/brand/um-black.svg"
            download="unicorn-mafia-logo-black.svg"
            className="flex items-center gap-3 px-4 py-3 border border-black hover:bg-black hover:text-white transition-colors"
          >
            <Image
              src="/brand/um-black.svg"
              alt="Black Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-sm font-medium">Download Black Logo</span>
          </a>
          <a
            href="/brand/um-white.svg"
            download="unicorn-mafia-logo-white.svg"
            className="flex items-center gap-3 px-4 py-3 border border-black bg-black text-white hover:bg-white hover:text-black transition-colors"
          >
            <Image
              src="/brand/um-white.svg"
              alt="White Logo"
              width={32}
              height={32}
              className="w-8 h-8 invert"
            />
            <span className="text-sm font-medium">Download White Logo</span>
          </a>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          See all brand assets on our{' '}
          <Link href="/brand" className="underline hover:no-underline">
            Brand Guidelines
          </Link>{' '}
          page.
        </p>
      </ContentSection>

      {/* CLI Tool */}
      <div className="border border-dashed border-gray-400 p-6 bg-gray-50">
        <h3 className="text-lg font-bold mb-2">For Developers: CLI Tool</h3>
        <p className="text-sm text-gray-600 mb-4">
          Prefer the command line? Clone our repo and run:
        </p>
        <pre className="bg-black text-green-400 p-4 text-sm overflow-x-auto">
          <code>
            {`git clone https://github.com/unicorn-mafia/unicorn-mafia.git
cd unicorn-mafia
node scripts/linkedin-badge.js --open  # Opens LinkedIn directly!`}
          </code>
        </pre>
        <p className="text-sm text-gray-500 mt-4">
          Options: <code className="bg-gray-200 px-1">--open</code>{' '}
          <code className="bg-gray-200 px-1">--url-only</code>{' '}
          <code className="bg-gray-200 px-1">--year</code>{' '}
          <code className="bg-gray-200 px-1">--month</code>{' '}
          <code className="bg-gray-200 px-1">--copy</code>{' '}
          <code className="bg-gray-200 px-1">--json</code>
        </p>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Questions? Contact us at{' '}
          <a
            href={`mailto:${ORGANIZATION.email}`}
            className="underline hover:no-underline"
          >
            {ORGANIZATION.email}
          </a>
        </p>
      </div>
    </div>
  );
}
