const mockups = [
  {
    file: "ruteo_home_marketplace_mockup.html",
    title: "Home principal",
    category: "Home principal",
    description: "Vista de exploracion inicial y marketplace de planes."
  },
  {
    file: "ruteo_login_mockup.html",
    title: "Login / Register",
    category: "Login / Register",
    description: "Acceso de usuarios para asociar reservas y tickets."
  },
  {
    file: "ruteo_mis_tickets_mockup.html",
    title: "Consulta de tickets",
    category: "Consulta de tickets",
    description: "Visualizacion de tickets digitales y estado de viaje."
  },
  {
    file: "ruteo_perfil_mockup.html",
    title: "Perfil o ajustes",
    category: "Perfil o ajustes",
    description: "Gestion de cuenta, datos y configuraciones del usuario."
  },
  {
    file: "ruteo_seleccion_asientos_mockup.html",
    title: "Seleccion de asientos",
    category: "Seleccion de asientos",
    description: "Asignacion visual de cupos dentro del vehiculo."
  },
  {
    file: "ruteo_detalle_tour_mockup.html",
    title: "Detalle de tour",
    category: "Otras funcionalidades",
    description: "Informacion detallada del plan turistico antes de reservar."
  }
];

let filteredMockups = [...mockups];
let modalIndex = 0;

const aiPublicationVersions = {
  original: {
    category: "Tour terrestre",
    title: "Viaje a Santa Marta",
    destination: "Santa Marta",
    price: "Desde $185.000",
    date: "Salida este sabado",
    description:
      "Vamos a Santa Marta en viaje turistico. Incluye transporte y acompanamiento. Salimos temprano y regresamos en la noche. Cupos disponibles.",
    itinerary: [
      "Salida en la manana",
      "Llegada a Santa Marta",
      "Tiempo libre",
      "Regreso en la noche"
    ],
    includes: ["Transporte", "Coordinador"],
    tips: "Llevar ropa comoda, hidratacion y documento."
  },
  optimized: {
    category: "Tour terrestre",
    title:
      "Escapada a Santa Marta: playa, comodidad y experiencia turistica en un solo viaje",
    destination: "Santa Marta",
    price: "Desde $185.000 por persona",
    date: "Salida programada para este sabado",
    description:
      "Disfruta una experiencia turistica hacia Santa Marta con transporte comodo, acompanamiento durante el recorrido y una planificacion mas clara para que tu viaje sea practico, organizado y agradable. Esta salida esta pensada para viajeros que buscan una opcion accesible, confiable y bien estructurada para aprovechar el dia.",
    itinerary: [
      "Encuentro y salida en horas de la manana desde el punto establecido",
      "Desplazamiento por ruta terrestre hacia Santa Marta con acompanamiento del operador",
      "Llegada al destino e inicio de la experiencia turistica",
      "Espacios para disfrute, recorrido y tiempo libre segun la programacion del plan",
      "Organizacion del retorno en horas de la tarde o noche",
      "Finalizacion del viaje en el punto acordado"
    ],
    includes: [
      "Transporte turistico terrestre",
      "Acompanamiento y coordinacion del viaje",
      "Organizacion general de la salida"
    ],
    tips:
      "Se recomienda llevar documento de identidad, ropa comoda, proteccion solar, hidratacion y elementos personales necesarios para disfrutar el recorrido con mayor comodidad."
  }
};

const aiProcessStages = [
  { text: "Analizando contenido...", progress: 14, delay: 520 },
  { text: "Optimizando titulo...", progress: 30, delay: 560 },
  { text: "Reescribiendo descripcion...", progress: 52, delay: 640 },
  { text: "Estructurando itinerario...", progress: 72, delay: 580 },
  { text: "Mejorando claridad comercial...", progress: 90, delay: 620 },
  { text: "Publicacion optimizada", progress: 100, delay: 480 }
];

let aiTimers = [];
let aiIsProcessing = false;
let aiCurrentVersion = "original";
let aiReady = false;

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

function setupMenuToggle() {
  const toggle = qs("#menuToggle");
  const nav = qs("#mainNav");

  toggle.addEventListener("click", () => {
    nav.classList.toggle("show");
  });

  qsa(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("show"));
  });
}

function setupScrollProgress() {
  const bar = qs("#scrollProgress");

  function update() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, ratio))}%`;
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
}

function setupReveal() {
  const revealItems = qsa(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupActiveNav() {
  const links = qsa(".main-nav a");
  const sections = links
    .map((link) => {
      const id = link.getAttribute("href");
      return qs(id);
    })
    .filter(Boolean);

  function activateLink() {
    const scrollPos = window.scrollY + 140;
    let currentId = "#inicio";

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) {
        currentId = `#${section.id}`;
      }
    });

    links.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === currentId);
    });
  }

  window.addEventListener("scroll", activateLink, { passive: true });
  activateLink();
}

