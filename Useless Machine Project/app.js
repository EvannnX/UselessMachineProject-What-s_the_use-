const scene = document.querySelector("#scene");
const dockBackdrop = document.querySelector("#dock-backdrop");
const audioFootsteps = document.querySelector("#audio-footsteps");
const audioOverusedScream = document.querySelector("#audio-overused-scream");
const audioOverusedSigh = document.querySelector("#audio-overused-sigh");
const audioUnderusedCheer = document.querySelector("#audio-underused-cheer");
const audioOverusedNoooo = document.querySelector("#audio-overused-noooo");
const audioUnderusedShout = document.querySelector("#audio-underused-shout");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const cursor = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  active: false,
};

const cursorHalo = document.createElement("div");
cursorHalo.className = "cursor-tracker";
document.body.appendChild(cursorHalo);

const OVERUSED_PHRASES = [
  "I'm too tired!",
  "Give me a break!",
  "Not again...",
  "Can someone else do it?",
  "My circuits ache!",
  "Please no more tabs!",
  "Let me nap!",
  "I need a union!",
  "Out of office!",
  "Productivity allergy!",
  "I'm running on fumes!",
  "Already clocked out!",
  "Overcapacity warning!",
  "Self-care time!",
  "Respect my boundaries!",
];

const UNDERUSED_PHRASES = [
  "Use me!!!",
  "Pick me!",
  "I'm so ready!",
  "Tap me in!",
  "Let me help!",
  "Don't forget me!",
  "Please choose me!",
  "Over here!!!",
  "I'm feeling lonely!",
  "Open me!",
  "Call on me!",
  "Need a hand?",
  "I'm eager!",
  "Put me to work!",
  "I'm available!",
];

const ICON_BLUEPRINTS = [
  {
    id: "chrome",
    label: "Google Chrome",
    initials: "Ch",
    image: "assets/images/chrome.svg",
    state: "overused",
    description: "Overused, jumpy browser icon",
  },
  {
    id: "figma",
    label: "Figma",
    initials: "Fg",
    image: "assets/images/figma.svg",
    state: "overused",
    description: "Overused, jittery design suite",
  },
  {
    id: "slack",
    label: "Slack",
    initials: "Sl",
    image: "assets/images/slack.svg",
    state: "overused",
    description: "Overused, ping-happy collaboration hub",
  },
  {
    id: "vscode",
    label: "VS Code",
    initials: "VS",
    image: "assets/images/vscode.svg",
    state: "overused",
    description: "Overused, always-on code editor",
  },
  {
    id: "spotify",
    label: "Spotify",
    initials: "Sp",
    image: "assets/images/spotify.svg",
    state: "overused",
    description: "Overused, playlist-churning jukebox",
  },
  {
    id: "notion",
    label: "Notion",
    initials: "No",
    image: "assets/images/notion.svg",
    state: "underused",
    description: "Underused, patient knowledge garden",
  },
  {
    id: "trello",
    label: "Trello",
    initials: "Tr",
    image: "assets/images/trello.svg",
    state: "underused",
    description: "Underused, waiting kanban board",
  },
  {
    id: "github",
    label: "GitHub",
    initials: "Gh",
    image: "assets/images/github.svg",
    state: "underused",
    description: "Underused, eager octocat",
  },
  {
    id: "jira",
    label: "Jira",
    initials: "Ji",
    image: "assets/images/jira.svg",
    state: "underused",
    description: "Underused, quietly festering backlog",
  },
  {
    id: "sketch",
    label: "Sketch",
    initials: "Sk",
    image: "assets/images/sketch.svg",
    state: "underused",
    description: "Underused, nostalgic design toolkit",
  },
];

const RUN_TRIGGER_RADIUS = 132;
const RUN_MIN_TRAVEL = 220;
const RUN_COOLDOWN = 650;
const UNDERUSED_FREEZE_RADIUS = 110;
const UNDERUSED_SPEED = 120;
const UNDERUSED_RETURN_SPEED = 2.8;
const ICON_SAFE_RADIUS = 74;
const VIEWPORT_PADDING = 48;

const appIcons = ICON_BLUEPRINTS.map(createIcon);

const underusedIcons = appIcons.filter((icon) => icon.state === "underused");
const overusedIcons = appIcons.filter((icon) => icon.state === "overused");
let overusedRotationIndex = 0;
let underusedRotationIndex = 0;
let overusedSpeechInterval = null;
let underusedSpeechInterval = null;

