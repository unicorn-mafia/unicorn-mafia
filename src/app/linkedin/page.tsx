'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ORGANIZATION = {
  name: 'Unicorn Mafia',
  headline: 'The highest signal community of developers in London',
  website: 'https://unicrnmafia.com',
  location: 'London, United Kingdom',
  email: 'stable@unicrnmafia.com',
};

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
  return (
    <div className="min-h-screen p-8 md:p-12 lg:p-16">
      {/* Header */}
      <div className="mb-12">
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

      {/* Introduction */}
      <div className="mb-12 max-w-3xl">
        <p className="text-lg leading-relaxed">
          Show your Unicorn Mafia membership on LinkedIn! Copy the content below to add to your 
          profile. You can add it as a <strong>Volunteer Experience</strong>, update your 
          <strong> Headline</strong>, or share an <strong>Announcement Post</strong>.
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
node scripts/linkedin-badge.js --help`}
          </code>
        </pre>
        <p className="text-sm text-gray-500 mt-4">
          Options: <code className="bg-gray-200 px-1">--name</code>{' '}
          <code className="bg-gray-200 px-1">--since</code>{' '}
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
