const corridorImages = [
  "bottle-brand.png",
  "earth-satellite.png",
  "fanta-ad.png",
  "island-house.png",
  "pool-slide.png",
  "hill-house.png",
  "keyboard.png",
  "nike-booth.png",
  "sky-castle.png",
  "country-road.png",
  "cozy-room.png",
  "bee-plush.png",
  "neon-rush-brand.png",
  "coffee-roast-brand.png",
  "perfume-bottle.png",
].map((name) => `assets/${name}`);

const sharedCardImages = [
  "bottle-brand.png",
  "earth-satellite.png",
  "island-house.png",
  "pool-slide.png",
  "hill-house.png",
  "sky-castle.png",
  "country-road.png",
].map((name) => `assets/${name}`);

const sharedCardMeta = [
  { title: "Self Brand", caption: "A personal identity study in glass and light." },
  { title: "Orbit", caption: "A satellite drifting past Earth and its moon." },
  { title: "Island House", caption: "A cozy cabin diorama, tucked into the tide." },
  { title: "Bath House", caption: "Twin slides inside a sunlit bathhouse." },
  {
    title: "Hilltop Cottage",
    caption: "A flowering hill, and the house at its peak.",
    video: "assets/reel-flower-house.mp4",
  },
  { title: "Floating Sanctuary", caption: "A castle suspended above the clouds." },
  {
    title: "The Path Ahead",
    caption: "A quiet trail cresting a windswept hill.",
    video: "assets/reel-country-road.mp4",
  },
];

const placeholderCards = [
  { color: "#ef5d45", x: -508, y: 28, rotation: -20 },
  { color: "#5977d9", x: -339, y: 6, rotation: -13.33 },
  { color: "#f2c84b", x: -169, y: -5, rotation: -6.67 },
  { color: "#f08bae", x: 0, y: -10, rotation: 0 },
  { color: "#8b55b5", x: 169, y: -5, rotation: 6.67 },
  { color: "#f06d35", x: 339, y: 6, rotation: 13.33 },
  { color: "#57ad82", x: 508, y: 28, rotation: 20 },
];

const marketplaceCards = [
  { x: 80, y: 20, rotation: -12 },
  { x: 230, y: 75, rotation: -8 },
  { x: 380, y: 130, rotation: -4 },
  { x: 530, y: 185, rotation: 1 },
  { x: 680, y: 240, rotation: 6 },
  { x: 830, y: 295, rotation: 11 },
  { x: "calc(50vw + 24px)", y: "38vh", rotation: 16 },
];

const SLOT_TRAVEL = [0, 0.06, 0.145, 0.255, 0.375, 0.485, 0.585];
const SLOT_SCALE_RATIO = [0.1, 0.16, 0.27, 0.43, 0.68, 1, 1.35];
const SLOT_ROTATION = [12, 16, 21, 27, 33, 39, 45];
const TRACK_SPACING = 0.9;
const BIRTH_GROWTH_SLOTS = 1;
const PRE_PUSH_START_SLOT = 0.55;
const PRE_PUSH_END_SLOT = 1.85;
const BAR_START = 180;
const BAR_END = 900;
const IMAGE_REVEAL_PROGRESS = 0.8;
const IMAGE_START =
  BAR_START +
  (BAR_END - BAR_START) * (1 - Math.cbrt(1 - IMAGE_REVEAL_PROGRESS));
const FILL_DURATION = 1000;
const FILLED_STREAM_POSITION = 6;
const STEADY_SPEED = 1.25 * (2 / 3);
const INITIAL_SPEED =
  (2 * FILLED_STREAM_POSITION) / (FILL_DURATION / 1000) - STEADY_SPEED;
const DECELERATION =
  (STEADY_SPEED - INITIAL_SPEED) / (FILL_DURATION / 1000);
const STREAM_PAIR_COUNT = 32;
const MAX_VISIBLE_SLOT = 5.25;

