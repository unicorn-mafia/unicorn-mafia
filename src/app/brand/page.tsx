"use client";

import { useState } from "react";
import { BRAND_PALETTE } from "../_lib/consts";

const brandColors = BRAND_PALETTE;

function ColorCard({ color }: { color: (typeof brandColors)[0] }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isLight = color.hex === "#FFFFFF" || color.hex === "#4EF9BD";

  return (
    <div className="border border-black">
      <div
        className="h-24 flex items-end p-3"
        style={{ backgroundColor: color.hex }}
      >
        <span
          className={`font-title text-lg ${
            isLight ? "text-black" : "text-white"
          }`}
        >
          {color.name}
        </span>
      </div>
      <div className="space-y-1 bg-white p-3">
        <button
          onClick={() => copyToClipboard(color.hex)}
          className="-mx-1 block w-full rounded px-1 text-left font-mono text-sm hover:bg-gray-100"
        >
          {copied ? "Copied!" : color.hex}
        </button>
        <div className="font-mono text-xs text-gray-500">{color.rgb}</div>
      </div>
    </div>
  );
}

export default function BrandPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="mb-4 text-4xl font-title font-medium tracking-tight md:text-5xl lg:text-6xl">
            Brand Guidelines
          </h1>
          <p className="font-body text-gray-500">
            Resources and guidelines for using the Unicorn Mafia brand.
          </p>
        </div>

        {/* Logo Construction Grid */}
        <section className="mb-16">
          <h2 className="mb-6 border-b border-black pb-2 text-2xl font-title font-medium">
            Logo Construction
          </h2>
          <div className="mb-6 border border-black">
            <img
              src="/brand/logo-guidelines.png"
              alt="Logo construction guidelines"
              className="w-full"
            />
          </div>
          <div className="space-y-4 text-sm font-body text-gray-600">
            <p>
              The logo lockup combines the unicorn mark with the wordmark.
              Maintain the spacing shown in the grid above.
            </p>
            <p>
              The hatched areas represent the minimum clear space required
              around the logo.
            </p>
          </div>
        </section>

        {/* Logo Mark */}
        <section className="mb-16">
          <h2 className="mb-6 border-b border-black pb-2 text-2xl font-title font-medium">
            Logo Mark
          </h2>
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex items-center justify-center border border-black bg-white p-8">
              <img
                src="/brand/um-black.svg"
                alt="Unicorn Mafia logo black"
                className="h-28"
              />
            </div>

            <div
              className="flex items-center justify-center border border-black p-8"
              style={{ backgroundColor: "#14120B" }}
            >
              <img
                src="/brand/um-white.svg"
                alt="Unicorn Mafia logo white"
                className="h-28"
              />
            </div>
          </div>
          <div className="space-y-4 text-sm font-body text-gray-600">
            <p>
              The Unicorn Mafia logo mark is a pixelated unicorn with a
              rainbow-coloured horn. The horn colours, from base to tip, are:
              Purple, Blue, Green, Red.
            </p>
          </div>
        </section>

        {/* Wordmark */}
        <section className="mb-16">
          <h2 className="mb-6 border-b border-black pb-2 text-2xl font-title font-medium">
            Wordmark
          </h2>
          <div className="mb-6 grid grid-cols-1 gap-6">
            <div className="flex items-center justify-center border border-black bg-white p-8">
              <img
                src="/brand/wm-black.svg"
                alt="Unicorn Mafia wordmark black"
                className="h-12 max-w-full"
              />
            </div>

            <div
              className="flex items-center justify-center border border-black p-8"
              style={{ backgroundColor: "#14120B" }}
            >
              <img
                src="/brand/wm-white.svg"
                alt="Unicorn Mafia wordmark white"
                className="h-12 max-w-full"
              />
            </div>
          </div>
          <div className="space-y-4 text-sm font-body text-gray-600">
            <p>
              The wordmark can be used independently when the logo mark is not
              suitable or when horizontal space is limited.
            </p>
          </div>
        </section>

        {/* Colors */}
        <section className="mb-16">
          <h2 className="mb-6 border-b border-black pb-2 text-2xl font-title font-medium">
            Colors
          </h2>
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {brandColors.map((color) => (
              <ColorCard key={color.hex} color={color} />
            ))}
          </div>
          <div className="space-y-4 text-sm font-body text-gray-600">
            <p>
              The primary brand colours are derived from the unicorn horn
              gradient. Use these colours sparingly for accents and highlights.
            </p>
            <p>
              Black and white are the primary colours for text and backgrounds.
              The dark background (#14120B) is used for the footer section.
            </p>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-16">
          <h2 className="mb-6 border-b border-black pb-2 text-2xl font-title font-medium">
            Typography
          </h2>
          <div className="space-y-8">
            <div className="border border-black p-6">
              <div className="mb-2 font-mono text-xs text-gray-500">
                PP Neue Bit — Headings
              </div>
              <div className="text-4xl font-title tracking-tight md:text-5xl">
                UNICORN MAFIA
              </div>
              <div className="mt-2 text-2xl font-title">
                Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm
              </div>
              <div className="text-2xl font-title">
                Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
              </div>
              <div className="text-2xl font-title">0 1 2 3 4 5 6 7 8 9</div>
            </div>
            <div className="border border-black p-6">
              <div className="mb-2 font-mono text-xs text-gray-500">
                PP Neue Montreal Mono — Body
              </div>
              <div className="text-lg font-body">
                The quick brown fox jumps over the lazy dog.
              </div>
              <div className="mt-2 text-base font-body">
                Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu
                Vv Ww Xx Yy Zz
              </div>
              <div className="text-base font-body">0 1 2 3 4 5 6 7 8 9</div>
            </div>
          </div>
          <div className="mt-6 space-y-4 text-sm font-body text-gray-600">
            <p>
              <strong>PP Neue Bit Bold</strong> — Used for all headings,
              navigation, and display text. Bold, pixelated aesthetic.
            </p>
            <p>
              <strong>PP Neue Montreal Mono</strong> — Used for body text, UI
              elements, and technical content. Clean and readable.
            </p>
          </div>
        </section>

        {/* Downloads */}
        <section className="mb-16">
          <h2 className="mb-6 border-b border-black pb-2 text-2xl font-title font-medium">
            Downloads
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <a
              href="/brand/um-black.svg"
              download
              className="flex items-center justify-between border border-black p-4 transition-colors hover:bg-gray-50"
            >
              <span className="font-body">Logo Mark — Black (SVG)</span>
              <span className="font-mono text-sm text-gray-500">↓</span>
            </a>
            <a
              href="/brand/um-white.svg"
              download
              className="flex items-center justify-between border border-black p-4 transition-colors hover:bg-gray-50"
            >
              <span className="font-body">Logo Mark — White (SVG)</span>
              <span className="font-mono text-sm text-gray-500">↓</span>
            </a>
            <a
              href="/brand/wm-black.svg"
              download
              className="flex items-center justify-between border border-black p-4 transition-colors hover:bg-gray-50"
            >
              <span className="font-body">Wordmark — Black (SVG)</span>
              <span className="font-mono text-sm text-gray-500">↓</span>
            </a>
            <a
              href="/brand/wm-white.svg"
              download
              className="flex items-center justify-between border border-black p-4 transition-colors hover:bg-gray-50"
            >
              <span className="font-body">Wordmark — White (SVG)</span>
              <span className="font-mono text-sm text-gray-500">↓</span>
            </a>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="mb-16">
          <h2 className="mb-6 border-b border-black pb-2 text-2xl font-title font-medium">
            Usage Guidelines
          </h2>
          <div className="space-y-4 text-sm font-body text-gray-600">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-lg font-title text-black">Do</h3>
                <ul className="list-inside list-disc space-y-1">
                  <li>Use the logo on white or dark backgrounds</li>
                  <li>Maintain the coloured horn in all versions</li>
                  <li>Keep the pixel aesthetic intact</li>
                  <li>Use official brand colours for accents</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-title text-black">
                  Don&apos;t
                </h3>
                <ul className="list-inside list-disc space-y-1">
                  <li>Stretch or distort the logo</li>
                  <li>Change the horn colours or order</li>
                  <li>Add effects like shadows or gradients</li>
                  <li>Use on busy or low-contrast backgrounds</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Use for Members & Partners */}
        <section className="mb-16">
          <h2 className="mb-6 border-b border-black pb-2 text-2xl font-title font-medium">
            Our Brand Kit: For Members & Partners
          </h2>

          <div className="space-y-6 text-sm font-body text-gray-600">
            <div>
              <h3 className="mb-2 text-lg font-title text-black">
                Ways to Rep the Unicorn Mafia
              </h3>
              <ul className="list-inside list-disc space-y-2">
                <li>
                  Mention Unicorn Mafia in your bio, LinkedIn, or personal
                  website (for example: “Mafioso” or “Unicorn”).
                </li>
                <li>
                  Reference Unicorn Mafia when talking about events you’ve
                  attended or projects you’ve built within the community.
                </li>
                <li>Invite exceptionally strong developers to join the Mafia.</li>
                <li>
                  Tag @UnicornMafia in hackathon posts, project announcements,
                  or when you’ve built something cool.
                </li>
                <li>
                  Reach out if you have a partnership, collaboration, or event
                  idea you’d like to explore with us.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-title text-black">
                Things We&apos;d Need to Chat About First
              </h3>
              <ul className="list-inside list-disc space-y-2">
                <li>
                  Printing the Unicorn Mafia name or logo on physical
                  merchandise, including t-shirts, stickers, hoodies, or event
                  materials.
                </li>
                <li>
                  Using the Unicorn Mafia name or logo in any commercial
                  context, product, or promotional material.
                </li>
                <li>
                  Co-branding anything as “in partnership with Unicorn Mafia”
                  or similar.
                </li>
                <li>
                  Reproducing brand assets in any form for distribution.
                </li>
                <li>
                  Acting as an official representative or spokesperson for
                  Unicorn Mafia.
                </li>
              </ul>
            </div>

            <div className="border border-black bg-gray-50 p-4">
              <p className="text-sm font-body text-black">
                If you&apos;re unsure, just ask. Reach us at{" "}
                <a
                  href="mailto:stable@unicornmafia.ai"
                  className="underline hover:text-black"
                >
                  stable@unicornmafia.ai
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Legal */}
        <section>
          <h2 className="mb-6 border-b border-black pb-2 text-2xl font-title font-medium">
            Legal
          </h2>

          <div className="space-y-4 text-sm font-body text-gray-600">
            <p>
              The Unicorn Mafia name, logo, and associated brand assets are the
              intellectual property of Unicorn Mafia. All rights reserved.
            </p>
            <p>
              Unauthorised use of the Unicorn Mafia brand, including
              reproduction, distribution, or commercial use of the name or logo
              without prior written consent, is not permitted. This applies to
              both digital and physical use.
            </p>
            <p>
              Nothing in these guidelines grants you a licence to use the
              Unicorn Mafia brand beyond what is described above. Any permitted
              use must accurately represent your relationship with the community
              and must not imply official endorsement without explicit
              agreement.
            </p>
            <p>
              We reserve the right to revoke permission at any time. If you
              become aware of misuse of the brand, please let us know at{" "}
              <a
                href="mailto:stable@unicornmafia.ai"
                className="underline hover:text-black"
              >
                stable@unicornmafia.ai
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}