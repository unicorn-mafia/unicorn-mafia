export default function Chapter1() {
  const demos = [
    { name: "lewis" },
    { name: "louis" },
    { name: "matt" },
    { name: "peter" },
    { name: "charlie" },
    { name: "ben" },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-10">
          <h1 className="text-2xl font-medium font-title tracking-tight mb-2">
            chapter 1
          </h1>
          <p className="text-neutral-500 text-sm font-body">jan 2025</p>
        </div>

        <div className="border-t border-black/10 pt-8">
          <p className="text-neutral-500 text-sm mb-6">demos 👇</p>

          <div className="space-y-3">
            {demos.map((demo) => (
              <div
                key={demo.name}
                className="text-lg font-body text-neutral-700 hover:text-black transition-colors"
              >
                {demo.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
