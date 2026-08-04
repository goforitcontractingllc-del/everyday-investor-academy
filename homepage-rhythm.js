
(() => {
  const STYLE_ID = "eia-homepage-rhythm-style";
  if (document.getElementById(STYLE_ID)) return;

  const css = `
  :root{
    --eia-navy:#143b66;
    --eia-olive:#737c61;
    --eia-cream:#f7f0e5;
    --eia-paper:#fffdf8;
    --eia-soft:#eef1e8;
    --eia-gold:#c89b46;
    --eia-line:#c9bba7;
  }

  html{scroll-behavior:smooth}

  .eia-chapter-marker{
    width:min(100% - 32px, 980px);
    margin:84px auto 30px;
    display:grid;
    grid-template-columns:auto 1fr;
    gap:16px;
    align-items:center;
  }
  .eia-chapter-marker::after{
    content:"";
    height:1px;
    background:linear-gradient(90deg,var(--eia-line),transparent);
  }
  .eia-chapter-number{
    display:inline-grid;
    place-items:center;
    min-width:48px;
    height:48px;
    border-radius:50%;
    background:var(--eia-navy);
    color:white;
    font:800 14px/1 Arial,sans-serif;
    letter-spacing:.08em;
  }
  .eia-chapter-copy{
    grid-column:1/-1;
    padding:0 0 0 64px;
    margin-top:-8px;
  }
  .eia-chapter-kicker{
    color:var(--eia-olive);
    font:900 12px/1.3 Arial,sans-serif;
    letter-spacing:.16em;
    text-transform:uppercase;
  }
  .eia-chapter-title{
    margin:7px 0 5px;
    color:var(--eia-navy);
    font:700 clamp(28px,7vw,48px)/1.05 Georgia,serif;
  }
  .eia-chapter-description{
    margin:0;
    max-width:720px;
    color:#71746f;
    font:400 18px/1.6 Arial,sans-serif;
  }

  .eia-room-start{
    position:relative;
    margin-top:28px !important;
  }
  .eia-room-start::before{
    content:"";
    position:absolute;
    z-index:-1;
    inset:-24px -12px -18px;
    border-radius:26px;
    background:linear-gradient(145deg,rgba(238,241,232,.58),rgba(255,253,248,.15));
  }

  .eia-card-section-label{
    width:min(100% - 52px, 900px);
    margin:62px auto 20px;
    padding:14px 18px;
    border-left:5px solid var(--eia-gold);
    border-radius:0 14px 14px 0;
    background:rgba(255,253,248,.78);
    box-shadow:0 8px 28px rgba(20,59,102,.04);
  }
  .eia-card-section-label strong{
    display:block;
    color:var(--eia-navy);
    font:700 24px/1.2 Georgia,serif;
  }
  .eia-card-section-label span{
    display:block;
    margin-top:4px;
    color:#737873;
    font:400 15px/1.5 Arial,sans-serif;
  }

  .eia-scroll-nav{
    position:fixed;
    z-index:900;
    left:50%;
    bottom:14px;
    transform:translateX(-50%);
    width:min(calc(100% - 28px),680px);
    display:flex;
    gap:7px;
    overflow-x:auto;
    padding:8px;
    border:1px solid rgba(255,255,255,.25);
    border-radius:999px;
    background:rgba(15,49,87,.93);
    box-shadow:0 12px 36px rgba(15,49,87,.24);
    backdrop-filter:blur(10px);
    -webkit-overflow-scrolling:touch;
  }
  .eia-scroll-nav a{
    flex:0 0 auto;
    padding:9px 12px;
    border-radius:999px;
    color:white !important;
    text-decoration:none !important;
    font:800 12px/1 Arial,sans-serif;
    letter-spacing:.02em;
  }
  .eia-scroll-nav a:hover,
  .eia-scroll-nav a:focus{
    background:rgba(255,255,255,.16);
  }

  .eia-breathing-divider{
    width:min(100% - 40px,900px);
    margin:72px auto;
    text-align:center;
    color:var(--eia-olive);
    font:900 12px/1.3 Arial,sans-serif;
    letter-spacing:.18em;
    text-transform:uppercase;
  }
  .eia-breathing-divider::before,
  .eia-breathing-divider::after{
    content:"";
    display:inline-block;
    width:min(24vw,180px);
    height:1px;
    margin:0 14px 4px;
    background:var(--eia-line);
  }

  @media(max-width:650px){
    .eia-chapter-marker{margin-top:66px}
    .eia-chapter-copy{padding-left:0}
    .eia-card-section-label{margin-top:46px}
    .eia-scroll-nav{bottom:8px}
    body{padding-bottom:66px}
  }
  `;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = css;
  document.head.appendChild(style);

  const normalize = value => (value || "").replace(/\s+/g, " ").trim().toLowerCase();

  const textMatch = (text, selectors = "h1,h2,h3,h4,a,strong,p") => {
    const wanted = normalize(text);
    return [...document.querySelectorAll(selectors)]
      .find(el => normalize(el.textContent).includes(wanted));
  };

  const cardForHeading = heading => {
    if (!heading) return null;
    let el = heading;
    while (el && el !== document.body) {
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const radius = parseFloat(style.borderRadius) || 0;
      const hasBorder = parseFloat(style.borderTopWidth) > 0;
      if (rect.width > 260 && rect.height > 180 && (radius >= 12 || hasBorder)) return el;
      el = el.parentElement;
    }
    return heading.parentElement;
  };

  const insertBefore = (target, node) => {
    if (!target || !target.parentNode) return;
    target.parentNode.insertBefore(node, target);
  };

  const chapter = ({id, number, kicker, title, description, targetText}) => {
    const targetHeading = textMatch(targetText, "h1,h2,h3,h4");
    const target = cardForHeading(targetHeading) || targetHeading;
    if (!target || document.getElementById(id)) return null;

    const marker = document.createElement("div");
    marker.id = id;
    marker.className = "eia-chapter-marker";
    marker.innerHTML = `
      <span class="eia-chapter-number">${number}</span>
      <div></div>
      <div class="eia-chapter-copy">
        <div class="eia-chapter-kicker">${kicker}</div>
        <div class="eia-chapter-title">${title}</div>
        <p class="eia-chapter-description">${description}</p>
      </div>`;
    insertBefore(target, marker);
    target.classList.add("eia-room-start");
    return marker;
  };

  // The page now reads like rooms instead of one endless stack.
  chapter({
    id:"eia-chapter-foundation",
    number:"01",
    kicker:"Begin with the base",
    title:"Start here—or enter anywhere.",
    description:"Foundation explains how the Academy works. The remaining districts are open doors, not prerequisites.",
    targetText:"Foundation"
  });

  // Smaller labels split the ten districts into meaningful groups.
  const groups = [
    {
      target:"Housing",
      title:"Everyday stability",
      description:"Housing, money, and credit shape the decisions people face most often."
    },
    {
      target:"Land",
      title:"Property and building",
      description:"Move from parcel potential into planning, construction, and field systems."
    },
    {
      target:"Investing",
      title:"Opportunity and operations",
      description:"Study deals, build businesses, and manage real property."
    },
    {
      target:"Know Your Rights",
      title:"Protection and next steps",
      description:"Learn the rule, preserve evidence, and understand practical remedies."
    }
  ];

  groups.forEach(group => {
    const heading = textMatch(group.target, "h1,h2,h3,h4");
    const target = cardForHeading(heading);
    if (!target || target.previousElementSibling?.classList.contains("eia-card-section-label")) return;
    const label = document.createElement("div");
    label.className = "eia-card-section-label";
    label.innerHTML = `<strong>${group.title}</strong><span>${group.description}</span>`;
    insertBefore(target, label);
  });

  const connection = textMatch("The Academy is designed as a web", "h1,h2,h3,h4,p,strong");
  const connectionRoom = connection ? (connection.closest("section") || cardForHeading(connection)) : null;
  if (connectionRoom && !document.getElementById("eia-chapter-connections")) {
    const divider = document.createElement("div");
    divider.id = "eia-chapter-connections";
    divider.className = "eia-breathing-divider";
    divider.textContent = "Everything connects";
    insertBefore(connectionRoom, divider);
    connectionRoom.classList.add("eia-room-start");
  }

  const atlasNote = textMatch("The Living Atlas stays in the background", "h1,h2,h3,h4,p,strong");
  const atlasRoom = atlasNote ? (atlasNote.closest("section") || cardForHeading(atlasNote)) : null;
  if (atlasRoom && !document.getElementById("eia-chapter-atlas")) {
    const marker = document.createElement("div");
    marker.id = "eia-chapter-atlas";
    marker.className = "eia-chapter-marker";
    marker.innerHTML = `
      <span class="eia-chapter-number">03</span><div></div>
      <div class="eia-chapter-copy">
        <div class="eia-chapter-kicker">Resource layer</div>
        <div class="eia-chapter-title">Find the answer behind the lesson.</div>
        <p class="eia-chapter-description">The Living Atlas connects terms, current Oregon resources, agencies, maps, tools, and local branches.</p>
      </div>`;
    insertBefore(atlasRoom, marker);
    atlasRoom.classList.add("eia-room-start");
  }

  // Compact mobile section navigator.
  if (!document.querySelector(".eia-scroll-nav")) {
    const nav = document.createElement("nav");
    nav.className = "eia-scroll-nav";
    nav.setAttribute("aria-label", "Homepage sections");
    nav.innerHTML = `
      <a href="#">Welcome</a>
      <a href="#eia-chapter-foundation">Districts</a>
      <a href="#eia-chapter-connections">Connections</a>
      <a href="#eia-chapter-atlas">Atlas</a>`;
    document.body.appendChild(nav);
  }
})();
