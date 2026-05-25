export default function HowItWorks() {
  const steps = [
    {
      emoji: "📍",
      title: "Tell us where you are",
      body: "Enter your postcode or use your current location to find local pros nearby.",
    },
    {
      emoji: "⭐",
      title: "Compare real ratings",
      body: "See genuine Google reviews and 5-star ratings so you can pick with confidence.",
    },
    {
      emoji: "📞",
      title: "Contact directly",
      body: "Call, message or visit their website — no fees, no middlemen.",
    },
  ];
  return (
    <section className="bg-slate-50 border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 text-center mb-12">
          How it works
        </h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.title} className="text-center">
              <div className="text-4xl mb-3">{s.emoji}</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {s.title}
              </h3>
              <p className="text-slate-600">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
