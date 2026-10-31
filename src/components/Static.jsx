import { Reveal } from './Effects.jsx';

export function Things() {
  const links = [
    ['#cake', 'Blow out the candles'],
    ['#balloons', 'Pop the balloons'],
    ['#reasons', 'Flip the cards'],
    ['#game', 'Play the memory game'],
    ['#wishes', 'Write a wish'],
    ['#love', 'Send love back'],
  ];
  return (
    <section className="things">
      <div className="in">
        <p className="t">Things to try, Mam</p>
        <nav className="chips" aria-label="Things to try">
          {links.map(([href, label]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>
        <p className="fine">On a computer, hold the mouse button and drag anywhere to leave Mam's face behind.</p>
      </div>
    </section>
  );
}

export function Letter() {
  return (
    <section className="letter-sec">
      <Reveal className="in">
        <div className="head">
          <p className="eyebrow">From your students</p>
          <h2>A teacher who was a mom to us</h2>
        </div>
        <article className="letter">
          <p className="to">Dear Subha Mam,</p>
          <p className="ta-p">
            You are more than the teacher who taught us. You corrected us when we were wrong, stood by us when we were
            low, and looked after us like a mother. We will always be grateful for that love.
          </p>
          <p className="ta-p">
            On your birthday, we wish you a smile that never fades, a peaceful mind and a happy home.
          </p>
          <p className="sign">With love,<br />Your students</p>
        </article>
      </Reveal>
    </section>
  );
}

const FACTS = [
  ['Born on', 'A Thursday', 'November 1, 1990'],
  ['Sun sign', 'Scorpio', 'Known for loyalty, courage and a big heart.'],
  ['Birth flower', 'Chrysanthemum', 'A flower of joy and long life.'],
  ['Birthstone', 'Topaz', 'Golden, warm and bright, like you.'],
];

export function Facts() {
  return (
    <section className="facts-sec">
      <Reveal className="in">
        <div className="head">
          <p className="eyebrow">About the day</p>
          <h2>All about November 1</h2>
          <p className="sub">In 1990, November 1 fell on a Thursday. This year it falls on a Sunday.</p>
        </div>
        <div className="facts">
          {FACTS.map(([k, v, n]) => (
            <div className="fact" key={k}>
              <p className="k">{k}</p>
              <p className="v">{v}</p>
              <p className="n">{n}</p>
            </div>
          ))}
        </div>
        <p className="fine">Sun sign and flower meanings are just for fun.</p>
      </Reveal>
    </section>
  );
}