const scroller = document.querySelector(".page-scroll");
const corridor = document.querySelector(".corridor");
const aperture = document.querySelector(".center-aperture");
const sharedStage = document.querySelector(".shared-card-stage");
const displayScreen = document.querySelector(".display-screen");
const marketplaceScreen = document.querySelector(".marketplace-screen");
const featuredScreen = document.querySelector(".featured-screen");
const strengthsScreen = document.querySelector(".strengths-screen");
const thanksScreen = document.querySelector(".thanks-screen");
const siteHeader = document.querySelector(".site-header");
const backToTopButton = document.querySelector(".back-to-top");
const brandButton = document.querySelector(".brand");
const brandPopover = document.querySelector(".brand-popover");

function openBrandPopover() {
  brandPopover.classList.remove("is-hidden");
  brandButton.setAttribute("aria-expanded", "true");
}

function closeBrandPopover() {
  brandPopover.classList.add("is-hidden");
  brandButton.setAttribute("aria-expanded", "false");
}

brandButton.addEventListener("click", (event) => {
  event.stopPropagation();
  const isHidden = brandPopover.classList.contains("is-hidden");
  if (isHidden) openBrandPopover();
  else closeBrandPopover();
});
brandPopover.addEventListener("click", (event) => event.stopPropagation());
document.addEventListener("click", closeBrandPopover);
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeBrandPopover();
});
const cardElements = [];

const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxVideo = document.querySelector(".lightbox-video");
const lightboxTitle = document.querySelector(".lightbox-title");
const lightboxCaption = document.querySelector(".lightbox-caption");
const lightboxCounter = document.querySelector(".lightbox-counter");
const lightboxCloseButton = document.querySelector(".lightbox-close");
const lightboxPrevButton = document.querySelector(".lightbox-prev");
const lightboxNextButton = document.querySelector(".lightbox-next");
let lightboxIndex = 0;
let lightboxOpen = false;

function renderLightbox() {
  const meta = sharedCardMeta[lightboxIndex] ?? {};
  lightboxTitle.textContent = meta.title ?? "";
  lightboxCaption.textContent = meta.caption ?? "";
  lightboxCounter.textContent = `${lightboxIndex + 1} / ${sharedCardImages.length}`;

  if (meta.video) {
    lightboxImage.classList.add("is-hidden");
    lightboxVideo.classList.remove("is-hidden");
    lightboxVideo.src = meta.video;
    lightboxVideo.currentTime = 0;
    lightboxVideo.play().catch(() => {});
  } else {
    lightboxVideo.pause();
    lightboxVideo.removeAttribute("src");
    lightboxVideo.load();
    lightboxVideo.classList.add("is-hidden");
    lightboxImage.classList.remove("is-hidden");
    lightboxImage.src = sharedCardImages[lightboxIndex];
    lightboxImage.alt = meta.title ?? "";
  }
}

function openLightbox(index) {
  lightboxIndex = index;
  lightboxOpen = true;
  renderLightbox();
  lightbox.classList.remove("is-hidden");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  lightboxOpen = false;
  lightboxVideo.pause();
  lightbox.classList.add("is-hidden");
  lightbox.setAttribute("aria-hidden", "true");
}

function stepLightbox(delta) {
  lightboxIndex =
    (lightboxIndex + delta + sharedCardImages.length) % sharedCardImages.length;
  renderLightbox();
}