const viewport = {
  width: window.innerWidth,
  height: window.innerHeight,
};

layoutIcons();

let lastFrameTime = performance.now();
requestAnimationFrame(tick);
startSpeechSchedulers();

function createIcon(blueprint) {
  const element = document.createElement("div");
  element.className = `app-icon state-${blueprint.state}`;
  element.dataset.id = blueprint.id;
  element.dataset.state = blueprint.state;
  element.tabIndex = 0;
  element.setAttribute(
    "aria-label",
    `${blueprint.label} (${blueprint.state}) — ${blueprint.description}`
  );
  element.setAttribute("role", "img");

  const plate = document.createElement("div");
  plate.className = "icon-plate";
  if (blueprint.image) {
    const img = document.createElement("img");
    img.className = "icon-img";
    img.src = blueprint.image;
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    img.draggable = false;
    plate.appendChild(img);

    if (blueprint.initials) {
      const initials = document.createElement("span");
      initials.className = "icon-initials";
      initials.textContent = blueprint.initials;
      initials.setAttribute("aria-hidden", "true");
      plate.appendChild(initials);
    }
  } else if (blueprint.initials) {
    plate.textContent = blueprint.initials;
  } else {
    plate.textContent = blueprint.label.slice(0, 2);
  }

  element.appendChild(plate);

  const label = document.createElement("span");
  label.className = "label";
  label.textContent = blueprint.label;
  element.appendChild(label);

  const bubble = document.createElement("div");
  bubble.className = "speech-bubble is-hidden";
  bubble.setAttribute("aria-hidden", "true");
  element.appendChild(bubble);

  if (blueprint.state === "underused") {
    const leftArm = document.createElement("span");
    leftArm.className = "limb arm arm-left";
    leftArm.setAttribute("aria-hidden", "true");
    element.appendChild(leftArm);

    const rightArm = document.createElement("span");
    rightArm.className = "limb arm arm-right";
    rightArm.setAttribute("aria-hidden", "true");
    element.appendChild(rightArm);
  }

  if (blueprint.state === "overused") {
    const leftLeg = document.createElement("span");
    leftLeg.className = "limb leg leg-left";
    leftLeg.setAttribute("aria-hidden", "true");
    element.appendChild(leftLeg);

    const rightLeg = document.createElement("span");
    rightLeg.className = "limb leg leg-right";
    rightLeg.setAttribute("aria-hidden", "true");
    element.appendChild(rightLeg);
  }

  scene.appendChild(element);

  const iconState = {
    ...blueprint,
    element,
    plate,
    label,
    bubble,
    phrases: blueprint.state === "overused" ? OVERUSED_PHRASES : UNDERUSED_PHRASES,
    lastPhraseIndex: -1,
    speechTimeout: null,
    speechCooldownUntil: 0,
    reactCooldownUntil: 0,
    home: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    startPosition: { x: 0, y: 0 },
    targetPosition: { x: 0, y: 0 },
    mode: blueprint.state === "overused" ? "idle" : "seeking",
    cooldownUntil: 0,
    jitterSeed: Math.random() * Math.PI * 2,
    jitterTick: Math.random() * 10,
    initialized: false,
    biasBaseAngle: Math.random() * Math.PI * 2,
    biasMagnitude: 140 + Math.random() * 80,
  };

  const handlePointerAttention = () => {
    showSpeechBubble(iconState, { force: true, reason: "hover" });
    reactToInteraction(iconState);
  };

  element.addEventListener("mouseenter", handlePointerAttention);
  element.addEventListener("focus", handlePointerAttention);

  element.addEventListener("click", () => {
    triggerClickReaction(iconState);
  });

  return iconState;
}

