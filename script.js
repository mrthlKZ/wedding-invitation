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



    // ----------------------------------------------------
    // 2. Ripple Effect & Page Transition
    // ----------------------------------------------------
    if (viewInviteBtn) {
        viewInviteBtn.addEventListener("click", function (e) {
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


            // 1. Slide away the landing page immediately
            welcomeScreen.classList.add("slide-up");

            // 2. Play background music (avoids autoplay restrictions by triggering on user gesture)
            playAudio();

            // 3. Show "You are Invited" overlay text as the landing page slides away
            const transitionOverlay = document.getElementById("invite-transition-overlay");
            if (transitionOverlay) {
                setTimeout(() => {
                    transitionOverlay.classList.remove("hidden");
                    void transitionOverlay.offsetWidth;
                    transitionOverlay.classList.add("show");
                }, 300);
            }

            // 4. Fade out the "You are Invited" overlay text
            setTimeout(() => {
                if (transitionOverlay) {
                    transitionOverlay.classList.remove("show");
                }
            }, 1600); // 300ms delay + 1300ms display hold

            // 5. Slowly slide in the details page
            setTimeout(() => {
                if (invitationDetails) {
                    // Synchronously activate first few scroll reveal elements to prevent asynchronous observer lag
                    invitationDetails.querySelectorAll(".scroll-reveal").forEach((el, index) => {
                        if (index < 2) {
                            el.classList.add("active");
                        }
                    });

                    invitationDetails.classList.add("slide-in");
                    handleScrollReveal();
                }
            }, 2200); // 1600ms + 600ms text fade out duration

            // 6. Unlock body scrolling, activate page scroll and clean up transition overlays
            setTimeout(() => {
                body.classList.remove("no-scroll");
                welcomeScreen.style.display = "none";
                if (transitionOverlay) {
                    transitionOverlay.style.display = "none";
                }
                // Convert details page from viewport-locked fixed state to normal document flow
                if (invitationDetails) {
                    invitationDetails.classList.add("active-scroll");
                }
            }, 3800); // 2200ms slide start + 1500ms slide duration + 100ms buffer
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
        musicBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent triggering the document-level gesture listener
            if (isPlaying) {
                pauseAudio();
            } else {
                playAudio();
            }
        });
    }

    // Attempt to play audio on initial load
    playAudio();

    // Bypass browser autoplay blocks by playing on first user gesture
    const enableAudioOnGesture = () => {
        if (!isPlaying) {
            playAudio();
        }
        // Clean up listeners after first interaction
        document.removeEventListener("click", enableAudioOnGesture);
        document.removeEventListener("touchstart", enableAudioOnGesture);
        document.removeEventListener("scroll", enableAudioOnGesture);
    };

    document.addEventListener("click", enableAudioOnGesture);
    document.addEventListener("touchstart", enableAudioOnGesture);
    document.addEventListener("scroll", enableAudioOnGesture);

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
    // 5b. Add to Calendar Functionality
    // ----------------------------------------------------
    const googleCalBtn = document.getElementById("google-cal-btn");
    const icsCalBtn = document.getElementById("ics-cal-btn");
    const outlookCalBtn = document.getElementById("outlook-cal-btn");
    const addToCalBtn = document.getElementById("add-to-cal-btn");
    const calendarDropdownMenu = document.getElementById("calendar-dropdown-menu");
    const detailsSection = document.getElementById("details-section");

    if (addToCalBtn && calendarDropdownMenu) {
        addToCalBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isExpanded = addToCalBtn.getAttribute("aria-expanded") === "true";
            addToCalBtn.setAttribute("aria-expanded", !isExpanded);
            calendarDropdownMenu.classList.toggle("show");
            if (detailsSection) {
                detailsSection.classList.toggle("dropdown-open");
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", () => {
            addToCalBtn.setAttribute("aria-expanded", "false");
            calendarDropdownMenu.classList.remove("show");
            if (detailsSection) {
                detailsSection.classList.remove("dropdown-open");
            }
        });
    }

    if (googleCalBtn) {
        googleCalBtn.addEventListener("click", () => {
            const googleUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+Reception+of+Jasanth+and+Nishna&dates=20260816T103000Z/20260816T143000Z&details=You+are+cordially+invited+to+the+wedding+reception+of+Jasanth+and+Nishna.+Time:+4:00+PM+-+8:00+PM.&location=Breeze+Mahal+Auditorium,+Malappuram,+Kerala";
            window.open(googleUrl, "_blank");
        });
    }

    if (outlookCalBtn) {
        outlookCalBtn.addEventListener("click", () => {
            const outlookUrl = "https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=Wedding+Reception+of+Jasanth+and+Nishna&startdt=2026-08-16T16:00:00&enddt=2026-08-16T20:00:00&body=You+are+cordially+invited+to+the+wedding+reception+of+Jasanth+and+Nishna.+Time:+4:00+PM+-+8:00+PM.&location=Breeze+Mahal+Auditorium,+Malappuram,+Kerala";
            window.open(outlookUrl, "_blank");
        });
    }

    if (icsCalBtn) {
        icsCalBtn.addEventListener("click", () => {
            const icsContent = [
                "BEGIN:VCALENDAR",
                "VERSION:2.0",
                "PRODID:-//Jasanth & Nishna Wedding//NONSGML v1.0//EN",
                "BEGIN:VEVENT",
                "UID:reception-" + new Date().getTime() + "@jasanth-nishna.wedding",
                "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
                "DTSTART:20260816T103000Z", // 4:00 PM IST (UTC+5:30)
                "DTEND:20260816T143000Z",   // 8:00 PM IST (UTC+5:30)
                "SUMMARY:Wedding Reception of Jasanth & Nishna",
                "DESCRIPTION:Join us for the wedding reception of Jasanth & Nishna. Time: 04:00 PM - 08:00 PM.",
                "LOCATION:Breeze Mahal Auditorium, Malappuram, Kerala",
                "END:VEVENT",
                "END:VCALENDAR"
            ].join("\r\n");

            const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8;" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", "reception-jasanth-nishna.ics");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
    // ----------------------------------------------------
    // 5c. Dynamic Background Images (Low Opacity)
    // ----------------------------------------------------
    const albumImages = [
        { selector: "#welcome-screen", img: "image-6.jpeg", opacity: 0.25 },
        { selector: ".invitation-details", img: "image-7.jpeg", opacity: 0.08 },
        { selector: ".hero-section", img: "image-1.jpeg", opacity: 0.15 },
        { selector: ".wedding-details-section", img: "image-2.jpeg", opacity: 0.15 },
        { selector: ".countdown-section", img: "image-3.jpeg", opacity: 0.25 },
        { selector: ".reception-section", img: "image-4.jpeg", opacity: 0.15 }
    ];

    albumImages.forEach(cfg => {
        const container = document.querySelector(cfg.selector);
        if (container) {
            // Create background element
            const bgEl = document.createElement("div");
            bgEl.classList.add("section-bg-image");
            bgEl.style.backgroundImage = `url('assets/photo-album/${cfg.img}')`;
            bgEl.style.opacity = cfg.opacity;
            
            // Prepend so it loads behind all text and interactive items
            container.insertBefore(bgEl, container.firstChild);
        }
    });

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