lightboxCloseButton.addEventListener("click", closeLightbox);
lightboxPrevButton.addEventListener("click", () => stepLightbox(-1));
lightboxNextButton.addEventListener("click", () => stepLightbox(1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightbox.addEventListener("wheel", (event) => event.stopPropagation(), {
  passive: true,
});
window.addEventListener("keydown", (event) => {
  if (!lightboxOpen) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") stepLightbox(-1);
  if (event.key === "ArrowRight") stepLightbox(1);
});

const clamp = (value, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max);
const easeInOut = (value) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
const easeOut = (value) => 1 - Math.pow(1 - clamp(value), 3);
const easeIntoLinearMotion = (value) => {
  const t = clamp(value);
  return t * t * (2 - t);
};

function interpolateSlot(values, slot) {
  const last = values.length - 1;
  if (slot >= last) {
    const step = values[last] - values[last - 1];
    return values[last] + step * (slot - last);
  }

  const lower = Math.max(Math.floor(slot), 0);
  const upper = Math.min(lower + 1, last);
  const mix = slot - lower;
  const mixSquared = mix * mix;
  const mixCubed = mixSquared * mix;

  const getSlope = (index) => {
    if (index === 0) return values[1] - values[0];
    if (index === last) return values[last] - values[last - 1];
    const before = values[index] - values[index - 1];
    const after = values[index + 1] - values[index];
    if (before === 0 || after === 0 || before * after < 0) return 0;
    return (2 * before * after) / (before + after);
  };

  const lowerSlope = getSlope(lower);
  const upperSlope = getSlope(upper);
  return (
    (2 * mixCubed - 3 * mixSquared + 1) * values[lower] +
    (mixCubed - 2 * mixSquared + mix) * lowerSlope +
    (-2 * mixCubed + 3 * mixSquared) * values[upper] +
    (mixCubed - mixSquared) * upperSlope
  );
}

function getStreamPosition(elapsed) {
  const motionElapsed = Math.max(elapsed - IMAGE_START, 0) / 1000;
  const fillSeconds = FILL_DURATION / 1000;
  if (motionElapsed <= fillSeconds) {
    return (
      INITIAL_SPEED * motionElapsed +
      0.5 * DECELERATION * motionElapsed * motionElapsed
    );
  }
  return FILLED_STREAM_POSITION + (motionElapsed - fillSeconds) * STEADY_SPEED;
}

function createCorridorCards() {
  const fragment = document.createDocumentFragment();
  for (let pairIndex = 0; pairIndex < STREAM_PAIR_COUNT; pairIndex += 1) {
    [0, 1].forEach((sideIndex) => {
      const cardIndex = pairIndex * 2 + sideIndex;
      const imageIndex = (cardIndex * 2 + 7) % corridorImages.length;
      const card = document.createElement("div");
      card.className = "color-card";
      card.style.backgroundImage = `url("${corridorImages[imageIndex]}")`;
      card.style.setProperty("--base-shift", sideIndex === 0 ? "-100%" : "0%");
      card.style.setProperty("--origin-x", sideIndex === 0 ? "100%" : "0%");
      card.setAttribute("aria-hidden", "true");
      cardElements.push(card);
      fragment.appendChild(card);
    });
  }
  corridor.appendChild(fragment);
}

function createSharedCards() {
  placeholderCards.forEach((card, index) => {
    const thirdCard = marketplaceCards[index];
    const element = document.createElement("span");
    element.className = "placeholder-card shared-card";
    element.style.setProperty("--card-color", card.color);
    element.style.backgroundImage = `url("${sharedCardImages[index]}")`;
    element.style.setProperty("--card-x", `${card.x}px`);
    element.style.setProperty("--card-y", `${card.y}px`);
    element.style.setProperty("--card-rotation", `${card.rotation}deg`);
    element.style.setProperty(
      "--third-x",
      typeof thirdCard.x === "number" ? `${thirdCard.x}px` : thirdCard.x,
    );
    element.style.setProperty(
      "--third-y",
      typeof thirdCard.y === "number" ? `${thirdCard.y}px` : thirdCard.y,
    );
    element.style.setProperty("--third-rotation", `${thirdCard.rotation}deg`);
    element.style.setProperty("--card-delay", `${index * 0.055}s`);
    element.style.setProperty("--card-order", index);
    element.setAttribute("role", "button");
    element.setAttribute("tabindex", "0");
    element.setAttribute(
      "aria-label",
      `Open ${sharedCardMeta[index]?.title ?? "project"} in full view`,
    );
    element.addEventListener("click", () => openLightbox(index));
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index);
      }
    });
    sharedStage.appendChild(element);
  });
}

let corridorStartedAt = performance.now();
let corridorFrame = 0;

function restartCorridor() {
  corridorStartedAt = performance.now();
}

