import { HERO } from '@/lib/site';

/** Full-bleed image band with the parish name — the first thing on the home page. */
export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-media">
        {HERO.images.map((img, i) => (
          <img
            key={img.src}
            className={`hero-img${i > 0 ? ' hero-img-second' : ''}`}
            src={img.src}
            alt=""
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="hero-veil" />
      <div className="hero-content container">
        <p className="hero-eyebrow">{HERO.title}</p>
        <h1 className="hero-title">{HERO.script}</h1>
        <p className="hero-sub">{HERO.subtitle}</p>
      </div>
    </section>
  );
}
