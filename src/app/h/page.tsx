import { EventsSection } from "../_components/hackathons/events-section";

export default function Hackathons() {
  return (
    <div className="bg-white">
      <section className="py-8 px-6 md:px-12 lg:px-20 border-b border-neutral-600">
        <div className="max-w-6xl mx-auto">
          <div className="border border-neutral-600 bg-neutral-50 p-6">
            <div className="mb-4">
              <h1 className="text-2xl font-medium font-body text-neutral-900 tracking-wide uppercase">
                hackathons
              </h1>
            </div>
            <p className="text-sm text-neutral-700 font-body max-w-2xl leading-relaxed">
              we host our own hackathons, deploy the best builders to compete
              globally, and co-run events with partners:
            </p>
          </div>
        </div>
      </section>
      <EventsSection />
    </div>
  );
}
