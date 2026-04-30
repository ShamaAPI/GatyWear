export default function SplashLoader() {
  return (
    <section className="flex flex-1 items-center justify-center bg-background">
      <div className="text-center">
        <p className="text-sm font-semibold tracking-[0.26em] text-accent">GATY WEAR</p>
        <h2 className="mt-2 text-3xl font-extrabold text-primary">???? ???</h2>
        <div className="mx-auto mt-5 h-1 w-28 overflow-hidden rounded-full bg-amber-100">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-accent" />
        </div>
      </div>
    </section>
  );
}
