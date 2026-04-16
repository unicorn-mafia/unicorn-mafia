import TeamDeckSection from "../_components/team-deck/team-section";

export default function TeamPage() {
  return (
    <div className="bg-white">
      <section className="py-8 px-6 md:px-12 lg:px-20 border-b border-neutral-600">
        <div className="max-w-6xl mx-auto">
          <div className="border border-neutral-600 bg-neutral-50 p-6">
            <div className="mb-4">
              <h1 className="text-2xl font-medium font-body text-neutral-900 tracking-wide uppercase">
                team
              </h1>
            </div>
            <p className="text-sm text-neutral-700 font-body max-w-2xl leading-relaxed">
              the <span className="uppercase">unicorn mafia</span> core team in
              trading-card form.
            </p>
          </div>
        </div>
      </section>

      <TeamDeckSection />
    </div>
  );
}
