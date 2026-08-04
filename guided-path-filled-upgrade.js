
(() => {
  const PAGE_TEXT = (document.body?.innerText || "").toLowerCase();
  const IS_TARGET =
    PAGE_TEXT.includes("start with the path that sounds like you") ||
    PAGE_TEXT.includes("choose your entrance") ||
    PAGE_TEXT.includes("use the local branch from any lesson");

  if (!IS_TARGET || document.getElementById("eia-guided-path-upgrade")) return;

  const STYLE_ID = "eia-guided-path-upgrade";
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
  :root{
    --eia-navy:#123b66;
    --eia-navy-2:#1f4f7d;
    --eia-cream:#f7f0e5;
    --eia-paper:#fffdf8;
    --eia-olive:#70795f;
    --eia-gold:#c89b46;
    --eia-line:#c9bba7;
    --eia-soft:#edf2e9;
    --eia-ink:#29302f;
    --eia-muted:#6c726f;
  }

  .eia-hidden{display:none!important}

  .eia-path-search-results{
    width:min(100% - 32px,980px);
    margin:0 auto 36px;
    display:none;
    background:var(--eia-paper);
    border:1px solid var(--eia-line);
    border-radius:20px;
    padding:18px;
    box-shadow:0 12px 34px rgba(18,59,102,.08);
  }
  .eia-path-search-results.show{display:block}
  .eia-path-search-results h2{
    margin:0 0 4px;
    color:var(--eia-navy);
    font:700 28px/1.1 Georgia,serif;
  }
  .eia-result-count{
    color:var(--eia-muted);
    margin:0 0 14px;
  }
  .eia-result-grid{
    display:grid;
    grid-template-columns:repeat(2,minmax(0,1fr));
    gap:10px;
  }
  .eia-result{
    display:block;
    border:1px solid #d7ded2;
    border-radius:14px;
    padding:14px;
    background:white;
    color:var(--eia-navy)!important;
    text-decoration:none!important;
  }
  .eia-result strong{
    display:block;
    font:700 20px/1.2 Georgia,serif;
  }
  .eia-result span{
    display:block;
    color:var(--eia-muted);
    margin-top:4px;
    font-size:14px;
    line-height:1.45;
  }
  .eia-no-result{
    padding:18px;
    background:#fbf6eb;
    border-left:5px solid var(--eia-gold);
    border-radius:10px;
  }

  .eia-flow-section,
  .eia-branches-section,
  .eia-final-section{
    width:min(100% - 32px,980px);
    margin:72px auto;
  }
  .eia-section-kicker{
    color:var(--eia-olive);
    font:900 12px/1.3 Arial,sans-serif;
    letter-spacing:.17em;
    text-transform:uppercase;
  }
  .eia-section-title{
    color:var(--eia-navy);
    margin:8px 0 12px;
    font:700 clamp(34px,8vw,58px)/1.02 Georgia,serif;
  }
  .eia-section-lead{
    max-width:780px;
    color:var(--eia-muted);
    font:400 18px/1.65 Arial,sans-serif;
  }

  .eia-flow{
    display:grid;
    grid-template-columns:repeat(6,minmax(0,1fr));
    gap:9px;
    margin-top:22px;
  }
  .eia-flow-step{
    position:relative;
    min-height:135px;
    padding:17px 14px;
    border:1px solid var(--eia-line);
    border-radius:16px;
    background:var(--eia-paper);
  }
  .eia-flow-step b{
    display:block;
    color:var(--eia-navy);
    font:700 20px/1.15 Georgia,serif;
  }
  .eia-flow-step span{
    display:block;
    color:var(--eia-muted);
    margin-top:7px;
    font-size:14px;
    line-height:1.42;
  }
  .eia-flow-step:not(:last-child)::after{
    content:"→";
    position:absolute;
    right:-11px;
    top:50%;
    z-index:2;
    color:var(--eia-gold);
    font-weight:900;
  }

  .eia-branch-grid{
    display:grid;
    grid-template-columns:repeat(2,minmax(0,1fr));
    gap:14px;
    margin-top:24px;
  }
  .eia-branch-card{
    appearance:none;
    width:100%;
    text-align:left;
    border:1px solid var(--eia-line);
    border-radius:20px;
    background:var(--eia-paper);
    padding:19px;
    cursor:pointer;
    box-shadow:0 10px 28px rgba(18,59,102,.05);
  }
  .eia-branch-card:hover{transform:translateY(-2px)}
  .eia-branch-card strong{
    display:block;
    color:var(--eia-navy);
    font:700 25px/1.15 Georgia,serif;
  }
  .eia-branch-card span{
    display:block;
    color:var(--eia-muted);
    margin-top:7px;
    line-height:1.5;
  }
  .eia-open-label{
    color:var(--eia-navy)!important;
    font-weight:900;
    margin-top:11px!important;
  }

  .eia-path-modal{
    position:fixed;
    inset:0;
    z-index:1500;
    display:none;
    padding:18px;
    overflow:auto;
    background:rgba(7,22,38,.76);
  }
  .eia-path-modal.open{display:block}
  .eia-modal-window{
    width:min(920px,100%);
    margin:3vh auto;
    overflow:hidden;
    border:1px solid rgba(255,255,255,.2);
    border-radius:24px;
    background:var(--eia-paper);
    box-shadow:0 28px 90px rgba(0,0,0,.35);
  }
  .eia-modal-head{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:14px;
    padding:22px;
    background:linear-gradient(135deg,var(--eia-navy),var(--eia-navy-2));
    color:white;
  }
  .eia-modal-head h2{
    margin:0;
    color:white;
    font:700 34px/1.1 Georgia,serif;
  }
  .eia-modal-head p{margin:7px 0 0;color:#dbe8f3}
  .eia-modal-close{
    flex:0 0 auto;
    width:42px;
    height:42px;
    border:1px solid rgba(255,255,255,.45);
    border-radius:50%;
    background:rgba(255,255,255,.1);
    color:white;
    font-size:24px;
    cursor:pointer;
  }
  .eia-modal-body{padding:22px}
  .eia-modal-grid{
    display:grid;
    grid-template-columns:repeat(2,minmax(0,1fr));
    gap:11px;
  }
  .eia-modal-card{
    padding:15px;
    border:1px solid #d7ded2;
    border-radius:14px;
    background:white;
  }
  .eia-modal-card h3{
    margin:0 0 5px;
    color:var(--eia-navy);
    font:700 21px/1.2 Georgia,serif;
  }
  .eia-modal-card p{margin:0;color:var(--eia-muted);line-height:1.52}
  .eia-modal-links{
    display:grid;
    grid-template-columns:repeat(2,minmax(0,1fr));
    gap:9px;
    margin-top:15px;
  }
  .eia-modal-links a{
    padding:12px;
    border:1px solid var(--eia-line);
    border-radius:11px;
    background:var(--eia-soft);
    color:var(--eia-navy)!important;
    font-weight:900;
    text-decoration:none!important;
  }
  .eia-checklist{
    display:grid;
    gap:8px;
    margin-top:15px;
  }
  .eia-check{
    display:flex;
    gap:10px;
    padding:11px;
    border:1px solid #d7ded2;
    border-radius:11px;
    background:white;
  }
  .eia-check input{margin-top:4px;transform:scale(1.15)}
  .eia-final-section{
    padding:30px;
    border-radius:24px;
    background:linear-gradient(135deg,var(--eia-navy),var(--eia-navy-2));
    color:white;
  }
  .eia-final-section .eia-section-kicker,
  .eia-final-section .eia-section-title,
  .eia-final-section .eia-section-lead{color:white}
  .eia-final-actions{
    display:flex;
    gap:10px;
    flex-wrap:wrap;
    margin-top:20px;
  }
  .eia-final-actions a{
    padding:13px 16px;
    border:2px solid white;
    border-radius:12px;
    color:white!important;
    text-decoration:none!important;
    font-weight:900;
  }
  .eia-final-actions a:first-child{
    background:white;
    color:var(--eia-navy)!important;
  }

  .eia-district-info{
    margin:10px 0 0;
    padding:11px 12px;
    border-left:4px solid var(--eia-gold);
    border-radius:0 10px 10px 0;
    background:#fbf6eb;
    color:var(--eia-muted);
    font-size:14px;
    line-height:1.48;
  }

  @media(max-width:820px){
    .eia-flow{grid-template-columns:repeat(2,minmax(0,1fr))}
    .eia-flow-step::after{display:none}
  }
  @media(max-width:650px){
    .eia-result-grid,
    .eia-branch-grid,
    .eia-modal-grid,
    .eia-modal-links{grid-template-columns:1fr}
    .eia-flow{grid-template-columns:1fr}
    .eia-flow-step{min-height:auto}
    .eia-flow-section,
    .eia-branches-section,
    .eia-final-section{margin-top:54px;margin-bottom:54px}
  }
  `;
  document.head.appendChild(style);

  const norm = value => (value || "").replace(/\s+/g, " ").trim().toLowerCase();
  const all = selector => [...document.querySelectorAll(selector)];
  const findText = (text, selector = "h1,h2,h3,h4,p,strong,a,button") =>
    all(selector).find(el => norm(el.textContent).includes(norm(text)));

  // Remove obsolete home button only on this page. The sticky Academy logo already performs that job.
  all("a,button").forEach(el => {
    if (norm(el.textContent) === "academy home") {
      const wrapper = el.closest("li,div,p") || el;
      wrapper.classList.add("eia-hidden");
    }
  });

  // Find and repair the existing search input.
  const searchInput = all('input[type="search"], input[type="text"]')
    .find(input => /search|cement|district|topic/i.test(`${input.placeholder || ""} ${input.value || ""}`))
    || all('input[type="search"], input[type="text"]')[0];

  const clearButton = all("button").find(btn => norm(btn.textContent) === "clear");

  if (searchInput) {
    // Old browser/autofill values should not silently carry into this path page.
    searchInput.value = "";
    searchInput.setAttribute("autocomplete", "off");
    searchInput.placeholder = "Search paths, districts, tools, terms, and local resources…";
  }

  // District and branch knowledge index.
  const data = [
    {title:"Foundation", type:"District", keywords:"thinking research decisions beginner start framework", desc:"Build the thinking and research base that supports every other district.", href:"foundation.html"},
    {title:"Housing", type:"District", keywords:"renting buying mortgages adu cottage cluster affordable housing home", desc:"Understand where people live, how housing works, and how to choose the next step.", href:"housing.html"},
    {title:"Money", type:"District", keywords:"budget banking debt cash flow savings taxes insurance stability", desc:"Build practical household and project money systems.", href:"money.html"},
    {title:"Credit", type:"District", keywords:"reports score collections disputes loans lending rebuilding borrowing", desc:"Understand, repair, protect, and use credit intentionally.", href:"credit.html"},
    {title:"Land", type:"District", keywords:"parcel zoning utilities access title gis septic well development", desc:"Learn what a parcel can legally, physically, and financially support.", href:"land.html"},
    {title:"Construction", type:"District", keywords:"cement concrete materials permits estimating scope tools safety building", desc:"Follow projects through site work, estimating, production, and closeout.", href:"construction.html"},
    {title:"Investing", type:"District", keywords:"cash flow deal analysis rentals brrrr financing risk return", desc:"Study how property becomes an investment.", href:"investing.html"},
    {title:"Business", type:"District", keywords:"license registration pricing marketing operations contracts customers vendor", desc:"Build and operate a durable business.", href:"business.html"},
    {title:"Property Management", type:"District", keywords:"leasing screening maintenance vendors inspections accounting residents course license", desc:"Learn how rental property operations work.", href:"property-management.html"},
    {title:"Know Your Rights", type:"District", keywords:"law contract notices evidence fair housing tenant debt dispute legal help", desc:"Identify the rule, preserve evidence, and choose a practical next step.", href:"know-your-rights.html"},
    {title:"Housing & Assistance Branch", type:"Local branch", keywords:"fair housing rental help homebuyer assistance affordable housing agencies", desc:"Housing agencies, assistance, fair-housing resources, and local programs.", modal:"housing"},
    {title:"Construction Permits & Codes", type:"Local branch", keywords:"cement concrete permits codes ccb osha building inspections contractor", desc:"Licensing, permits, codes, inspections, safety, and contractor resources.", modal:"construction"},
    {title:"Business Registration & Licensing", type:"Local branch", keywords:"oregon sos business license city medford ein vendor registration", desc:"Business formation, licensing, tax registration, and vendor pathways.", modal:"business"},
    {title:"Property Management Education", type:"Local branch", keywords:"oregon property manager approved course exam license real estate agency", desc:"Oregon licensing pathway, approved education, and professional resources.", modal:"pm"},
    {title:"Land, GIS & Planning", type:"Local branch", keywords:"parcel assessor gis zoning planning wetlands flood wildfire septic well", desc:"Parcel research, mapping, zoning, hazards, and planning offices.", modal:"land"},
    {title:"Investing & Property Records", type:"Local branch", keywords:"assessor sales tax deed court foreclosure market research", desc:"Property records, public research, valuation clues, and deal due diligence.", modal:"investing"},
    {title:"Money, Credit & Consumer Help", type:"Local branch", keywords:"budget debt credit report consumer complaint taxes banking assistance", desc:"Financial education, official reports, consumer protection, and help resources.", modal:"money"},
    {title:"Rights & Legal Resources", type:"Local branch", keywords:"legal aid law tenant landlord fair housing court evidence notices", desc:"Legal information, fair housing, courts, complaints, and assistance.", modal:"rights"}
  ];

  // Add result container immediately after the search region.
  let results;
  if (searchInput) {
    const searchRegion =
      searchInput.closest("section") ||
      searchInput.closest("div") ||
      searchInput.parentElement;

    results = document.createElement("section");
    results.className = "eia-path-search-results";
    results.setAttribute("aria-live", "polite");
    searchRegion.insertAdjacentElement("afterend", results);
  }

  const renderSearch = () => {
    if (!searchInput || !results) return;
    const query = norm(searchInput.value);

    if (!query) {
      results.classList.remove("show");
      results.innerHTML = "";
      return;
    }

    const words = query.split(" ").filter(Boolean);
    const matches = data.filter(item => {
      const haystack = norm(`${item.title} ${item.type} ${item.keywords} ${item.desc}`);
      return words.every(word => haystack.includes(word));
    });

    results.classList.add("show");
    if (!matches.length) {
      results.innerHTML = `
        <h2>No exact match yet</h2>
        <div class="eia-no-result">
          Try a broader word such as <strong>construction</strong>, <strong>cement</strong>,
          <strong>permit</strong>, <strong>housing</strong>, <strong>credit</strong>,
          <strong>land</strong>, or <strong>business license</strong>.
        </div>`;
      return;
    }

    const cards = matches.map((item, index) => {
      const action = item.modal
        ? `href="#" data-eia-open="${item.modal}"`
        : `href="${item.href}"`;
      return `<a class="eia-result" ${action} data-result-index="${index}">
        <strong>${item.title}</strong>
        <span>${item.type} · ${item.desc}</span>
      </a>`;
    }).join("");

    results.innerHTML = `
      <h2>Search results</h2>
      <p class="eia-result-count">${matches.length} connected result${matches.length === 1 ? "" : "s"}</p>
      <div class="eia-result-grid">${cards}</div>`;

    results._matches = matches;
  };

  searchInput?.addEventListener("input", renderSearch);
  clearButton?.addEventListener("click", event => {
    event.preventDefault();
    searchInput.value = "";
    renderSearch();
    searchInput.focus();
  });
  searchInput?.addEventListener("keydown", event => {
    if (event.key !== "Enter") return;
    const first = results?.querySelector(".eia-result");
    if (first) {
      event.preventDefault();
      first.click();
    }
  });

  // Enhance existing district rows without changing their working links.
  const districtDescriptions = {
    "construction":"Learn site discovery, scope, estimating, tools, safety, permits, production, and closeout.",
    "business":"Learn registration, licensing, pricing, customers, contracts, operations, and growth.",
    "property management":"Learn leasing, screening, maintenance, inspections, vendors, accounting, and Oregon licensing.",
    "land":"Learn parcels, zoning, utilities, access, GIS, due diligence, and development feasibility.",
    "housing":"Learn renting, ownership, mortgages, assistance, ADUs, cottage clusters, and housing choices.",
    "money":"Learn budgeting, banking, debt, saving, taxes, insurance, and cash flow.",
    "credit":"Learn reports, scores, disputes, collections, rebuilding, lending, and borrowing power.",
    "investing":"Learn strategy, deal analysis, financing, cash flow, risk, and exits.",
    "foundation":"Build practical thinking, research, decision-making, and learning habits.",
    "know your rights":"Learn laws, contracts, notices, evidence, responsibilities, and practical remedies."
  };

  all("a,button,summary").forEach(el => {
    const key = Object.keys(districtDescriptions).find(name => norm(el.textContent) === name);
    if (!key) return;
    const container = el.closest("li,div") || el.parentElement;
    if (!container || container.querySelector(".eia-district-info")) return;
    const info = document.createElement("div");
    info.className = "eia-district-info";
    info.textContent = districtDescriptions[key];
    container.appendChild(info);
  });

  // Add the missing "what happens next" bridge.
  const branchHeading = findText("use the local branch from any lesson", "h1,h2,h3,h4");
  const branchSection =
    branchHeading?.closest("section") ||
    branchHeading?.parentElement ||
    document.querySelector("footer");

  const flowSection = document.createElement("section");
  flowSection.className = "eia-flow-section";
  flowSection.innerHTML = `
    <div class="eia-section-kicker">How the system works</div>
    <h2 class="eia-section-title">Choose one useful step. The Academy carries the connection forward.</h2>
    <p class="eia-section-lead">
      You do not need to understand the whole map before beginning. Start with a goal or district,
      learn the core idea, use a tool, verify the current local information, and follow the next connection.
    </p>
    <div class="eia-flow">
      <div class="eia-flow-step"><b>1. Choose</b><span>Select the path that sounds closest to your real situation.</span></div>
      <div class="eia-flow-step"><b>2. Learn</b><span>Open a district lesson and understand the core idea.</span></div>
      <div class="eia-flow-step"><b>3. Practice</b><span>Use the checklist, calculator, worksheet, or field tool.</span></div>
      <div class="eia-flow-step"><b>4. Verify</b><span>Open current Oregon, county, agency, code, or program information.</span></div>
      <div class="eia-flow-step"><b>5. Act</b><span>Complete the next real-world task.</span></div>
      <div class="eia-flow-step"><b>6. Connect</b><span>Move to the next district without losing your place.</span></div>
    </div>`;

  if (branchSection?.parentNode) {
    branchSection.parentNode.insertBefore(flowSection, branchSection);
  }

  const branchData = {
    housing:{
      title:"Housing Assistance & Fair Housing",
      subtitle:"Current agencies, assistance, housing programs, and protections.",
      cards:[
        ["Start with the housing problem","Are you seeking rent help, homebuyer education, fair-housing help, zoning information, or a housing form?"],
        ["Verify eligibility","Programs have location, income, household, property, and timing requirements."],
        ["Save the record","Keep screenshots, notices, application numbers, dates, and agency contacts."],
        ["Connect back to lessons","Use Housing, Money, Credit, and Know Your Rights together."]
      ],
      links:[
        ["Oregon Housing and Community Services","https://www.oregon.gov/ohcs/"],
        ["HUD Oregon","https://www.hud.gov/states/oregon"],
        ["Fair Housing Council of Oregon","https://fhco.org/"],
        ["211info Oregon","https://www.211info.org/"],
        ["Housing District","housing.html"],
        ["Know Your Rights","know-your-rights.html"]
      ],
      checks:["Define the housing need","Check current eligibility","Gather required documents","Record application or contact details","Choose the next connected lesson"]
    },
    construction:{
      title:"Construction Permits, Codes & Licensing",
      subtitle:"Contractor licensing, safety, codes, permits, inspections, and local portals.",
      cards:[
        ["License first","Confirm the work fits the contractor's license and endorsement."],
        ["Location controls","Permit and inspection responsibility depends on the project address."],
        ["Scope controls the answer","Describe the exact work instead of asking only whether a permit is needed."],
        ["Safety is part of planning","Identify hazards, controls, training, and required protective equipment."]
      ],
      links:[
        ["Oregon CCB","https://www.oregon.gov/ccb/"],
        ["Oregon Building Codes Division","https://www.oregon.gov/bcd/"],
        ["Oregon OSHA Education","https://osha.oregon.gov/edu/Pages/index.aspx"],
        ["Oregon 811","https://digsafelyoregon.com/"],
        ["Medford Building Safety","https://www.medfordoregon.gov/Government/Departments/Building-Safety"],
        ["Construction District","construction.html"]
      ],
      checks:["Identify project address","Write exact construction scope","Check license and trade boundaries","Ask the responsible building department","Save permit and inspection requirements"]
    },
    business:{
      title:"Business Registration & Licensing",
      subtitle:"Formation, tax registration, local licensing, vendor systems, and operating basics.",
      cards:[
        ["Entity is not the whole business","Registration does not replace insurance, licenses, taxes, contracts, or systems."],
        ["Check every level","Federal, Oregon, county, city, and industry requirements can overlap."],
        ["Build the record system","Save confirmations, renewals, account numbers, and deadlines."],
        ["Connect operations","Use Business, Money, Credit, and Know Your Rights together."]
      ],
      links:[
        ["Oregon Secretary of State Business","https://sos.oregon.gov/business/"],
        ["Oregon Business Xpress","https://www.oregon.gov/business/"],
        ["IRS EIN","https://www.irs.gov/businesses/small-businesses-self-employed/employer-id-numbers"],
        ["OregonBuys","https://oregonbuys.gov/"],
        ["Business District","business.html"],
        ["Money District","money.html"]
      ],
      checks:["Confirm business name and entity","Obtain tax registrations","Check city and industry licenses","Set renewal reminders","Create a compliance folder"]
    },
    pm:{
      title:"Property Management Education & Oregon Licensing",
      subtitle:"Role boundaries, approved education, licensing, operations, and professional resources.",
      cards:[
        ["Learn the role","Property management combines leasing, money, maintenance, residents, vendors, and compliance."],
        ["Separate education from authority","A non-accredited lesson can prepare you, but it does not grant a license."],
        ["Verify the current pathway","Use the Oregon Real Estate Agency for current licensing and approved education information."],
        ["Practice operations","Use the Academy for exam concepts, scenarios, forms, and management systems."]
      ],
      links:[
        ["Oregon Real Estate Agency","https://www.oregon.gov/rea/"],
        ["License Requirements","https://www.oregon.gov/rea/licensing/"],
        ["Property Management District","property-management.html"],
        ["Housing District","housing.html"],
        ["Business District","business.html"],
        ["Know Your Rights","know-your-rights.html"]
      ],
      checks:["Review the current Oregon pathway","Compare approved education providers","Learn role and legal boundaries","Practice operational scenarios","Create an exam-study plan"]
    },
    land:{
      title:"Land, GIS, Zoning & Planning",
      subtitle:"Parcel research, maps, zoning, access, utilities, hazards, and development feasibility.",
      cards:[
        ["Identify the exact parcel","Use tax lot, legal description, ownership, and map information."],
        ["Read regulation and ground together","Zoning alone does not prove physical or financial feasibility."],
        ["Verify access and utilities","A nearby road or line does not guarantee legal access or affordable service."],
        ["Create a written due-diligence record","Separate verified facts, assumptions, unknowns, and next actions."]
      ],
      links:[
        ["Oregon DLCD Maps & Tools","https://www.oregon.gov/lcd/about/pages/maps-data-tools.aspx"],
        ["Oregon GEOHub","https://geohub.oregon.gov/"],
        ["Jackson County Development Services","https://jacksoncountyor.gov/ds"],
        ["Josephine County Community Development","https://www.josephinecounty.gov/departments/community_development/index.php"],
        ["FEMA Flood Maps","https://msc.fema.gov/portal/home"],
        ["Land District","land.html"]
      ],
      checks:["Confirm parcel identity","Check zone and overlays","Research legal and physical access","Verify utilities and wastewater","Estimate studies, approvals, and site costs"]
    },
    investing:{
      title:"Investing & Property Records",
      subtitle:"Public research, comparable sales, deal analysis, risk, and exit planning.",
      cards:[
        ["Start with strategy","The same parcel can be a bad flip and a good long-term hold."],
        ["Use public records carefully","Assessor and court records are clues, not complete due diligence."],
        ["Model the downside","Include vacancy, repair, delay, financing, selling, and unknown-cost risk."],
        ["Define the exit before purchase","Hold, rent, refinance, divide, improve, or sell."]
      ],
      links:[
        ["Jackson County Property Data","https://web.jacksoncounty.org/pdo/"],
        ["Josephine County Assessor","https://www.josephinecounty.gov/departments/assessor/index.php"],
        ["Oregon Judicial Case Information","https://www.courts.oregon.gov/services/online/pages/ojcin.aspx"],
        ["Investing District","investing.html"],
        ["Land District","land.html"],
        ["Money District","money.html"]
      ],
      checks:["Define investment strategy","Verify parcel and ownership","Collect realistic comparable evidence","Model total cost and downside","Write a maximum-offer rule"]
    },
    money:{
      title:"Money, Credit & Consumer Help",
      subtitle:"Official reports, banking, debt, taxes, consumer complaints, and financial assistance.",
      cards:[
        ["Name the money problem","Cash-flow shortage, debt, report error, tax issue, emergency, or borrowing need?"],
        ["Use official records","Pull reports and statements before building a plan."],
        ["Protect deadlines","Court, tax, dispute, and collection timelines matter."],
        ["Connect the system","Money and credit affect housing, business, investing, and legal choices."]
      ],
      links:[
        ["AnnualCreditReport","https://www.annualcreditreport.com/"],
        ["Consumer Financial Protection Bureau","https://www.consumerfinance.gov/"],
        ["Oregon Division of Financial Regulation","https://dfr.oregon.gov/"],
        ["IRS","https://www.irs.gov/"],
        ["Money District","money.html"],
        ["Credit District","credit.html"]
      ],
      checks:["Gather statements and official reports","List urgent deadlines","Separate household and business obligations","Choose one stabilization action","Record the next review date"]
    },
    rights:{
      title:"Rights, Evidence & Legal Resources",
      subtitle:"Laws, notices, contracts, complaints, courts, legal aid, and preserving evidence.",
      cards:[
        ["Identify the rule","Tenant law, contract, debt, fair housing, licensing, or another system?"],
        ["Preserve evidence","Save notices, messages, photos, agreements, receipts, and dates."],
        ["Protect deadlines","A good argument can fail if the required process or timeline is missed."],
        ["Choose the level of help","Self-help information, agency complaint, mediation, legal aid, or attorney."]
      ],
      links:[
        ["Oregon Judicial Department","https://www.courts.oregon.gov/"],
        ["Oregon Law Help","https://oregonlawhelp.org/"],
        ["Legal Aid Services of Oregon","https://lasoregon.org/"],
        ["Fair Housing Council of Oregon","https://fhco.org/"],
        ["Oregon Bureau of Labor and Industries","https://www.oregon.gov/boli/"],
        ["Know Your Rights District","know-your-rights.html"]
      ],
      checks:["Identify the legal category","Build a dated evidence file","Read every notice or contract","Confirm the deadline and required process","Choose qualified help when stakes are high"]
    }
  };

  // Replace the empty ending with actual current-information branches.
  const branches = document.createElement("section");
  branches.className = "eia-branches-section";
  branches.innerHTML = `
    <div class="eia-section-kicker">Current information branches</div>
    <h2 class="eia-section-title">Open the resource layer that matches the question.</h2>
    <p class="eia-section-lead">
      These branches connect the Academy's explanations to current Oregon agencies,
      county offices, official portals, approved pathways, maps, checklists, and local research.
    </p>
    <div class="eia-branch-grid">
      ${Object.entries(branchData).map(([key, item]) => `
        <button class="eia-branch-card" type="button" data-eia-open="${key}">
          <strong>${item.title}</strong>
          <span>${item.subtitle}</span>
          <span class="eia-open-label">Open branch →</span>
        </button>`).join("")}
    </div>`;

  if (branchSection) {
    branchSection.insertAdjacentElement("afterend", branches);
  } else {
    document.querySelector("footer")?.insertAdjacentElement("beforebegin", branches);
  }

  // Build all popups.
  Object.entries(branchData).forEach(([key, item]) => {
    const modal = document.createElement("div");
    modal.className = "eia-path-modal";
    modal.dataset.eiaModal = key;
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="eia-modal-window" role="dialog" aria-modal="true" aria-labelledby="eia-title-${key}">
        <div class="eia-modal-head">
          <div>
            <h2 id="eia-title-${key}">${item.title}</h2>
            <p>${item.subtitle}</p>
          </div>
          <button class="eia-modal-close" type="button" aria-label="Close">×</button>
        </div>
        <div class="eia-modal-body">
          <div class="eia-modal-grid">
            ${item.cards.map(card => `<article class="eia-modal-card"><h3>${card[0]}</h3><p>${card[1]}</p></article>`).join("")}
          </div>
          <div class="eia-modal-links">
            ${item.links.map(link => `<a href="${link[1]}" ${/^https?:/.test(link[1]) ? 'target="_blank" rel="noopener"' : ""}>${link[0]} →</a>`).join("")}
          </div>
          <h3 style="margin-top:24px">Branch checklist</h3>
          <div class="eia-checklist">
            ${item.checks.map((check, index) => `<label class="eia-check"><input type="checkbox" data-eia-check="${key}-${index}"><span>${check}</span></label>`).join("")}
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
  });

  // Final ending.
  const final = document.createElement("section");
  final.className = "eia-final-section";
  final.innerHTML = `
    <div class="eia-section-kicker">Keep moving</div>
    <h2 class="eia-section-title">You do not need to know the whole route.</h2>
    <p class="eia-section-lead">
      Choose the next useful step. Learn enough to act safely, verify the current information,
      complete the real task, and follow the next connection when it appears.
    </p>
    <div class="eia-final-actions">
      <a href="#top" data-eia-scroll-top>Choose another path</a>
      <a href="index.html#districts">Browse all ten districts</a>
      <a href="living-atlas.html">Open the Living Atlas</a>
    </div>`;
  document.querySelector("footer")?.insertAdjacentElement("beforebegin", final);

  // Modal behavior, including search results.
  const openModal = key => {
    const modal = document.querySelector(`[data-eia-modal="${key}"]`);
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modal.querySelector("button,input,a")?.focus();
  };
  const closeModal = modal => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  document.addEventListener("click", event => {
    const opener = event.target.closest("[data-eia-open]");
    if (opener) {
      event.preventDefault();
      openModal(opener.dataset.eiaOpen);
      return;
    }
    if (event.target.classList.contains("eia-path-modal")) closeModal(event.target);
    if (event.target.closest(".eia-modal-close")) closeModal(event.target.closest(".eia-path-modal"));
    if (event.target.closest("[data-eia-scroll-top]")) {
      event.preventDefault();
      window.scrollTo({top:0, behavior:"smooth"});
    }
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal(document.querySelector(".eia-path-modal.open"));
  });

  // Save branch checklist progress.
  const saved = JSON.parse(localStorage.getItem("eia-guided-branch-checks") || "{}");
  all("[data-eia-check]").forEach(input => {
    input.checked = !!saved[input.dataset.eiaCheck];
    input.addEventListener("change", () => {
      saved[input.dataset.eiaCheck] = input.checked;
      localStorage.setItem("eia-guided-branch-checks", JSON.stringify(saved));
    });
  });
})();
