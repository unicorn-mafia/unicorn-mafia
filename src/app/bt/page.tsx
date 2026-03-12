type FeatureCardData = {
  title: string;
  description: string;
  iconPath: string;
};

const FEATURE_CARDS: FeatureCardData[] = [
  {
    title: "Support",
    description: "24/7 resolution",
    iconPath:
      "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  },
  {
    title: "Sales",
    description: "Recommend & sell",
    iconPath: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
  },
  {
    title: "Leads",
    description: "Qualify & convert",
    iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

const CHECK_ITEMS = [
  "Remembers full conversation history",
  "No flow builders — live in minutes",
  "98% open rate on WhatsApp · 24/7",
];

function FeatureCard({ title, description, iconPath }: FeatureCardData) {
  return (
    <a
      href="https://wassist.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center p-4 rounded-lg border border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-100/50 transition-colors text-center"
    >
      <span
        className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 mb-2 group-hover:bg-green-200 transition-colors"
        aria-hidden
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={iconPath}
          />
        </svg>
      </span>
      <span className="text-sm font-medium text-gray-800">{title}</span>
      <span className="text-xs text-gray-500 mt-0.5">{description}</span>
    </a>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-green-600"
        aria-hidden
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      {text}
    </li>
  );
}

export default function BigTony() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 my-4">
      <div className="max-w-md w-full">
        <div className="border border-black p-8 md:p-12 text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-title font-medium tracking-tight">
              BIG TONY
            </h1>
            <p className="text-sm md:text-base font-body text-gray-600">
              Unicorn Mafia&apos;s bouncer
            </p>
          </div>

          <a
            href="https://wa.me/447488895960?text=i%27ve%20got%20what%20it%20takes"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-black text-white font-body py-4 px-6 hover:bg-gray-800 transition-colors border border-black"
          >
            MESSAGE ON WHATSAPP
          </a>

          <div className="pt-6 border-t border-gray-200 space-y-6">
            <div className="flex flex-col items-center gap-4">
              <p className="text-base md:text-lg font-body text-gray-500">
                Built with
              </p>
              <a
                href="https://wassist.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  src="https://wassist.app/logo-full.svg"
                  alt="Wassist"
                  className="h-12 md:h-16"
                />
              </a>
              <p className="text-xs font-body text-gray-500">
                By{" "}
                <a
                  href="https://www.linkedin.com/in/joshwarwick/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:underline"
                >
                  Josh Warwick
                </a>
              </p>
            </div>

            <div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {FEATURE_CARDS.map((card) => (
                  <FeatureCard
                    key={card.title}
                    title={card.title}
                    description={card.description}
                    iconPath={card.iconPath}
                  />
                ))}
              </div>
              <ul className="text-left text-sm font-body text-gray-600 space-y-2">
                {CHECK_ITEMS.map((item) => (
                  <CheckItem key={item} text={item} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
