import Image from "next/image";

interface Sponsor {
  name: string;
  logo: string;
  href: string;
  label?: string;
  labelColor?: string;
  logoSize?: string; // tailwind max-w class override
}

const sponsors: Sponsor[] = [
  // ── Labelled — top row ────────────────────────────────────────────────────
  {
    name: "60x",
    logo: "/sponsors/60x.svg",
    href: "https://60x.ai",
    label: "headline sponsor",
    labelColor: "#B307EB",
  },
  {
    name: "Wassist",
    logo: "/sponsors/wassist.svg",
    href: "https://wassist.app",
    label: "Big Tony",
    labelColor: "#EE1701",
  },
  {
    name: "Halkin",
    logo: "/companies/halkin.svg",
    href: "https://www.halkin.com",
    label: "stable sponsor",
    labelColor: "#3198F1",
  },
  {
    name: "Mubit",
    logo: "/sponsors/mubit2.png",
    href: "https://mubit.co.uk",
  },
  // ── Unlabelled ────────────────────────────────────────────────────────────
  {
    name: "Pydantic",
    logo: "/sponsors/pydantic2.png",
    href: "https://pydantic.dev",
    logoSize: "max-w-full max-h-[240px]",
  },
  {
    name: "ElevenLabs",
    logo: "/elevenlabs-logo.svg",
    href: "https://elevenlabs.io",
  },
  {
    name: "Render",
    logo: "/sponsors/render.png",
    href: "https://render.com",
    logoSize: "max-w-full max-h-[140px]",
  },
  {
    name: "Expedite",
    logo: "/sponsors/expedite.png",
    href: "https://expedite.com",
    logoSize: "max-w-full max-h-[140px]",
  },
  {
    name: "Cognition AI",
    logo: "/sponsors/cognition.png",
    href: "https://cognition.ai",
  },
];

export default function SponsorsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="py-10 px-6 md:px-12 lg:px-20 border-b border-neutral-200">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-title text-4xl sm:text-5xl tracking-tight text-neutral-900 mb-3">
            sponsors
          </h1>
          <p className="font-mono text-sm text-neutral-500 max-w-xl leading-relaxed">
            The companies that back our mission.{" "}
            <a
              href="mailto:hello@unicornmafia.dev"
              className="text-neutral-900 underline underline-offset-2"
            >
              Get in touch
            </a>
            .
          </p>
        </div>
      </section>

      {/* Sponsor grid — equal squares */}
      <section className="py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-neutral-200">
            {sponsors.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white flex flex-col items-center justify-center gap-3 aspect-square p-8 hover:bg-neutral-50 transition-colors duration-150"
              >
                {s.label && (
                  <span
                    className="absolute top-3 left-3 font-title text-[11px] tracking-widest uppercase leading-none px-2.5 py-1.5"
                    style={{
                      color: s.labelColor,
                      background: `${s.labelColor}18`,
                      border: `1px solid ${s.labelColor}50`,
                    }}
                  >
                    {s.label}
                  </span>
                )}
                <Image
                  src={s.logo}
                  alt={s.name}
                  width={200}
                  height={80}
                  className={`w-full h-auto object-contain opacity-75 group-hover:opacity-100 transition-opacity duration-200 ${s.logoSize ?? "max-w-[150px] max-h-[64px]"}`}
                />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