function setupTabs() {
  const buttons = qsa(".tab-btn");
  const panels = qsa(".tab-panel");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.tab;
      buttons.forEach((b) => b.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));
      button.classList.add("active");

      const panel = qs(`#tab-${tab}`);
      if (panel) {
        panel.classList.add("active");
      }
    });
  });
}

function renderFilters() {
  const container = qs("#mockupFilters");
  const categories = ["Todos", ...new Set(mockups.map((item) => item.category))];

  container.innerHTML = categories
    .map(
      (category, idx) =>
        `<button class="filter-btn ${idx === 0 ? "active" : ""}" data-category="${category}">${category}</button>`
    )
    .join("");

  qsa(".filter-btn", container).forEach((btn) => {
    btn.addEventListener("click", () => {
      const selected = btn.dataset.category;
      qsa(".filter-btn", container).forEach((el) => el.classList.remove("active"));
      btn.classList.add("active");

      filteredMockups =
        selected === "Todos"
          ? [...mockups]
          : mockups.filter((item) => item.category === selected);

      renderMockupGrid();
    });
  });
}

function renderMockupGrid() {
  const grid = qs("#mockupGrid");
  grid.innerHTML = filteredMockups
    .map(
      (item, index) => `
      <article class="mockup-card reveal show" data-idx="${index}">
        <div class="phone-frame">
          <iframe src="${item.file}" title="${item.title}" loading="lazy"></iframe>
        </div>
        <div class="mockup-meta">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <button class="btn btn-primary open-mockup" data-idx="${index}">Ampliar vista</button>
        </div>
      </article>
    `
    )
    .join("");

  qsa(".open-mockup", grid).forEach((btn) => {
    btn.addEventListener("click", () => {
      modalIndex = Number(btn.dataset.idx);
      openModal();
    });
  });
}

function openModal() {
  const modal = qs("#mockupModal");
  const title = qs("#modalTitle");
  const frame = qs("#modalFrame");
  const active = filteredMockups[modalIndex];

  if (!active) return;

  title.textContent = `${active.title} - ${active.file}`;
  frame.src = active.file;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  const modal = qs("#mockupModal");
  const frame = qs("#modalFrame");

  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  frame.src = "";
}

function setupModal() {
  const closeBtn = qs("#modalClose");
  const prevBtn = qs("#modalPrev");
  const nextBtn = qs("#modalNext");
  const modal = qs("#mockupModal");

  closeBtn.addEventListener("click", closeModal);

  prevBtn.addEventListener("click", () => {
    modalIndex = (modalIndex - 1 + filteredMockups.length) % filteredMockups.length;
    openModal();
  });

  nextBtn.addEventListener("click", () => {
    modalIndex = (modalIndex + 1) % filteredMockups.length;
    openModal();
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("show")) return;
    if (event.key === "Escape") closeModal();
    if (event.key === "ArrowRight") {
      modalIndex = (modalIndex + 1) % filteredMockups.length;
      openModal();
    }
    if (event.key === "ArrowLeft") {
      modalIndex = (modalIndex - 1 + filteredMockups.length) % filteredMockups.length;
      openModal();
    }
  });
}

function setupCounters() {
  const counters = qsa(".count");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = Number(el.dataset.target);
        const duration = 900;
        const start = performance.now();

        function animate(now) {
          const progress = Math.min(1, (now - start) / duration);
          const value = Math.floor(progress * target);
          el.textContent = String(value);
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = String(target);
          }
        }

        requestAnimationFrame(animate);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function clearAiTimers() {
  aiTimers.forEach((timerId) => clearTimeout(timerId));
  aiTimers = [];
}

