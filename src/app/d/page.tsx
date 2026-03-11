import Image from "next/image";
import ContactForm from "@/components/contact-form";

export default function Demos() {
  const demoEvents = [
    {
      name: "chapter 1",
      date: "jan 2025",
      location: "kings cross",
      stamp: "/demos/chapter1-stamp.png",
      link: "/d/1",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-10">
          <h1 className="text-2xl font-medium font-title tracking-tight mb-8">
            demo nights & demo days
          </h1>
          <div className="space-y-4 text-neutral-600 text-[15px] leading-relaxed font-body">
            <p>
              curated events we run for developers from our community in london
              and sf, bi-monthly. generally open to the public and catered for
              any developer or technical person who wants to learn from some of
              the best people out there.
            </p>
            <p>
              the goal is simple - inspire more people to build and keep up with
              the latest trends and hacks in tech. think of it as bringing your
              x feed into a curated room.
            </p>
            <p>cool shit, real builders, no fluff.</p>
          </div>
        </div>

        <div className="border-t border-black/10 pt-8">
          <p className="text-neutral-500 text-sm mb-6">past events 👇</p>

          <div className="flex flex-wrap gap-6">
            {demoEvents.map((event) => (
              <a
                key={event.name}
                href={event.link}
                className="group inline-block"
              >
                <Image
                  src={event.stamp}
                  alt={event.name}
                  width={120}
                  height={120}
                  className="w-[120px] transition-opacity group-hover:opacity-80"
                />
                <div className="mt-2 leading-tight">
                  <p className="text-sm text-neutral-600 transition-colors group-hover:text-black">
                    {event.name}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">{event.date}</p>
                  {event.location ? (
                    <p className="text-xs text-neutral-400">{event.location}</p>
                  ) : null}
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-black/10">
          <p className="text-neutral-500 text-sm">
            want to demo?{" "}
            <ContactForm>
              <button className="text-neutral-600 hover:text-black transition-colors cursor-pointer">
                reach out
              </button>
            </ContactForm>
          </p>
        </div>
      </div>
    </div>
  );
}