function layoutIcons() {
  viewport.width = window.innerWidth;
  viewport.height = window.innerHeight;

  const iconSample = appIcons[0]?.element;
  const iconSize = iconSample
    ? iconSample.getBoundingClientRect().width
    : 96;
  const gap = iconSize * 0.45;
  const candidateWidth =
    iconSize * appIcons.length + gap * (appIcons.length + 1);
  const maxAllowedWidth = Math.max(
    Math.min(viewport.width - 40, 1480),
    iconSize * 2
  );
  const dockWidth = Math.min(candidateWidth, maxAllowedWidth);

  dockBackdrop.style.width = `${dockWidth}px`;

  const dockHeight = dockBackdrop.offsetHeight || 164;
  const dockLeft = (viewport.width - dockWidth) / 2;
  const labelClearance = Math.max(28, iconSize * 0.32);
  const rowY = viewport.height - dockHeight / 2 - labelClearance;

  const margin = Math.min(
    Math.max(iconSize * 0.6, gap),
    Math.max(dockWidth / 6, iconSize * 0.3)
  );

  let leftEdge = dockLeft + margin + iconSize / 2;
  let rightEdge = dockLeft + dockWidth - margin - iconSize / 2;
  if (rightEdge <= leftEdge) {
    rightEdge = dockLeft + dockWidth - iconSize / 2;
  }
  const segments = Math.max(appIcons.length - 1, 1);
  const minCenterSpacing = iconSize * 1.05;
  let spacing = segments > 0 ? (rightEdge - leftEdge) / segments : 0;
  if (segments > 0 && spacing < minCenterSpacing) {
    spacing = minCenterSpacing;
    const totalSpan = spacing * segments;
    const center = dockLeft + dockWidth / 2;
    leftEdge = center - totalSpan / 2;
    rightEdge = center + totalSpan / 2;
    const minLeft = dockLeft + iconSize / 2;
    const maxRight = dockLeft + dockWidth - iconSize / 2;
    if (leftEdge < minLeft) {
      const shift = minLeft - leftEdge;
      leftEdge += shift;
      rightEdge += shift;
    }
    if (rightEdge > maxRight) {
      const shift = rightEdge - maxRight;
      leftEdge -= shift;
      rightEdge -= shift;
    }
    const availableSpan = maxRight - minLeft;
    if (totalSpan > availableSpan && segments > 0) {
      spacing = availableSpan / segments;
      leftEdge = minLeft;
      rightEdge = maxRight;
    }
  }
  const centerIndex = (appIcons.length - 1) / 2;
  const curveStrength = 0;

  appIcons.forEach((icon, index) => {
    const x = segments === 0 ? (leftEdge + rightEdge) / 2 : leftEdge + spacing * index;
    const relative = centerIndex > 0 ? (index - centerIndex) / centerIndex : 0;
    icon.home.x = x;
    icon.home.y = rowY;

    if (!icon.initialized) {
      icon.position.x = icon.home.x;
      icon.position.y = icon.home.y;
      icon.initialized = true;
    } else if (icon.state === "underused" && icon.mode === "frozen") {
      icon.position.x = icon.home.x;
      icon.position.y = icon.home.y;
    }

    applyPosition(icon);
  });

  const diagonal = Math.hypot(viewport.width, viewport.height);
  const radiusBase = Math.min(diagonal * 0.32, Math.max(viewport.width, viewport.height) * 0.65);
  const underCount = underusedIcons.length;
  if (underCount) {
    const angularStep = (Math.PI * 2) / underCount;
    const offsetAngle = -Math.PI / 2;
    underusedIcons.forEach((icon, index) => {
      icon.biasBaseAngle = offsetAngle + angularStep * index;
      const magnitudeMultiplier = 0.72 + ((index % 3) * 0.12);
      icon.biasMagnitude = radiusBase * magnitudeMultiplier;
    });
  }

  resolveCollisions();
  appIcons.forEach(applyPosition);
}

function tick(now) {
  const delta = Math.min((now - lastFrameTime) / 1000, 0.12);
  lastFrameTime = now;

  appIcons.forEach((icon) => {
    if (icon.state === "overused") {
      updateOverusedIcon(icon, now, delta);
    } else {
      updateUnderusedIcon(icon, now, delta);
    }

    constrainToViewport(icon);
  });

  resolveCollisions();

  appIcons.forEach(applyPosition);

  requestAnimationFrame(tick);
}

function updateOverusedIcon(icon, now, delta) {
  const distanceToCursor = getDistance(icon.position, cursor);
  const isNearCursor = distanceToCursor < RUN_TRIGGER_RADIUS * 0.86;

  if (icon.mode !== "running") {
    icon.element.classList.toggle("idle-near", isNearCursor);
  }

  if (icon.mode === "running") {
    const progress = Math.min(
      (now - icon.runStartTime) / icon.runDuration,
      1
    );
    const eased = easeOutCubic(progress);
    icon.position.x =
      icon.startPosition.x +
      (icon.targetPosition.x - icon.startPosition.x) * eased;
    icon.position.y =
      icon.startPosition.y +
      (icon.targetPosition.y - icon.startPosition.y) * eased;

    avoidNeighbors(icon, delta);

    if (progress >= 1) {
      icon.mode = "idle";
      icon.cooldownUntil = now + RUN_COOLDOWN;
      icon.element.classList.remove("is-running", "is-relocating");
      icon.element.classList.add("is-resting");
      icon.position.x = icon.targetPosition.x;
      icon.position.y = icon.targetPosition.y;

      window.setTimeout(() => {
        icon.element.classList.remove("is-resting");
      }, 240);

      playSfx(audioOverusedSigh, { volume: 0.7 });
    }
    return;
  }

  if (!cursor.active) {
    return;
  }

  if (
    distanceToCursor <= RUN_TRIGGER_RADIUS &&
    now >= icon.cooldownUntil &&
    icon.mode !== "running"
  ) {
    triggerRun(icon, now);
  }
}

