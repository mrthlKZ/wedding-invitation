/* ==========================================================================
   WEDDING INVITATION WEBSITE JAVASCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------
    // 1. Initial State & DOM Element Caches
    // ----------------------------------------------------
    const body = document.body;
    const welcomeScreen = document.getElementById("welcome-screen");
    const viewInviteBtn = document.getElementById("view-invite-btn");
    const invitationDetails = document.getElementById("invitation-details");
    const bgMusic = document.getElementById("bg-music");
    const musicBtn = document.getElementById("music-btn");
    const musicWave = document.getElementById("music-wave");
    const petalContainer = document.getElementById("petal-container");


    // Dynamic QR Target Link
    const mapsLinkEl = document.getElementById("nav-maps-link");
    const mapsUrl = mapsLinkEl ? mapsLinkEl.getAttribute("href") : "https://maps.google.com/?q=Velimukku,+Malappuram,+Kerala";

    // ----------------------------------------------------
    // 2. Ripple Effect & Page Transition
    // ----------------------------------------------------
    if (viewInviteBtn) {
        viewInviteBtn.addEventListener("click", function(e) {
            // Create Ripple Effect
            const ripple = document.createElement("span");
            ripple.classList.add("btn-ripple");
            
            // Calculate coordinates relative to the button
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            // Remove ripple after animation completes
            setTimeout(() => {
                ripple.remove();
            }, 600);

            // Play background music (avoids autoplay restrictions by triggering on user gesture)
            playAudio();

            // Transition from Page 1 (Welcome Screen) to Page 2 (Details)
            welcomeScreen.classList.add("slide-up");
            body.classList.remove("no-scroll");
            
            if (invitationDetails) {
                invitationDetails.classList.remove("hidden");
                // Small delay to allow CSS transitions to trigger
                setTimeout(() => {
                    invitationDetails.classList.add("fade-in");
                    // Trigger scroll reveals for top components immediately
                    handleScrollReveal();
                }, 100);
            }

            // Remove welcome screen from accessibility tree once slid away
            setTimeout(() => {
                welcomeScreen.style.display = "none";
            }, 1200);
        });
    }

    // ----------------------------------------------------
    // 3. Ambient Audio Control Player
    // ----------------------------------------------------
    let isPlaying = false;

    // Try playing audio and handle promise
    function playAudio() {
        if (!bgMusic) return;
        bgMusic.volume = 0.4; // Soft background volume
        bgMusic.play()
            .then(() => {
                isPlaying = true;
                musicBtn.classList.add("playing");
                musicBtn.setAttribute("aria-label", "Pause background music");
            })
            .catch(err => {
                console.log("Audio playback failed or was prevented: ", err);
                isPlaying = false;
                musicBtn.classList.remove("playing");
            });
    }

    function pauseAudio() {
        if (!bgMusic) return;
        bgMusic.pause();
        isPlaying = false;
        musicBtn.classList.remove("playing");
        musicBtn.setAttribute("aria-label", "Play background music");
    }

    if (musicBtn) {
        musicBtn.addEventListener("click", () => {
            if (isPlaying) {
                pauseAudio();
            } else {
                playAudio();
            }
        });
    }

    // ----------------------------------------------------
    // 4. Live Countdown Timer
    // ----------------------------------------------------
    // Target Date: August 16, 2026 00:00:00 (Bride's local timezone)
    const targetDate = new Date("August 16, 2026 00:00:00").getTime();

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    const countdownWrapper = document.querySelector(".countdown-wrapper");
    const weddingDayMessage = document.getElementById("wedding-day-message");

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            // Wedding has happened / is happening today
            if (countdownWrapper) countdownWrapper.classList.add("hidden");
            if (weddingDayMessage) weddingDayMessage.classList.remove("hidden");
            
            if (daysEl) daysEl.innerText = "00";
            if (hoursEl) hoursEl.innerText = "00";
            if (minutesEl) minutesEl.innerText = "00";
            if (secondsEl) secondsEl.innerText = "00";
            return;
        }

        // Calculations
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Format leading zeros
        if (daysEl) daysEl.innerText = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.innerText = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.innerText = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.innerText = seconds.toString().padStart(2, '0');
    }

    // Initial run and repeat every second
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ----------------------------------------------------
    // 5. Dynamic QR Code Generation
    // ----------------------------------------------------
    const qrContainer = document.getElementById("qrcode");
    const qrFallback = document.getElementById("qrcode-fallback");

    if (qrContainer) {
        try {
            // Check if QRCode library is loaded
            if (typeof QRCode !== "undefined") {
                new QRCode(qrContainer, {
                    text: mapsUrl,
                    width: 170,
                    height: 170,
                    colorDark: "#6D071A",  // Matches maroon color
                    colorLight: "#FFFFFF", // Standard high contrast background
                    correctLevel: QRCode.CorrectLevel.H
                });
            } else {
                throw new Error("QRCode.js CDN not loaded");
            }
        } catch (error) {
            console.warn("QR code generation error, showing fallback: ", error);
            if (qrFallback) {
                qrFallback.classList.remove("hidden");
            }
        }
    }

    // ----------------------------------------------------
    // 5b. Add to Calendar Functionality
    // ----------------------------------------------------
    const googleCalBtn = document.getElementById("google-cal-btn");
    const icsCalBtn = document.getElementById("ics-cal-btn");
    const outlookCalBtn = document.getElementById("outlook-cal-btn");

    if (googleCalBtn) {
        googleCalBtn.addEventListener("click", () => {
            const googleUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+of+Nishna+and+Jasanth&dates=20260816T040000Z/20260816T080000Z&details=You+are+cordially+invited+to+the+wedding+ceremony+of+Nishna+and+Jasanth.+Muhurtham:+9:30+AM+-+10:30+AM.&location=Bride%27s+Home,+Velimukku,+Kerala";
            window.open(googleUrl, "_blank");
        });
    }

    if (outlookCalBtn) {
        outlookCalBtn.addEventListener("click", () => {
            const outlookUrl = "https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=Wedding+of+Nishna+and+Jasanth&startdt=2026-08-16T09:30:00&enddt=2026-08-16T13:30:00&body=You+are+cordially+invited+to+the+wedding+ceremony+of+Nishna+and+Jasanth.+Muhurtham:+9:30+AM+-+10:30+AM.&location=Bride%27s+Home,+Velimukku,+Kerala";
            window.open(outlookUrl, "_blank");
        });
    }

    if (icsCalBtn) {
        icsCalBtn.addEventListener("click", () => {
            const icsContent = [
                "BEGIN:VCALENDAR",
                "VERSION:2.0",
                "PRODID:-//Nishna & Jasanth Wedding//NONSGML v1.0//EN",
                "BEGIN:VEVENT",
                "UID:wedding-" + new Date().getTime() + "@nishna-jasanth.wedding",
                "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
                "DTSTART:20260816T040000Z", // 9:30 AM IST (UTC+5:30)
                "DTEND:20260816T080000Z",   // 1:30 PM IST (UTC+5:30)
                "SUMMARY:Wedding of Nishna & Jasanth",
                "DESCRIPTION:Join us for the wedding ceremony of Nishna & Jasanth. Muhurtham: 09:30 AM - 10:30 AM.",
                "LOCATION:Bride's Home, Velimukku, Malappuram, Kerala",
                "END:VEVENT",
                "END:VCALENDAR"
            ].join("\r\n");

            const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8;" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", "wedding-nishna-jasanth.ics");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // ----------------------------------------------------
    // 6. Floating Flower Petals / Hearts Generator
    // ----------------------------------------------------
    // Collection of decorative elements (SVGs) to generate organic flow
    const petalSVGList = [
        // Petal Shape 1 (Gold Accent)
        `<svg viewBox="0 0 30 30" fill="#D4AF37" width="100%" height="100%"><path d="M15 0 C 22 10, 30 18, 15 30 C 0 18, 8 10, 15 0 Z" opacity="0.6"/></svg>`,
        // Petal Shape 2 (Soft Pink/Cream Accent)
        `<svg viewBox="0 0 30 30" fill="#F4E0A5" width="100%" height="100%"><path d="M12 0 C 25 5, 25 25, 12 30 C -1 25, -1 5, 12 0 Z" opacity="0.55"/></svg>`,
        // Mini Heart (Maroon Accent)
        `<svg viewBox="0 0 30 30" fill="#6D071A" width="100%" height="100%"><path d="M15 8 C 15 8, 11 3, 7 3 C 3 3, 0 6, 0 10 C 0 16, 8 22, 15 28 C 22 22, 30 16, 30 10 C 30 6, 27 3, 23 3 C 19 3, 15 8, 15 8 Z" opacity="0.45"/></svg>`
    ];

    function createFallingPetal() {
        if (!petalContainer) return;

        // Limit maximum petals on screen to protect frame rates
        if (petalContainer.childElementCount > 25) return;

        const petal = document.createElement("span");
        petal.classList.add("falling-petal");

        // Randomize shape
        const randomIndex = Math.floor(Math.random() * petalSVGList.length);
        petal.innerHTML = petalSVGList[randomIndex];

        // Random positions and anim behaviors
        const startLeft = Math.random() * 100; // 0% - 100% viewport width
        const size = Math.random() * 15 + 10; // 10px - 25px
        const duration = Math.random() * 6 + 5; // 5s - 11s animation time
        const startRotation = Math.random() * 360;

        petal.style.left = `${startLeft}vw`;
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.animationDuration = `${duration}s`;
        
        // Add random keyframe offsets via custom properties
        petal.style.setProperty("--start-rot", `${startRotation}deg`);

        petalContainer.appendChild(petal);

        // Remove from DOM when animation ends
        setTimeout(() => {
            petal.remove();
        }, duration * 1000);
    }

    // Generate elements periodically
    setInterval(createFallingPetal, 700);

    // ----------------------------------------------------
    // 7. Scroll Reveal Intersection Observer
    // ----------------------------------------------------
    const revealElements = document.querySelectorAll(".scroll-reveal");

    function handleScrollReveal() {
        const triggerBottom = window.innerHeight * 0.92;

        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;

            if (elTop < triggerBottom) {
                el.classList.add("active");
            }
        });
    }

    // Fallback if IntersectionObserver is not supported
    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target); // Stop observing once revealed
                }
            });
        }, {
            root: null, // viewport
            threshold: 0.1, // 10% of element visible
            rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        // Scroll listener fallback
        window.addEventListener("scroll", handleScrollReveal);
    }

});