function renderCorridor(now) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const elapsed = reduceMotion
    ? BAR_END + FILL_DURATION + 900
    : now - corridorStartedAt;
  const width = corridor.clientWidth;
  const baseCardWidth = cardElements[0]?.offsetWidth || width * 0.125;
  const baseCardHeight = (baseCardWidth * 4) / 3;
  const outerScale = (window.innerHeight * 0.8) / baseCardHeight;
  const centerScaleRatio = aperture.offsetHeight / (baseCardHeight * outerScale);
  const scaleRatios = [centerScaleRatio, ...SLOT_SCALE_RATIO.slice(1)];
  const prePushDistance = baseCardWidth * centerScaleRatio * outerScale;
  const streamPosition = getStreamPosition(elapsed);
  const imagesStarted = elapsed >= IMAGE_START;
  const barProgress = easeOut((elapsed - BAR_START) / (BAR_END - BAR_START));

  aperture.style.setProperty("--open", barProgress.toFixed(4));
  aperture.style.opacity = "1";

  for (let pairIndex = 0; pairIndex < STREAM_PAIR_COUNT; pairIndex += 1) {
    const rawStreamAge = streamPosition - pairIndex;
    const streamAge =
      rawStreamAge >= 0 ? rawStreamAge % STREAM_PAIR_COUNT : rawStreamAge;
    const prePushProgress = easeIntoLinearMotion(
      (streamAge - PRE_PUSH_START_SLOT) /
        (PRE_PUSH_END_SLOT - PRE_PUSH_START_SLOT),
    );
    const birthProgress = easeInOut(streamAge / BIRTH_GROWTH_SLOTS);
    const slot = Math.max(streamAge - PRE_PUSH_END_SLOT, 0);
    const birthScale = 0.2 + birthProgress * 0.8;
    const scale = interpolateSlot(scaleRatios, slot) * outerScale;
    const rotationSlot =
      clamp(slot / MAX_VISIBLE_SLOT) * (SLOT_ROTATION.length - 1);
    const rotation = interpolateSlot(SLOT_ROTATION, rotationSlot);
    const x =
      prePushDistance * prePushProgress +
      interpolateSlot(SLOT_TRAVEL, slot) * width * TRACK_SPACING;
    const visible =
      imagesStarted && streamAge >= 0 && slot <= MAX_VISIBLE_SLOT ? 1 : 0;

    [cardElements[pairIndex * 2], cardElements[pairIndex * 2 + 1]].forEach(
      (card, sideIndex) => {
        const direction = sideIndex === 0 ? -1 : 1;
        card.style.setProperty("--x", `${direction * x}px`);
        card.style.setProperty("--scale", scale.toFixed(4));
        card.style.setProperty("--rotate", `${direction * -rotation}deg`);
        card.style.setProperty("--birth", birthScale.toFixed(4));
        card.style.opacity = visible.toFixed(4);
        card.style.zIndex = String(20 + Math.round(clamp(slot, 0, 8) * 10));
      },
    );
  }

  corridorFrame = requestAnimationFrame(renderCorridor);
}

const phaseClasses = [
  "is-hidden",
  "is-fading-out",
  "is-second-enter",
  "is-closing",
  "is-holding",
  "is-third-expand",
  "is-third-return",
  "is-third-closing",
  "is-fourth-expand",
  "is-fourth-closing",
];

let sharedPhase = "hidden";
let activePage = 0;

function setSharedPhase(phase, restart = true) {
  sharedPhase = phase;
  phaseClasses.forEach((className) => sharedStage.classList.remove(className));
  if (activePage === 0) {
    sharedStage.classList.add("is-hidden");
    return;
  }
  if (restart) void sharedStage.offsetWidth;
  sharedStage.classList.add(`is-${phase}`);
}

function updatePageClasses() {
  siteHeader.classList.toggle("is-hidden", activePage !== 0);
  if (activePage !== 0) closeBrandPopover();
  if (backToTopButton) backToTopButton.classList.toggle("is-visible", activePage !== 0);
  displayScreen.classList.toggle("is-active", activePage === 1);
  marketplaceScreen.classList.toggle(
    "is-active",
    activePage === 2 &&
      ["third-expand", "third-return", "fading-out"].includes(sharedPhase),
  );
  marketplaceScreen.classList.toggle(
    "is-closing",
    activePage === 2 && sharedPhase === "third-closing",
  );
  featuredScreen.classList.toggle(
    "is-active",
    activePage === 3 && ["fourth-expand", "fading-out"].includes(sharedPhase),
  );
  strengthsScreen.classList.toggle("is-active", activePage === 4);
  thanksScreen.classList.toggle("is-active", activePage === 5);
}

function replayDisplayCopy() {
  displayScreen.classList.remove("is-active", "is-closing");
  void displayScreen.offsetWidth;
  displayScreen.classList.add("is-active");
}