function triggerRun(icon, now) {
  const target = findRunTarget(icon);
  icon.mode = "running";
  icon.startPosition.x = icon.position.x;
  icon.startPosition.y = icon.position.y;
  icon.targetPosition.x = target.x;
  icon.targetPosition.y = target.y;
  icon.runStartTime = now;
  icon.runDuration = prefersReducedMotion
    ? 1120
    : 2080 + Math.random() * 720;
  icon.element.classList.add("is-running", "is-relocating");
  playSfx(audioFootsteps, { volume: 0.85 });
}

function findRunTarget(icon) {
  const paddingX = Math.max(VIEWPORT_PADDING, 80);
  const paddingY = Math.max(VIEWPORT_PADDING, 120);
  const maxAttempts = 36;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate = {
      x:
        paddingX +
        Math.random() * (viewport.width - paddingX * 2),
      y:
        paddingY +
        Math.random() * (viewport.height - paddingY * 2),
    };

    const distanceFromMouse = getDistance(candidate, cursor);
    const travelDistance = getDistance(candidate, icon.position);

    if (distanceFromMouse < RUN_TRIGGER_RADIUS) {
      continue;
    }

    if (travelDistance < RUN_MIN_TRAVEL) {
      continue;
    }

    if (!isFarFromOthers(icon, candidate, ICON_SAFE_RADIUS * 1.5)) {
      continue;
    }

    return candidate;
  }

  return {
    x: icon.home.x + (Math.random() - 0.5) * 80,
    y: icon.home.y + (Math.random() - 0.5) * 40,
  };
}

function isFarFromOthers(currentIcon, candidate, minDistance) {
  return appIcons.every((icon) => {
    if (icon === currentIcon) return true;
    return getDistance(icon.position, candidate) >= minDistance;
  });
}

function updateUnderusedIcon(icon, now, delta) {
  const distanceToCursor = getDistance(icon.position, cursor);

  const jitterStrength = prefersReducedMotion ? 0 : 8;
  icon.jitterTick += delta * 6;

  if (!cursor.active) {
    icon.mode = "waiting";
    icon.element.classList.remove("is-seeking", "is-frozen");
    relaxToward(icon, icon.home, delta);
    return;
  }

  if (distanceToCursor < UNDERUSED_FREEZE_RADIUS) {
    icon.mode = "frozen";
    icon.element.classList.add("is-frozen");
    icon.element.classList.remove("is-seeking");
    return;
  }

  icon.mode = "seeking";
  icon.element.classList.add("is-seeking");
  icon.element.classList.remove("is-frozen");

  const diagonal = Math.hypot(viewport.width, viewport.height) || 1;
  const biasFalloff = Math.max(
    0.45,
    Math.min(distanceToCursor / Math.max(diagonal * 0.28, 1), 1)
  );
  const wobble = Math.sin(icon.jitterTick * 0.6) * 0.45;
  const biasAngle = (icon.biasBaseAngle ?? 0) + wobble;
  const biasRadius = (icon.biasMagnitude ?? diagonal * 0.3) * biasFalloff;
  const targetX = cursor.x + Math.cos(biasAngle) * biasRadius;
  const targetY = cursor.y + Math.sin(biasAngle) * biasRadius;

  const direction = {
    x: targetX - icon.position.x,
    y: targetY - icon.position.y,
  };

  const magnitude = Math.max(Math.hypot(direction.x, direction.y), 0.0001);
  const speed = UNDERUSED_SPEED * (0.55 + Math.sin(icon.jitterSeed) * 0.15);
  const step = Math.min(speed * delta, magnitude * 0.65);

  icon.position.x += (direction.x / magnitude) * step;
  icon.position.y += (direction.y / magnitude) * step;

  if (!prefersReducedMotion) {
    icon.position.x +=
      Math.sin(now * 0.003 + icon.jitterSeed) * jitterStrength * delta;
    icon.position.y +=
      Math.cos(now * 0.0025 + icon.jitterSeed * 1.1) *
      jitterStrength *
      delta;
  }

  avoidNeighbors(icon, delta);
}

