import {
  REGIONS, MERIDIANS, NERVES, TOPICS, SAMPLE_PINS,
  regionById, topicById, topicsForRegion, meridiansForRegion,
} from "./data/atlas.js";
import { figureSvg } from "./figure.js";

const BSKY_SEARCH = "https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts";
const SITE_TAG = "WholeBodyCookbook";
const state = { page: "atlas", region: "heart", layers: { meridians: true, nerves: false }, topic: null, posts: [], live: false };
const $ = (sel, el = document) => el.querySelector(sel);

function setPage(page) {
  state.page = page;
  document.querySelectorAll("[data-page]").forEach((el) => el.classList.toggle("on", el.dataset.page === page));
  document.querySelectorAll("nav button[data-go]").forEach((btn) => btn.setAttribute("aria-current", btn.dataset.go === page ? "page" : "false"));
}

function paintLayers() {
  document.querySelectorAll(".meridian-line, .acupoint").forEach((el) => el.classList.toggle("on", state.layers.meridians));
  document.querySelectorAll(".nerve-line").forEach((el) => el.classList.toggle("on", state.layers.nerves));
}

function paintRegions() {
  const related = new Set();
  if (state.topic) topicById(state.topic)?.regions.forEach((id) => related.add(id));
  document.querySelectorAll(".region").forEach((el) => {
    const id = el.dataset.region;
    el.classList.toggle("active", id === state.region);
    el.classList.toggle("related", related.has(id) && id !== state.region);
  });
}

function composeText(region) {
  const r = regionById(region);
  const topic = state.topic ? topicById(state.topic) : null;
  return [`Pinning this to the ${r.name.toLowerCase()}.`, topic ? `#${topic.tags[0]}` : "", `#${r.tag}`, `#${SITE_TAG}`].filter(Boolean).join(" ");
}

function renderPanel() {
  const region = regionById(state.region);
  const topics = topicsForRegion(state.region);
  const meridians = meridiansForRegion(state.region);
  const nerves = NERVES.filter((n) => n.regions.includes(state.region));
  $("#panel-kicker").textContent = "Body region";
  $("#panel-title").textContent = region.name;
  $("#panel-lede").textContent = region.hint;
  const meta = $("#panel-meta");
  meta.innerHTML = "";
  meridians.forEach((m) => { const s = document.createElement("span"); s.className = "pill"; s.textContent = `${m.name} meridian`; meta.append(s); });
  nerves.forEach((n) => { const s = document.createElement("span"); s.className = "pill"; s.textContent = n.name; meta.append(s); });
  const topicBox = $("#panel-topics");
  topicBox.innerHTML = "";
  topics.slice(0, 8).forEach((t) => {
    const b = document.createElement("button");
    b.className = "chip";
    b.textContent = t.name;
    b.setAttribute("aria-pressed", state.topic === t.id ? "true" : "false");
    b.addEventListener("click", () => { state.topic = state.topic === t.id ? null : t.id; paintRegions(); renderPanel(); loadPosts(); });
    topicBox.append(b);
  });
  const ta = $("#compose-text");
  ta.value = composeText(state.region);
  $("#char-count").textContent = `${[...ta.value].length}/300`;
  renderFeed();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function bskyPostUrl(uri) {
  const parts = String(uri).replace("at://", "").split("/");
  if (parts.length >= 3) return `https://bsky.app/profile/${parts[0]}/post/${parts[2]}`;
  return "https://bsky.app";
}

function renderFeed() {
  const feed = $("#feed");
  feed.innerHTML = "";
  const pins = state.posts.length ? state.posts : SAMPLE_PINS.filter((p) => p.region === state.region || (state.topic && p.topic === state.topic));
  const filtered = state.posts.length ? pins : (pins.length ? pins : SAMPLE_PINS.filter((p) => p.region === "heart"));
  if (!state.live) {
    const note = document.createElement("p");
    note.className = "status";
    note.textContent = state.posts.length ? "Live Bluesky results." : "Showing cookbook sample pins until live search returns posts with these tags.";
    feed.append(note);
  }
  filtered.slice(0, 12).forEach((p) => {
    const art = document.createElement("article");
    art.className = "pin";
    const when = p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "";
    art.innerHTML = `<header><span>@${escapeHtml(p.handle || "unknown")}</span><span>${p.demo ? '<span class="demo-flag">sample</span> ' : ""}${when}</span></header><p>${escapeHtml(p.text)}</p>${p.uri ? `<p><a href="${bskyPostUrl(p.uri)}" target="_blank" rel="noopener">Open on Bluesky</a></p>` : ""}`;
    feed.append(art);
  });
}

async function loadPosts() {
  const region = regionById(state.region);
  const topic = state.topic ? topicById(state.topic) : null;
  const tag = topic ? topic.tags[0] : region.tag;
  $("#search-status").textContent = `Looking for #${tag} on Bluesky…`;
  try {
    const res = await fetch(`${BSKY_SEARCH}?q=${encodeURIComponent("#" + tag)}&limit=15&sort=latest`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    state.posts = (data.posts || []).map((post) => ({
      text: post.record?.text || "", handle: post.author?.handle,
      createdAt: post.record?.createdAt || post.indexedAt, uri: post.uri, demo: false,
    }));
    state.live = state.posts.length > 0;
    $("#search-status").textContent = state.live ? `${state.posts.length} posts tagged #${tag}` : `No live hits for #${tag} yet — using samples.`;
  } catch {
    state.posts = []; state.live = false;
    $("#search-status").textContent = "Live search is blocked or empty from this host. Samples still map the idea.";
  }
  renderFeed();
}

function renderTopicsPage() {
  const grid = $("#topic-grid");
  grid.innerHTML = "";
  TOPICS.forEach((t) => {
    const btn = document.createElement("button");
    btn.className = "card";
    btn.innerHTML = `<div class="kind">${t.kind}</div><h3>${t.name}</h3><p>${t.blurb}</p>`;
    btn.addEventListener("click", () => {
      state.topic = t.id;
      state.region = t.regions.find((id) => id !== "whole") || "whole";
      setPage("atlas"); paintRegions(); renderPanel(); loadPosts();
    });
    grid.append(btn);
  });
}

function openCompose() {
  window.open(`https://bsky.app/intent/compose?text=${encodeURIComponent($("#compose-text").value.slice(0, 300))}`, "_blank", "noopener");
}

function init() {
  $("#figure").innerHTML = figureSvg();
  paintLayers(); paintRegions(); renderPanel(); renderTopicsPage(); loadPosts();
  $("#figure").addEventListener("click", (e) => {
    const node = e.target.closest("[data-region]");
    if (!node) return;
    state.region = node.dataset.region;
    paintRegions(); renderPanel(); loadPosts();
  });
  document.querySelectorAll("nav button[data-go]").forEach((btn) => btn.addEventListener("click", () => setPage(btn.dataset.go)));
  $("#layer-meridians").addEventListener("click", () => {
    state.layers.meridians = !state.layers.meridians;
    $("#layer-meridians").setAttribute("aria-pressed", String(state.layers.meridians));
    paintLayers();
  });
  $("#layer-nerves").addEventListener("click", () => {
    state.layers.nerves = !state.layers.nerves;
    $("#layer-nerves").setAttribute("aria-pressed", String(state.layers.nerves));
    paintLayers();
  });
  $("#compose-text").addEventListener("input", (e) => { $("#char-count").textContent = `${[...e.target.value].length}/300`; });
  $("#btn-compose").addEventListener("click", openCompose);
  $("#btn-refresh").addEventListener("click", loadPosts);
  setPage("atlas");
}

init();
