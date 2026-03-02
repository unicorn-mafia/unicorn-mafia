'use client'
import { useState } from 'react'
import { BRAND_PALETTE } from '../_lib/consts'

const brandColors = BRAND_PALETTE

function ColorCard({ color }: { color: typeof brandColors[0] }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const isLight = color.hex === '#FFFFFF' || color.hex === '#4EF9BD'

  return (
    <div className="border border-black">
      <div
        className="h-24 flex items-end p-3"
        style={{ backgroundColor: color.hex }}
      >
        <span className={`font-title text-lg ${isLight ? 'text-black' : 'text-white'}`}>
          {color.name}
        </span>
      </div>
      <div className="p-3 bg-white space-y-1">
        <button
          onClick={() => copyToClipboard(color.hex)}
          className="block w-full text-left font-mono text-sm hover:bg-gray-100 px-1 -mx-1 rounded"
        >
          {copied ? 'Copied!' : color.hex}
        </button>
        <div className="font-mono text-xs text-gray-500">{color.rgb}</div>
      </div>
    </div>
  )
}

export default function BrandPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-title font-medium tracking-tight mb-4">
            Brand Guidelines
          </h1>
          <p className="text-gray-500 font-body">
            Resources and guidelines for using the Unicorn Mafia brand.
          </p>
        </div>

        {/* Logo Construction Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-title font-medium mb-6 pb-2 border-b border-black">
            Logo Construction
          </h2>
          <div className="border border-black mb-6">
            <img
              src="/brand/logo-guidelines.png"
              alt="Logo construction guidelines"
              className="w-full"
            />
          </div>
          <div className="space-y-4 text-sm font-body text-gray-600">
            <p>The logo lockup combines the unicorn mark with the wordmark. Maintain the spacing shown in the grid above.</p>
            <p>The hatched areas represent the minimum clear space required around the logo.</p>
          </div>
        </section>

        {/* Logo Mark */}
        <section className="mb-16">
          <h2 className="text-2xl font-title font-medium mb-6 pb-2 border-b border-black">
            Logo Mark
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border border-black p-8 flex items-center justify-center bg-white">
              <img src="/brand/um-black.svg" alt="Unicorn Mafia logo black" className="h-28" />
            </div>
            <div className="border border-black p-8 flex items-center justify-center" style={{ backgroundColor: '#14120B' }}>
              <img src="/brand/um-white.svg" alt="Unicorn Mafia logo white" className="h-28" />
            </div>
          </div>
          <div className="space-y-4 text-sm font-body text-gray-600">
            <p>The Unicorn Mafia logo mark is a pixelated unicorn with a rainbow-colored horn. The horn colors (from base to tip) are: Purple, Blue, Green, Red.</p>
          </div>
        </section>

        {/* Wordmark */}
        <section className="mb-16">
          <h2 className="text-2xl font-title font-medium mb-6 pb-2 border-b border-black">
            Wordmark
          </h2>
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div className="border border-black p-8 flex items-center justify-center bg-white">
              <img src="/brand/wm-black.svg" alt="Unicorn Mafia wordmark black" className="h-12 max-w-full" />
            </div>
            <div className="border border-black p-8 flex items-center justify-center" style={{ backgroundColor: '#14120B' }}>
              <img src="/brand/wm-white.svg" alt="Unicorn Mafia wordmark white" className="h-12 max-w-full" />
            </div>
          </div>
          <div className="space-y-4 text-sm font-body text-gray-600">
            <p>The wordmark can be used independently when the logo mark is not suitable or when horizontal space is limited.</p>
          </div>
        </section>

        {/* Colors */}
        <section className="mb-16">
          <h2 className="text-2xl font-title font-medium mb-6 pb-2 border-b border-black">
            Colors
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {brandColors.map((color) => (
              <ColorCard key={color.hex} color={color} />
            ))}
          </div>
          <div className="space-y-4 text-sm font-body text-gray-600">
            <p>The primary brand colors are derived from the unicorn horn gradient. Use these colors sparingly for accents and highlights.</p>
            <p>Black and white are the primary colors for text and backgrounds. The dark background (#14120B) is used for the footer section.</p>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-16">
          <h2 className="text-2xl font-title font-medium mb-6 pb-2 border-b border-black">
            Typography
          </h2>
          <div className="space-y-8">
            <div className="border border-black p-6">
              <div className="text-xs font-mono text-gray-500 mb-2">PP Neue Bit — Headings</div>
              <div className="font-title text-4xl md:text-5xl tracking-tight">
                UNICORN MAFIA
              </div>
              <div className="font-title text-2xl mt-2">
                Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm
              </div>
              <div className="font-title text-2xl">
                Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
              </div>
              <div className="font-title text-2xl">
                0 1 2 3 4 5 6 7 8 9
              </div>
            </div>
            <div className="border border-black p-6">
              <div className="text-xs font-mono text-gray-500 mb-2">PP Neue Montreal Mono — Body</div>
              <div className="font-body text-lg">
                The quick brown fox jumps over the lazy dog.
              </div>
              <div className="font-body text-base mt-2">
                Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
              </div>
              <div className="font-body text-base">
                0 1 2 3 4 5 6 7 8 9
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-4 text-sm font-body text-gray-600">
            <p><strong>PP Neue Bit Bold</strong> — Used for all headings, navigation, and display text. Bold, pixelated aesthetic.</p>
            <p><strong>PP Neue Montreal Mono</strong> — Used for body text, UI elements, and technical content. Clean and readable.</p>
          </div>
        </section>

        {/* Downloads */}
        <section className="mb-16">
          <h2 className="text-2xl font-title font-medium mb-6 pb-2 border-b border-black">
            Downloads
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/brand/um-black.svg"
              download
              className="border border-black p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <span className="font-body">Logo Mark — Black (SVG)</span>
              <span className="font-mono text-sm text-gray-500">↓</span>
            </a>
            <a
              href="/brand/um-white.svg"
              download
              className="border border-black p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <span className="font-body">Logo Mark — White (SVG)</span>
              <span className="font-mono text-sm text-gray-500">↓</span>
            </a>
            <a
              href="/brand/wm-black.svg"
              download
              className="border border-black p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <span className="font-body">Wordmark — Black (SVG)</span>
              <span className="font-mono text-sm text-gray-500">↓</span>
            </a>
            <a
              href="/brand/wm-white.svg"
              download
              className="border border-black p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <span className="font-body">Wordmark — White (SVG)</span>
              <span className="font-mono text-sm text-gray-500">↓</span>
            </a>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="mb-16">
          <h2 className="text-2xl font-title font-medium mb-6 pb-2 border-b border-black">
            Usage Guidelines
          </h2>
          <div className="space-y-4 text-sm font-body text-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-title text-lg text-black mb-2">Do</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Use the logo on white or dark backgrounds</li>
                  <li>Maintain the colored horn in all versions</li>
                  <li>Keep the pixel aesthetic intact</li>
                  <li>Use official brand colors for accents</li>
                </ul>
              </div>
              <div>
                <h3 className="font-title text-lg text-black mb-2">Don't</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Stretch or distort the logo</li>
                  <li>Change the horn colors or order</li>
                  <li>Add effects like shadows or gradients</li>
                  <li>Use on busy or low-contrast backgrounds</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* For Members & Partners + Legal */}
        <section className="mb-16">
          <h2 className="text-2xl font-title font-medium mb-6 pb-2 border-b border-black">
            For Members & Partners
          </h2>
          <div className="space-y-6 text-sm font-body text-gray-600">
            <p>
              We love having you in the community — and we’d like to make it simple for you to show that. Here’s a clear guide on how members and partners can use the Unicorn Mafia name and brand.
            </p>

            <div>
              <h3 className="font-title text-base text-black mb-2">What's generally fine</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Mentioning Unicorn Mafia in your bio, LinkedIn, or personal website (e.g. "Member of Unicorn Mafia")</li>
                <li>Referencing Unicorn Mafia when talking about events you've attended or projects you've built within the community / as a member of the community</li>
              </ul>
            </div>

            <div>
              <h3 className="font-title text-base text-black mb-2">What's encouraged</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Inviting uber-cracked devs to join the mafia!</li>
                <li>Tagging @UnicornMafia in your hackathon posts, project announcements, or wins when you've built something cool</li>
              </ul>
            </div>

            <div>
              <h3 className="font-title text-base text-black mb-2">What requires permission first</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Printing the Unicorn Mafia name or logo on any physical merchandise — including t-shirts, stickers, hoodies, or event materials</li>
                <li>Using the logo or name in any commercial context, product, or promotional material</li>
                <li>Co-branding anything as "in partnership with Unicorn Mafia" or similar</li>
                <li>Reproducing brand assets in any form for distribution</li>
                <li>Acting as an official representative or spokesperson for Unicorn Mafia</li>
              </ul>
            </div>

            <div className="border border-black p-4 bg-gray-50">
              <p className="text-black font-body text-sm">
                <strong>If you're unsure, just ask.</strong><br />
                Reach out to <a href="mailto:stable@unicrnmafia.com" className="underline hover:text-black">stable@unicrnmafia.com</a> and we'll get back to you quickly. We're generally very supportive of members representing the community — we just want to be in the loop.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-title font-medium mb-6 pb-2 border-b border-black">
            Legal
          </h2>
          <div className="space-y-4 text-sm font-body text-gray-600">
            <p>
              The Unicorn Mafia name, logo, and associated brand assets are the intellectual property of Unicorn Mafia. All rights reserved.
            </p>
            <p>
              Unauthorised use of the Unicorn Mafia brand — including reproduction, distribution, or commercial use of the name or logo without prior written consent — is not permitted. This applies to both digital and physical use.
            </p>
            <p>
              Nothing in these guidelines grants you a licence to use the Unicorn Mafia brand beyond what is described above. Any permitted use must accurately represent your relationship with the community and must not imply official endorsement without explicit agreement.
            </p>
            <p>
              We reserve the right to revoke permission at any time. If you become aware of misuse of the brand, please let us know at <a href="mailto:stable@unicrnmafia.com" className="underline hover:text-black">stable@unicrnmafia.com</a>.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
