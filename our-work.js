// portfolio-grid.js
async function loadPortfolio() {
    const response = await fetch("projects.json");
    const projects = await response.json();
    renderProjects(projects);

    // Filters
    document.querySelectorAll(".portfolio-filters button").forEach(btn => {
        btn.addEventListener("click", () => {
            const filter = btn.dataset.filter;
            document.querySelectorAll(".portfolio-filters button").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filtered = filter === "all" ? projects : projects.filter(p => p.filterTag.includes(filter));

            gsap.to(".portfolio-card", {
                opacity: 0, y: 30, stagger: 0.05, onComplete: () => {
                    renderProjects(filtered);
                }
            });
        });
    });
}

function renderProjects(projects) {
     const grid = document.getElementById("portfolioGrid");
  grid.innerHTML = projects.map(p => `
    <div class="portfolio-card">
      <img src="${p.imageSrc}" alt="${p.altText}" class="portfolio-img">
      <div class="portfolio-content">
        <h3 class="portfolio-title">${p.altText}</h3>
        <p class="portfolio-desc">${p.description || ""}</p>
    <p class="portfolio-tech">Tech: ${p.techTags.join(", ")}</p>
    <a href="${p.liveUrl}" target="_blank" class="portfolio-cta">Visit Now</a>
      </div>
    </div>
  `).join("");

    // gsap.from(".portfolio-card", { opacity: 0, y: 40, stagger: 0.1, duration: 0.6, ease: "power2.out" });
    gsap.from(".portfolio-card", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
            trigger: ".portfolio-grid",
            start: "top 90%"
        }
    });
}

loadPortfolio();
