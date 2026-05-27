import FindBusinessClient from "@/components/FindBusinessClient";

export const metadata = {
  title: "Find a business — HERD",
  description:
    "Search for a specific UK pet, equine or rural business on HERD by name. If it's on Google, it's on HERD.",
};

export default function FindPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="text-center mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-700 mb-2">
          Find a business
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Search by business name
        </h1>
        <p className="mt-3 text-slate-600 leading-relaxed">
          Looking for a specific pet sitter, dog walker, farrier or rural
          service? Type their name. Add a postcode to narrow it down if
          two businesses share the same name.
        </p>
      </header>
      <FindBusinessClient />
    </div>
  );
}
