export default function SplashLoader() {
  return (
    <section className="flex flex-1 items-center justify-center rounded-2xl border border-black/10 bg-white">
      <div className="text-center">
        <p className="text-sm tracking-[0.22em] text-amber-500">GATY WEAR</p>
        <h2 className="mt-2 text-2xl font-bold text-primary">جاتي وير</h2>
        <div className="mx-auto mt-4 h-1 w-24 overflow-hidden rounded-full bg-amber-100">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-amber-500" />
        </div>
      </div>
    </section>
  );
}
