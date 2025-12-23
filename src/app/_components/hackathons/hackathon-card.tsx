"use client";

import React from "react";
import type { HackathonWinWithCategory } from "../../_types/hackathons";

interface HackathonCardProps {
  win: HackathonWinWithCategory;
}

export function HackathonCard({ win }: HackathonCardProps) {
  // Extract post ID from LinkedIn URL
  const getLinkedInPostId = (url: string) => {
    const match = url.match(/activity-(\d+)/);
    return match ? match[1] : null;
  };

  const postId = getLinkedInPostId(win.linkedin_url);

  return (
    <div className="aspect-square border border-neutral-600 bg-neutral-50 overflow-hidden">
      {postId ? (
        <iframe
          src={`https://www.linkedin.com/embed/feed/update/urn:li:activity:${postId}`}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          title="LinkedIn Post"
        />
      ) : (
        <a
          href={win.linkedin_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center h-full p-4 hover:bg-neutral-100 transition-colors"
        >
          <span className="text-xs font-body text-neutral-700 text-center">
            VIEW ON LINKEDIN
          </span>
        </a>
      )}
    </div>
  );
}