let unlockTimer = 0;
let collapseTimer = 0;
let fourthTimer = 0;
let wheelGestureTimer = 0;
let wheelGestureActive = false;
let previousScrollTop = 0;
let observedPage = 0;
let targetPage = 0;
let arrivalAction = null;
let backwardTransition = false;

function finishPageArrival() {
  if (backwardTransition) {
    backwardTransition = false;
    activePage = targetPage;
  }
  if (arrivalAction) {
    const action = arrivalAction;
    arrivalAction = null;
    action();
  }
  updatePageClasses();
}

function handleScroll() {
  const scrollTop = scroller.scrollTop;
  const movingDown = scrollTop >= previousScrollTop;
  const rawPage = scrollTop / scroller.clientHeight;
  const page = clamp(
    movingDown ? Math.ceil(rawPage - 0.001) : Math.floor(rawPage + 0.001),
    0,
    5,
  );
  previousScrollTop = scrollTop;

  if (page !== observedPage) {
    observedPage = page;
    if (!backwardTransition) {
      activePage = page;
      if (page === 0) setSharedPhase("hidden");
    }
  }

  if (!backwardTransition) updatePageClasses();

  if (Math.abs(rawPage - targetPage) < 0.002) finishPageArrival();
}

function handleWheel(event) {
  if (lightboxOpen) return;
  if (event.deltaY === 0) return;
  event.preventDefault();

  window.clearTimeout(wheelGestureTimer);
  wheelGestureTimer = window.setTimeout(() => {
    wheelGestureActive = false;
  }, 240);
  if (wheelGestureActive) return;
  wheelGestureActive = true;

  const currentPage = targetPage;
  const nextPage = clamp(currentPage + (event.deltaY > 0 ? 1 : -1), 0, 5);
  if (nextPage === currentPage) return;
  const movingBackward = nextPage < currentPage;
  backwardTransition = movingBackward;
  targetPage = nextPage;
  arrivalAction = null;
  window.clearTimeout(unlockTimer);
  window.clearTimeout(collapseTimer);
  window.clearTimeout(fourthTimer);
  if (!movingBackward) activePage = nextPage;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior = reduceMotion ? "auto" : "smooth";

  if (movingBackward) {
    displayScreen.classList.remove("is-closing");
    setSharedPhase("fading-out");
    updatePageClasses();

    if (nextPage === 0) {
      arrivalAction = () => {
        setSharedPhase("hidden");
        restartCorridor();
      };
    } else if (nextPage === 1) {
      arrivalAction = () => {
        setSharedPhase("second-enter");
        replayDisplayCopy();
      };
    } else if (nextPage === 2) {
      arrivalAction = () => setSharedPhase("third-return");
    } else if (nextPage === 3) {
      arrivalAction = () => setSharedPhase("fourth-expand");
    } else {
      arrivalAction = () => setSharedPhase("hidden");
    }

    scroller.scrollTo({ top: nextPage * scroller.clientHeight, behavior });
    unlockTimer = window.setTimeout(finishPageArrival, reduceMotion ? 100 : 2200);
    return;
  }

  if (currentPage === 1 && nextPage === 2) {
    displayScreen.classList.add("is-closing");
    setSharedPhase("closing");
    updatePageClasses();
    scroller.scrollTo({ top: nextPage * scroller.clientHeight, behavior });
    collapseTimer = window.setTimeout(() => {
      setSharedPhase("third-expand");
      updatePageClasses();
    }, reduceMotion ? 0 : 1000);
    return;
  }

  if (currentPage === 2 && nextPage === 3) {
    setSharedPhase("third-closing");
    updatePageClasses();
    scroller.scrollTo({ top: nextPage * scroller.clientHeight, behavior });
    fourthTimer = window.setTimeout(() => {
      setSharedPhase("fourth-expand");
      updatePageClasses();
    }, reduceMotion ? 0 : 1000);
    return;
  }

  if (currentPage === 3 && nextPage === 4) {
    setSharedPhase("hidden");
    updatePageClasses();
    scroller.scrollTo({ top: nextPage * scroller.clientHeight, behavior });
    return;
  }

  if (nextPage === 1) {
    setSharedPhase("second-enter");
    replayDisplayCopy();
  } else if (nextPage === 2) {
    setSharedPhase("third-expand");
  } else if (nextPage === 3) {
    setSharedPhase("fourth-expand");
  }

  updatePageClasses();
  scroller.scrollTo({ top: nextPage * scroller.clientHeight, behavior });
}