function fillAiList(listEl, items) {
  listEl.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function renderAiVersion(versionKey) {
  const version = aiPublicationVersions[versionKey];
  if (!version) return;

  qs("#aiCategory").textContent = version.category;
  qs("#aiTitle").textContent = version.title;
  qs("#aiDestination").textContent = version.destination;
  qs("#aiPrice").textContent = version.price;
  qs("#aiDate").textContent = version.date;
  qs("#aiDescription").textContent = version.description;
  qs("#aiTips").textContent = version.tips;
  fillAiList(qs("#aiItinerary"), version.itinerary);
  fillAiList(qs("#aiIncludes"), version.includes);

  const phone = qs("#aiPhone");
  const versionBadge = qs("#aiVersionBadge");

  phone.classList.toggle("optimized", versionKey === "optimized");
  versionBadge.classList.toggle("optimized", versionKey === "optimized");
  versionBadge.classList.toggle("original", versionKey !== "optimized");
  versionBadge.textContent =
    versionKey === "optimized" ? "Version optimizada" : "Publicacion original";
}

function resetAiSimulation() {
  clearAiTimers();
  aiIsProcessing = false;
  aiReady = false;
  aiCurrentVersion = "original";

  renderAiVersion("original");

  const processLayer = qs("#aiProcessLayer");
  const processText = qs("#aiProcessText");
  const progressBar = qs("#aiProgressBar");
  const progressValue = qs("#aiProgressValue");
  const mainBtn = qs("#aiEnhanceBtn");
  const secondaryActions = qs("#aiSecondaryActions");
  const compareCard = qs("#aiCompareCard");
  const resultBadge = qs("#aiResultBadge");
  const toggleVersionBtn = qs("#aiToggleVersion");

  processLayer.hidden = true;
  processText.textContent = "Analizando contenido...";
  progressBar.style.width = "0%";
  progressValue.textContent = "0%";

  mainBtn.disabled = false;
  mainBtn.classList.remove("running");
  mainBtn.textContent = "Mejorar esta publicacion con IA";

  secondaryActions.hidden = true;
  compareCard.hidden = true;
  resultBadge.hidden = true;
  toggleVersionBtn.textContent = "Ver version original";
}

function runAiSimulation() {
  if (aiIsProcessing) return;

  const processLayer = qs("#aiProcessLayer");
  const processText = qs("#aiProcessText");
  const progressBar = qs("#aiProgressBar");
  const progressValue = qs("#aiProgressValue");
  const mainBtn = qs("#aiEnhanceBtn");
  const secondaryActions = qs("#aiSecondaryActions");
  const compareCard = qs("#aiCompareCard");
  const resultBadge = qs("#aiResultBadge");
  const toggleVersionBtn = qs("#aiToggleVersion");

  aiIsProcessing = true;
  aiReady = false;
  aiCurrentVersion = "original";
  secondaryActions.hidden = true;
  compareCard.hidden = true;
  resultBadge.hidden = true;

  processLayer.hidden = false;
  mainBtn.classList.add("running");
  mainBtn.disabled = true;

  function processStage(index) {
    const stage = aiProcessStages[index];
    if (!stage) {
      const finalizeTimer = setTimeout(() => {
        aiIsProcessing = false;
        aiReady = true;
        aiCurrentVersion = "optimized";
        processLayer.hidden = true;
        renderAiVersion("optimized");
        mainBtn.classList.remove("running");
        mainBtn.textContent = "Publicacion optimizada con IA";
        secondaryActions.hidden = false;
        compareCard.hidden = false;
        resultBadge.hidden = false;
        toggleVersionBtn.textContent = "Ver version original";
      }, 380);

      aiTimers.push(finalizeTimer);
      return;
    }

    processText.textContent = stage.text;
    progressBar.style.width = `${stage.progress}%`;
    progressValue.textContent = `${stage.progress}%`;

    const stageTimer = setTimeout(() => processStage(index + 1), stage.delay);
    aiTimers.push(stageTimer);
  }

  processStage(0);
}

function setupAiUpgradeModal() {
  const openBtn = qs("#openAiUpgradeModal");
  const modal = qs("#aiUpgradeModal");
  const closeBtn = qs("#aiModalClose");
  const enhanceBtn = qs("#aiEnhanceBtn");
  const toggleVersionBtn = qs("#aiToggleVersion");
  const resimulateBtn = qs("#aiResimulateBtn");

  if (!openBtn || !modal) return;

  function openAiModal() {
    resetAiSimulation();
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function closeAiModal() {
    clearAiTimers();
    aiIsProcessing = false;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }

  openBtn.addEventListener("click", openAiModal);
  closeBtn.addEventListener("click", closeAiModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeAiModal();
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("show")) return;
    if (event.key === "Escape") closeAiModal();
  });

  enhanceBtn.addEventListener("click", runAiSimulation);

  toggleVersionBtn.addEventListener("click", () => {
    if (!aiReady || aiIsProcessing) return;

    aiCurrentVersion = aiCurrentVersion === "optimized" ? "original" : "optimized";
    renderAiVersion(aiCurrentVersion);
    toggleVersionBtn.textContent =
      aiCurrentVersion === "optimized" ? "Ver version original" : "Ver version optimizada";
  });

  resimulateBtn.addEventListener("click", () => {
    resetAiSimulation();
    runAiSimulation();
  });
}

function setupSeatSimulationModal() {
  const openBtn = qs("#openSeatSimulation");
  const modal = qs("#seatSimulationModal");
  const closeBtn = qs("#seatModalClose");
  const resetBtn = qs("#seatResetSimulation");
  const frame = qs("#seatSimulationFrame");

  if (!openBtn || !modal || !frame) return;

  function resetSeatSimulationFrame() {
    frame.src = "ruteo_seleccion_asientos_mockup.html";
  }

  function openSeatModal() {
    resetSeatSimulationFrame();
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function closeSeatModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }

  openBtn.addEventListener("click", openSeatModal);

  if (closeBtn) {
    closeBtn.addEventListener("click", closeSeatModal);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetSeatSimulationFrame);
  }

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeSeatModal();
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("show")) return;
    if (event.key === "Escape") closeSeatModal();
  });
}

function init() {
  setupMenuToggle();
  setupScrollProgress();
  setupReveal();
  setupActiveNav();
  setupTabs();
  renderFilters();
  renderMockupGrid();
  setupModal();
  setupCounters();
  setupAiUpgradeModal();
  setupSeatSimulationModal();
}

init();
