import { MapPin, Star, Phone } from "lucide-react";

const STEPS = [
  {
    icon: MapPin,
    title: "Tell us where you are",
    body: "Enter your postcode or use your current location to find local pros nearby.",
  },
  {
    icon: Star,
    title: "Compare real ratings",
    body: "See genuine Google reviews and 5-star ratings so you can pick with confidence.",
  },
  {
    icon: Phone,
    title: "Contact directly",
    body: "Call, message or visit their website — no fees, no middlemen.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-slate-50 border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700 mb-2">
            How it works
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            Three steps to a trusted local pro
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-8">
          {STEPS.map((s) => (
            <div key={s.title} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-700 mb-4">
                <s.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {s.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