function updateFourthScale() {
  sharedStage.style.setProperty("--fourth-scale", (window.innerHeight * 0.8) / 360);
}

// --- Back to top button ---

function goToTop() {
  if (lightboxOpen) return;
  if (targetPage === 0) return;
  window.clearTimeout(unlockTimer);
  window.clearTimeout(collapseTimer);
  window.clearTimeout(fourthTimer);

  targetPage = 0;
  backwardTransition = true;
  displayScreen.classList.remove("is-closing");
  setSharedPhase("fading-out");
  updatePageClasses();

  arrivalAction = () => {
    setSharedPhase("hidden");
    restartCorridor();
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  scroller.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  unlockTimer = window.setTimeout(finishPageArrival, reduceMotion ? 100 : 2200);
}

if (backToTopButton) {
  backToTopButton.addEventListener("click", goToTop);
}

// --- React Bits PillNav: dynamic circle-reveal hover (vanilla + GSAP port) ---
(function initPillNav() {
  if (typeof gsap === "undefined") return;
  const ease = "power3.easeOut";
  const pills = document.querySelectorAll(".pill-btn");
  const timelines = [];
  const activeTweens = [];

  function layout() {
    pills.forEach((pill, index) => {
      const circle = pill.querySelector(".pill-btn-circle");
      const label = pill.querySelector(".pill-btn-label:not(.pill-btn-label--hover)");
      const hoverLabel = pill.querySelector(".pill-btn-label--hover");
      if (!circle) return;

      const rect = pill.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const R = (w * w / 4 + h * h) / (2 * h);
      const D = Math.ceil(2 * R) + 2;
      const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
      const originY = D - delta;

      circle.style.width = `${D}px`;
      circle.style.height = `${D}px`;
      circle.style.bottom = `-${delta}px`;

      gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` });
      if (label) gsap.set(label, { y: 0 });
      if (hoverLabel) gsap.set(hoverLabel, { y: h + 12, opacity: 0 });

      timelines[index]?.kill();
      const tl = gsap.timeline({ paused: true });
      tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: "auto" }, 0);
      if (label) tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: "auto" }, 0);
      if (hoverLabel) {
        gsap.set(hoverLabel, { y: Math.ceil(h + 100), opacity: 0 });
        tl.to(hoverLabel, { y: 0, opacity: 1, duration: 2, ease, overwrite: "auto" }, 0);
      }
      timelines[index] = tl;
    });
  }

  layout();
  window.addEventListener("resize", layout);
  if (document.fonts?.ready) {
    document.fonts.ready.then(layout).catch(() => {});
  }

  pills.forEach((pill, index) => {
    pill.addEventListener("mouseenter", () => {
      const tl = timelines[index];
      if (!tl) return;
      activeTweens[index]?.kill();
      activeTweens[index] = tl.tweenTo(tl.duration(), { duration: 0.3, ease, overwrite: "auto" });
    });
    pill.addEventListener("mouseleave", () => {
      const tl = timelines[index];
      if (!tl) return;
      activeTweens[index]?.kill();
      activeTweens[index] = tl.tweenTo(0, { duration: 0.2, ease, overwrite: "auto" });
    });
  });
})();

function createThanksRing() {
  const ring = document.getElementById("thanksRing");
  if (!ring) return;
  const count = corridorImages.length;
  corridorImages.forEach((src, index) => {
    const angle = (360 / count) * index;
    const item = document.createElement("div");
    item.className = "thanks-ring-item";
    item.style.setProperty("--angle", `${angle}deg`);
    item.style.backgroundImage = `url("${src}")`;
    ring.appendChild(item);
  });
}

createSharedCards();
createCorridorCards();
createThanksRing();
updateFourthScale();
window.addEventListener("resize", updateFourthScale);
scroller.addEventListener("wheel", handleWheel, { passive: false });
scroller.addEventListener("scroll", handleScroll, { passive: true });
corridorFrame = requestAnimationFrame(renderCorridor);