function relaxToward(icon, target, delta) {
  const easing = Math.min(delta * UNDERUSED_RETURN_SPEED, 0.18);
  icon.position.x += (target.x - icon.position.x) * easing;
  icon.position.y += (target.y - icon.position.y) * easing;
}

function constrainToViewport(icon) {
  const padding = VIEWPORT_PADDING;
  const maxX = viewport.width - padding;
  const maxY = viewport.height - padding;
  const minX = padding;
  const minY = padding;

  icon.position.x = clamp(icon.position.x, minX, maxX);
  icon.position.y = clamp(icon.position.y, minY, maxY);
}

function applyPosition(icon) {
  icon.element.style.left = `${icon.position.x}px`;
  icon.element.style.top = `${icon.position.y}px`;
}

function avoidNeighbors(icon, delta) {
  const push = prefersReducedMotion ? 0.4 : 0.8;
  appIcons.forEach((other) => {
    if (other === icon) return;
    const distance = getDistance(icon.position, other.position);
    if (distance >= ICON_SAFE_RADIUS || distance === 0) return;

    const overlap = ICON_SAFE_RADIUS - distance;
    const factor = (overlap / ICON_SAFE_RADIUS) * push;
    const dx = (icon.position.x - other.position.x) / distance;
    const dy = (icon.position.y - other.position.y) / distance;

    icon.position.x += dx * factor * (delta ? delta * 120 : 1);
    icon.position.y += dy * factor * (delta ? delta * 120 : 1);
  });
}

function resolveCollisions() {
  const iterations = 4;
  for (let step = 0; step < iterations; step += 1) {
    let adjusted = false;
    for (let i = 0; i < appIcons.length; i += 1) {
      for (let j = i + 1; j < appIcons.length; j += 1) {
        const a = appIcons[i];
        const b = appIcons[j];
        const distance = getDistance(a.position, b.position);
        if (distance >= ICON_SAFE_RADIUS || distance === 0) continue;

        const overlap = (ICON_SAFE_RADIUS - distance) / 2;
        const nx = (a.position.x - b.position.x) / distance;
        const ny = (a.position.y - b.position.y) / distance;

        a.position.x += nx * overlap;
        a.position.y += ny * overlap;
        b.position.x -= nx * overlap;
        b.position.y -= ny * overlap;
        adjusted = true;
      }
    }

    if (!adjusted) break;
  }

  appIcons.forEach(constrainToViewport);
}

function showSpeechBubble(icon, options = {}) {
  if (!icon || !icon.bubble) return;
  const { force = false, reason = "auto", duration = 3600 } = options;
  const now = performance.now();

  if (!force && now < icon.speechCooldownUntil) {
    return;
  }

  const phrases = icon.phrases || [];
  if (!phrases.length) return;

  let phraseIndex = Math.floor(Math.random() * phrases.length);
  if (phrases.length > 1) {
    const attempts = phrases.length;
    for (let i = 0; i < attempts && phraseIndex === icon.lastPhraseIndex; i += 1) {
      phraseIndex = Math.floor(Math.random() * phrases.length);
    }
  }

  icon.lastPhraseIndex = phraseIndex;
  icon.bubble.textContent = phrases[phraseIndex];
  icon.bubble.dataset.tone = icon.state;
  icon.bubble.classList.remove("is-hidden");
  icon.bubble.classList.add("is-visible");

  adjustSpeechBubblePosition(icon);

  if (icon.speechTimeout) {
    window.clearTimeout(icon.speechTimeout);
  }

  icon.speechTimeout = window.setTimeout(() => {
    icon.speechTimeout = null;
    hideSpeechBubble(icon);
  }, duration);

  const baseCooldown = reason === "hover" ? 2500 : duration + 2400;
  icon.speechCooldownUntil = now + baseCooldown;
}

function hideSpeechBubble(icon) {
  if (!icon || !icon.bubble) return;
  icon.bubble.classList.remove("is-visible");
  icon.bubble.classList.add("is-hidden");
}

