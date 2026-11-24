document.addEventListener("DOMContentLoaded", () => {

    /* 1. Theme-Umschaltung (Hell / Dunkel) */
    const root = document.documentElement;
    const themeBtn = document.getElementById("theme-toggle");
    const themeLabel = themeBtn.querySelector(".theme-label");

    const savedTheme = localStorage.getItem("leica-theme") || "light";
    applyTheme(savedTheme);

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        localStorage.setItem("leica-theme", theme);
        themeLabel.textContent = theme === "dark" ? "Hell" : "Dunkel";
    }

    themeBtn.addEventListener("click", () => {
        const activeTheme = root.getAttribute("data-theme");
        applyTheme(activeTheme === "dark" ? "light" : "dark");
    });

    /* 2. Dynamisches Relighting: Mauszeiger führt Lichtspot */
    const heroBlock = document.getElementById("objekt");
    if (heroBlock) {
        heroBlock.addEventListener("mousemove", (e) => {
            const rect = heroBlock.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            heroBlock.style.setProperty("--light-x", `${x}px`);
            heroBlock.style.setProperty("--light-y", `${y}px`);
        });
    }

    /* 3. Koinzidenzsucher: Doppelbild & Leuchtrahmen */
    const focusSlider = document.getElementById("focus-slider");
    const ghostImage = document.getElementById("ghost-image");

    if (focusSlider && ghostImage) {
        focusSlider.addEventListener("input", (e) => {
            ghostImage.style.transform = `translateX(${e.target.value}px)`;
        });
    }

    const vfBtns = document.querySelectorAll(".vf-btn");
    const frames = {
        "50": document.getElementById("vf-frame-50"),
        "90": document.getElementById("vf-frame-90"),
        "135": document.getElementById("vf-frame-135")
    };

    vfBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            vfBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const focal = btn.getAttribute("data-focal");
            Object.keys(frames).forEach(key => {
                if (frames[key]) {
                    frames[key].classList.toggle("active", key === focal);
                }
            });
        });
    });

    /* 4. Wechsel Startseite <-> Impressum */
    const viewMain = document.getElementById("view-main");
    const viewImpressum = document.getElementById("view-impressum");
    const headerTitle = document.getElementById("header-page-title");
    const navBrand = document.getElementById("nav-brand");
    const desktopNav = document.getElementById("desktop-nav");

    const btnToImpressumNav = document.getElementById("btn-to-impressum-nav");
    const btnToImpressumFooter = document.getElementById("btn-to-impressum-footer");
    const btnBackHome = document.getElementById("btn-back-home");

    function openImpressum() {
        viewMain.classList.remove("active");
        viewImpressum.classList.add("active");
        headerTitle.textContent = "Impressum";
        desktopNav.style.visibility = "hidden";
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function openHome() {
        viewImpressum.classList.remove("active");
        viewMain.classList.add("active");
        headerTitle.textContent = "Startseite";
        desktopNav.style.visibility = "visible";
    }

    if (btnToImpressumNav) btnToImpressumNav.addEventListener("click", openImpressum);
    if (btnToImpressumFooter) btnToImpressumFooter.addEventListener("click", openImpressum);
    if (btnBackHome) btnBackHome.addEventListener("click", () => {
        openHome();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    if (navBrand) navBrand.addEventListener("click", openHome);

    /* 5. Header-Navigation: Sanfter Sprung */
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            if (!viewMain.classList.contains("active")) {
                openHome();
            }
            const targetId = link.getAttribute("href");
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    /* 6. Sunny-16-Kalkulator */
    const lightSelect = document.getElementById("calc-light");
    const isoSelect = document.getElementById("calc-iso");
    const resultText = document.getElementById("calc-result-text");

    function updateSunny16() {
        const aperture = lightSelect.value;
        const iso = parseInt(isoSelect.value, 10);

        let shutter = "1/500 s";
        if (iso <= 125) shutter = "1/125 s";
        else if (iso <= 250) shutter = "1/250 s";
        else if (iso <= 500) shutter = "1/500 s";
        else shutter = "1/1000 s";

        resultText.textContent = `f/${aperture} · ${shutter} · LW 13 (ISO ${iso})`;
    }

    if (lightSelect && isoSelect) {
        lightSelect.addEventListener("change", updateSunny16);
        isoSelect.addEventListener("change", updateSunny16);
    }

    /* 7. Kontaktformular Demo */
    const contactForm = document.getElementById("contact-form");
    const feedbackBox = document.getElementById("form-feedback");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("form-name").value;
            feedbackBox.style.display = "block";
            feedbackBox.textContent = `Vielen Dank für den Auftrag, ${name}! Die Laboranweisung wurde simuliert übermittelt.`;
            contactForm.reset();
            setTimeout(() => {
                feedbackBox.style.display = "none";
            }, 6000);
        });
    }

});