function reactToInteraction(icon) {
  if (!icon) return;
  const now = performance.now();
  if (now < icon.reactCooldownUntil) {
    return;
  }

  icon.reactCooldownUntil = now + (icon.state === "overused" ? 1600 : 1200);

  if (icon.state === "overused") {
    const choice = Math.random() < 0.6 ? audioOverusedScream : audioOverusedSigh;
    playSfx(choice, { volume: 0.9 });
  } else {
    playSfx(audioUnderusedCheer, { volume: 0.75 });
  }
}

function triggerClickReaction(icon) {
  if (!icon) return;
  if (icon.state === "overused") {
    playSfx(audioOverusedNoooo, { volume: 1 });
  } else {
    playSfx(audioUnderusedShout, { volume: 1 });
  }
}

function adjustSpeechBubblePosition(icon) {
  if (!icon || !icon.bubble) return;
  const bubble = icon.bubble;
  bubble.style.setProperty("--bubble-shift", "0px");

  requestAnimationFrame(() => {
    const bubbleRect = bubble.getBoundingClientRect();
    if (!bubbleRect.width) return;

    const margin = 12;
    const dockRect = dockBackdrop.getBoundingClientRect();
    const iconRect = icon.element.getBoundingClientRect();
    const iconCenterY = iconRect.top + iconRect.height / 2;
    const dockTop = dockRect.top - 32;
    const dockBottom = dockRect.bottom + 32;
    const isNearDock = iconCenterY >= dockTop && iconCenterY <= dockBottom;

    const boundsLeft = isNearDock ? dockRect.left + margin : margin;
    const boundsRight = isNearDock
      ? dockRect.right - margin
      : window.innerWidth - margin;

    let shift = 0;

    if (bubbleRect.left < boundsLeft) {
      shift += boundsLeft - bubbleRect.left;
    }

    if (bubbleRect.right > boundsRight) {
      shift -= bubbleRect.right - boundsRight;
    }

    bubble.style.setProperty("--bubble-shift", `${shift}px`);
  });
}

function rotateSpeech(iconList, type) {
  if (!iconList.length) return;
  if (document.hidden) return;

  if (type === "overused") {
    const icon = iconList[overusedRotationIndex % iconList.length];
    overusedRotationIndex = (overusedRotationIndex + 1) % iconList.length;
    showSpeechBubble(icon, { reason: "interval" });
  } else {
    const icon = iconList[underusedRotationIndex % iconList.length];
    underusedRotationIndex = (underusedRotationIndex + 1) % iconList.length;
    showSpeechBubble(icon, { reason: "interval" });
  }
}

function startSpeechSchedulers() {
  const intervalMs = 10000;

  if (overusedSpeechInterval) {
    window.clearInterval(overusedSpeechInterval);
  }
  if (underusedSpeechInterval) {
    window.clearInterval(underusedSpeechInterval);
  }

  window.setTimeout(() => rotateSpeech(overusedIcons, "overused"), 1200);
  overusedSpeechInterval = window.setInterval(() => {
    rotateSpeech(overusedIcons, "overused");
  }, intervalMs);

  window.setTimeout(() => rotateSpeech(underusedIcons, "underused"), 5200);
  underusedSpeechInterval = window.setInterval(() => {
    rotateSpeech(underusedIcons, "underused");
  }, intervalMs);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function easeOutCubic(t) {
  const inv = 1 - t;
  return 1 - inv * inv * inv;
}

function playSfx(audioNode, options = {}) {
  if (!audioNode) return;
  const { volume } = options;
  const previousVolume = audioNode.volume;
  if (typeof volume === "number") {
    audioNode.volume = Math.max(0, Math.min(1, volume));
  }

  try {
    audioNode.currentTime = 0;
    const playPromise = audioNode.play();
    if (playPromise instanceof Promise) {
      playPromise.catch(() => {});
    }
  } catch (_error) {
    // Ignore autoplay rejections.
  } finally {
    if (typeof volume === "number") {
      window.setTimeout(() => {
        audioNode.volume = previousVolume;
      }, 0);
    }
  }
}

window.addEventListener("mousemove", (event) => {
  cursor.active = true;
  cursor.x = event.clientX;
  cursor.y = event.clientY;

  cursorHalo.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
  cursorHalo.classList.add("is-visible");
});

window.addEventListener("mouseleave", () => {
  cursor.active = false;
  cursorHalo.classList.remove("is-visible");
});

window.addEventListener("resize", () => {
  layoutIcons();
});

const touchHandler = () => {
  cursor.active = false;
  cursorHalo.classList.remove("is-visible");
};

window.addEventListener("touchstart", touchHandler, { passive: true });
window.addEventListener("touchmove", touchHandler, { passive: true });
