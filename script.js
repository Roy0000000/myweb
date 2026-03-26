function buildPreviewPages(prefix, count) {
  return Array.from({ length: count }, (_, index) => {
    const page = String(index + 1).padStart(2, "0");
    return `${prefix}/page-${page}.png`;
  });
}

const notesLibrary = [
  {
    title: "微积分笔记",
    category: "数学",
    description: "站内先展出前 16 页，方便你先翻看结构与书写风格，再决定是否完整下载。",
    meta: ["预览 16 页", "微积分", "百度网盘"],
    shareLink: "https://pan.baidu.com/s/5iq-1MW8-DuYEoCSGssMv_Q",
    qrImage: "assets/baidu-notes-qr.jpg",
    previewCount: 16,
    sideTitle: "微积分完整笔记",
    sideCopy:
      "完整版本存放在百度网盘里。这里先展出前 16 页，供你判断内容密度、排版习惯与是否适合保存到自己的资料夹。",
    previewPages: buildPreviewPages("assets/note-previews/calculus", 16)
  },
  {
    title: "线性代数笔记",
    category: "数学",
    description: "先开放 16 页站内预览，把整体结构、重点整理方式和笔记气质直接展示出来。",
    meta: ["预览 16 页", "线性代数", "百度网盘"],
    shareLink: "https://pan.baidu.com/s/5iq-1MW8-DuYEoCSGssMv_Q",
    qrImage: "assets/baidu-notes-qr.jpg",
    previewCount: 16,
    sideTitle: "线性代数完整笔记",
    sideCopy:
      "站内这部分像是资料馆里的样张，完整版本则放在百度网盘。若你觉得这一套整理方式适合自己，可以直接扫码或打开链接带走。",
    previewPages: buildPreviewPages("assets/note-previews/linear-algebra", 16)
  }
];

const libraryShelf = window.libraryShelf || [];

const bookshelfGrid = document.querySelector("#bookshelfGrid");
const notesGrid = document.querySelector("#notesGrid");
const modal = document.querySelector("#detailModal");
const modalTitle = document.querySelector("#modalTitle");
const modalBody = document.querySelector("#modalBody");
const modalMeta = document.querySelector("#modalMeta");
const readerModal = document.querySelector("#readerModal");
const readerCover = document.querySelector("#readerCover");
const readerBookMeta = document.querySelector("#readerBookMeta");
const readerBookTitle = document.querySelector("#readerBookTitle");
const readerBookDescription = document.querySelector("#readerBookDescription");
const readerToc = document.querySelector("#readerToc");
const readerPieceMeta = document.querySelector("#readerPieceMeta");
const readerPieceTitle = document.querySelector("#readerPieceTitle");
const readerMain = document.querySelector(".reader-main");
const readerContent = document.querySelector("#readerContent");
const notePreviewModal = document.querySelector("#notePreviewModal");
const notePreviewTitle = document.querySelector("#notePreviewTitle");
const notePreviewMeta = document.querySelector("#notePreviewMeta");
const notePreviewOpen = document.querySelector("#notePreviewOpen");
const notePreviewDownload = document.querySelector("#notePreviewDownload");
const notePreviewPager = document.querySelector("#notePreviewPager");
const notePreviewPages = document.querySelector("#notePreviewPages");
const notePreviewQr = document.querySelector("#notePreviewQr");
const notePreviewSideTitle = document.querySelector("#notePreviewSideTitle");
const notePreviewSideCopy = document.querySelector("#notePreviewSideCopy");
const progressBar = document.querySelector(".progress-bar");
const pointerAurora = document.querySelector(".pointer-aurora");
const navLinks = document.querySelectorAll(".nav a");
const overlayTimers = new WeakMap();
const OVERLAY_TRANSITION_MS = 520;

let activeBookId = null;
let notePreviewObserver = null;

function showOverlay(element) {
  if (!element) {
    return;
  }

  const timer = overlayTimers.get(element);
  if (timer) {
    window.clearTimeout(timer);
    overlayTimers.delete(element);
  }

  element.hidden = false;
  element.classList.remove("is-closing");
  element.getBoundingClientRect();
  element.classList.add("is-open");
}

function hideOverlay(element, onHidden) {
  if (!element || element.hidden) {
    if (onHidden) {
      onHidden();
    }
    return;
  }

  const timer = overlayTimers.get(element);
  if (timer) {
    window.clearTimeout(timer);
  }

  element.classList.remove("is-open");
  element.classList.add("is-closing");

  const timeoutId = window.setTimeout(() => {
    element.hidden = true;
    element.classList.remove("is-closing");
    overlayTimers.delete(element);
    if (onHidden) {
      onHidden();
    }
    setOverlayLock();
  }, OVERLAY_TRANSITION_MS);

  overlayTimers.set(element, timeoutId);
}

function setOverlayLock() {
  const hasOpenOverlay = !modal.hidden || !readerModal.hidden || !notePreviewModal.hidden;
  document.body.style.overflow = hasOpenOverlay ? "hidden" : "";
}

function renderBookshelf() {
  if (!bookshelfGrid) {
    return;
  }

  bookshelfGrid.innerHTML = "";
  libraryShelf.forEach((book) => {
    const card = document.createElement("article");
    card.className = "book-card";
    card.dataset.tone = book.tone;
    card.classList.add("revealed");

    card.innerHTML = `
      <div class="book-cover">
        <span class="book-mark">${book.type}</span>
        <h3 class="book-title">${book.title}</h3>
        <p class="book-subtitle">${book.subtitle.replace(/\n/g, "<br>")}</p>
        <span class="book-spine">${book.title[0]}</span>
      </div>
      <div class="book-meta">
        <span>${book.meta}</span>
        <span>${book.pieces.length} 篇</span>
      </div>
      <p class="book-summary">${book.summary}</p>
      <div class="book-actions">
        <button class="book-link" type="button">打开目录</button>
      </div>
    `;

    const launchReader = () => triggerBookOpen(card, book.id);
    card.querySelector(".book-link").addEventListener("click", launchReader);
    card.querySelector(".book-cover").addEventListener("click", launchReader);

    bookshelfGrid.appendChild(card);
  });
}

function triggerBookOpen(card, bookId) {
  if (!card) {
    openReader(bookId, 0);
    return;
  }

  card.classList.add("is-pressing");
  window.setTimeout(() => {
    card.classList.remove("is-pressing");
    openReader(bookId, 0);
  }, 120);
}

function renderNotes() {
  if (!notesGrid) {
    return;
  }

  notesGrid.innerHTML = "";
  notesLibrary.forEach((note) => {
    const card = document.createElement("article");
    card.className = "note-card";
    card.classList.add("revealed");
    card.innerHTML = `
      <div class="note-topline">
        <span>${note.category}</span>
      </div>
      <h3>${note.title}</h3>
      <p>${note.description}</p>
      <div class="note-meta">${note.meta.map((item) => `<span>${item}</span>`).join("")}</div>
      <div class="note-card-actions">
        <button class="button secondary note-preview-button" type="button">查看 16 页预览</button>
        <a class="button primary" href="${note.shareLink}" target="_blank" rel="noreferrer">网盘下载</a>
      </div>
    `;
    card
      .querySelector(".note-preview-button")
      .addEventListener("click", () => openNotePreview(note));
    notesGrid.appendChild(card);
  });
}

function renderPieceContent(piece) {
  readerContent.innerHTML = "";

  if (piece.layout === "poem") {
    const wrapper = document.createElement("div");
    wrapper.className = "reader-poem";

    piece.body
      .trim()
      .split(/\n\s*\n/g)
      .forEach((stanza) => {
        const paragraph = document.createElement("p");
        const lines = stanza.split("\n").map((line) => line.trim()).filter(Boolean);

        if (lines.length > 0 && lines.every(isPoemMetaLine)) {
          paragraph.classList.add("is-meta");
        }

        lines.forEach((line, index) => {
          if (index > 0) {
            paragraph.appendChild(document.createElement("br"));
          }
          paragraph.append(line);
        });

        wrapper.appendChild(paragraph);
      });

    readerContent.appendChild(wrapper);
    return;
  }

  piece.body
    .trim()
    .split(/\n\s*\n/g)
    .forEach((block) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = block;
      readerContent.appendChild(paragraph);
    });
}

function renderReader(bookId, pieceIndex) {
  const book = libraryShelf.find((entry) => entry.id === bookId);
  if (!book || !book.pieces || book.pieces.length === 0) {
    return;
  }

  const piece = book.pieces[pieceIndex];
  activeBookId = bookId;

  readerCover.style.setProperty("--reader-a", getToneColors(book.tone).a);
  readerCover.style.setProperty("--reader-b", getToneColors(book.tone).b);
  readerBookMeta.textContent = `${book.type} / ${book.meta}`;
  readerBookTitle.textContent = book.title;
  readerBookDescription.textContent = book.readerDescription;

  readerPieceMeta.textContent = `${book.title} / ${pieceIndex + 1} of ${book.pieces.length}`;
  readerPieceTitle.textContent = piece.title;
  readerPieceTitle.classList.toggle("is-poem-title", piece.layout === "poem");
  readerPieceMeta.classList.toggle("is-poem-meta", piece.layout === "poem");
  readerMain.classList.toggle("is-poem", piece.layout === "poem");

  readerToc.innerHTML = "";
  book.pieces.forEach((entry, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = entry.title;
    button.classList.toggle("is-active", index === pieceIndex);
    button.addEventListener("click", () => renderReader(bookId, index));
    readerToc.appendChild(button);
  });

  renderPieceContent(piece);
  readerMain.classList.remove("piece-enter");
  readerMain.getBoundingClientRect();
  readerMain.classList.add("piece-enter");
  readerMain.scrollTop = 0;
}

function isPoemMetaLine(line) {
  return (
    line.startsWith("——") ||
    line.startsWith("作于") ||
    /^\d{4}[.\-\/年]/.test(line) ||
    /^\d{4}\.\d{1,2}\.\d{1,2}/.test(line)
  );
}

function normalizeSourceText(text) {
  return text
    .replace(/\r/g, "")
    .replace(/[\u2028\u2029]/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/^[ \t]*•[ \t]*/gm, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n");
}

function parseNovelSource(text) {
  const normalized = normalizeSourceText(text);
  const lines = normalized.split("\n").map((line) => line.trim());
  const pieces = [];
  let currentTitle = null;
  let buffer = [];
  let reachedDirectory = false;

  const flush = () => {
    if (!currentTitle) {
      return;
    }

    const content = buffer.filter(Boolean).join("\n\n").trim();
    pieces.push({
      title: currentTitle,
      layout: "prose",
      body: content
    });
    buffer = [];
  };

  lines.forEach((line) => {
    if (!line) {
      return;
    }

    if (!reachedDirectory) {
      if (line === "目录") {
        reachedDirectory = true;
        currentTitle = "目录";
      }
      return;
    }

    if (/^第[一二三四五六七八九十百零]+话/.test(line) && !line.includes("··")) {
      flush();
      currentTitle = line;
      return;
    }

    if (line === "目录") {
      flush();
      currentTitle = "目录";
      return;
    }

    if (currentTitle === "目录") {
      buffer.push(line.replace(/·+\d+$/, "").trim());
      return;
    }

    buffer.push(line);
  });

  flush();

  return pieces.filter((piece) => piece.title !== "作者介绍" && piece.body);
}

async function loadDynamicLibraryContent() {
  const sourceBooks = libraryShelf.filter((book) => book.sourcePath);

  await Promise.all(
    sourceBooks.map(async (book) => {
      try {
        const response = await fetch(book.sourcePath);
        if (!response.ok) {
          return;
        }

        const text = await response.text();
        if (book.id === "mountain") {
          book.pieces = parseNovelSource(text);
          const chapterCount = book.pieces.filter((piece) => piece.title !== "目录").length;
          book.meta = `${chapterCount} 章`;
        }
      } catch (error) {
        console.error(`Failed to load ${book.title}`, error);
      }
    })
  );
}

function getToneColors(tone) {
  const palette = {
    xifeng: { a: "#5479bc", b: "#93b3e7" },
    moonlight: { a: "#7084b6", b: "#c1c7ef" },
    mountain: { a: "#607489", b: "#b2c0cd" }
  };

  return palette[tone] || palette.xifeng;
}

function openModal(title, body, meta) {
  modalTitle.textContent = title;
  modalBody.textContent = body;
  modalMeta.textContent = meta;
  showOverlay(modal);
  setOverlayLock();
}

function closeModal() {
  hideOverlay(modal);
}

function openReader(bookId, pieceIndex) {
  renderReader(bookId, pieceIndex);
  showOverlay(readerModal);
  setOverlayLock();
}

function closeReader() {
  hideOverlay(readerModal);
}

function openNotePreview(note) {
  notePreviewTitle.textContent = note.title;
  notePreviewMeta.textContent = `${note.category} / ${note.meta.join(" / ")}`;
  notePreviewOpen.href = note.shareLink;
  notePreviewDownload.href = note.shareLink;
  notePreviewPager.innerHTML = "";
  notePreviewPages.innerHTML = "";
  notePreviewPager.scrollLeft = 0;
  notePreviewPages.scrollTop = 0;
  notePreviewSideTitle.textContent = note.sideTitle;
  notePreviewSideCopy.textContent = note.sideCopy;

  if (notePreviewObserver) {
    notePreviewObserver.disconnect();
    notePreviewObserver = null;
  }

  note.previewPages.forEach((page, index) => {
    const figure = document.createElement("figure");
    figure.className = "note-preview-page";
    figure.id = `note-preview-page-${index + 1}`;
    figure.dataset.page = String(index + 1);
    figure.innerHTML = `
      <img src="${page}" alt="${note.title} 第 ${index + 1} 页预览" loading="lazy" />
      <figcaption>Preview ${index + 1}</figcaption>
    `;
    notePreviewPages.appendChild(figure);

    const pagerButton = document.createElement("button");
    pagerButton.type = "button";
    pagerButton.className = "note-preview-page-button";
    pagerButton.textContent = String(index + 1).padStart(2, "0");
    pagerButton.addEventListener("click", () => {
      figure.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    notePreviewPager.appendChild(pagerButton);
  });

  notePreviewQr.src = note.qrImage;
  notePreviewQr.alt = `${note.title} 下载二维码`;

  const pagerButtons = [...notePreviewPager.querySelectorAll(".note-preview-page-button")];
  const figures = [...notePreviewPages.querySelectorAll(".note-preview-page")];

  const setActivePreviewPage = (pageNumber) => {
    pagerButtons.forEach((button, index) => {
      button.classList.toggle("is-active", index + 1 === pageNumber);
    });

    figures.forEach((figure, index) => {
      figure.classList.toggle("is-active", index + 1 === pageNumber);
    });
  };

  setActivePreviewPage(1);

  notePreviewObserver = new IntersectionObserver(
    (entries) => {
      const activeEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!activeEntry) {
        return;
      }

      setActivePreviewPage(Number(activeEntry.target.dataset.page));
    },
    {
      root: notePreviewPages,
      threshold: [0.35, 0.6, 0.85]
    }
  );

  figures.forEach((figure) => notePreviewObserver.observe(figure));

  showOverlay(notePreviewModal);
  setOverlayLock();
}

function closeNotePreview() {
  hideOverlay(notePreviewModal, () => {
    if (notePreviewObserver) {
      notePreviewObserver.disconnect();
      notePreviewObserver = null;
    }
  });
}

function setupReveal() {
  const revealables = document.querySelectorAll("[data-reveal]");
  if (revealables.length === 0) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16
    }
  );

  revealables.forEach((item) => observer.observe(item));
}

function setupScrollProgress() {
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
}

function setupPointerAurora() {
  if (!pointerAurora) {
    return;
  }

  const state = {
    currentX: window.innerWidth * 0.5,
    currentY: window.innerHeight * 0.22,
    targetX: window.innerWidth * 0.5,
    targetY: window.innerHeight * 0.22
  };

  let rafId = 0;

  const render = () => {
    state.currentX += (state.targetX - state.currentX) * 0.12;
    state.currentY += (state.targetY - state.currentY) * 0.12;

    pointerAurora.style.transform = `translate3d(${state.currentX}px, ${state.currentY}px, 0)`;
    rafId = window.requestAnimationFrame(render);
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      state.targetX = event.clientX;
      state.targetY = event.clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerleave",
    () => {
      state.targetX = window.innerWidth * 0.5;
      state.targetY = window.innerHeight * 0.22;
    },
    { passive: true }
  );

  if (!rafId) {
    rafId = window.requestAnimationFrame(render);
  }
}

function setupSectionSpy() {
  const sections = document.querySelectorAll("main section[id]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navLinks.forEach((link) => {
          const matches = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("is-active", matches);
        });
      });
    },
    {
      threshold: 0.45,
      rootMargin: "-10% 0px -30% 0px"
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupOverlayControls() {
  modal.addEventListener("click", (event) => {
    if (event.target.hasAttribute("data-close-modal")) {
      closeModal();
    }
  });

  readerModal.addEventListener("click", (event) => {
    if (event.target.hasAttribute("data-close-reader")) {
      closeReader();
    }
  });

  notePreviewModal.addEventListener("click", (event) => {
    if (event.target.hasAttribute("data-close-note-preview")) {
      closeNotePreview();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (!notePreviewModal.hidden) {
      closeNotePreview();
      return;
    }

    if (!readerModal.hidden) {
      closeReader();
      return;
    }

    if (!modal.hidden) {
      closeModal();
    }
  });
}

function setYear() {
  const yearNode = document.querySelector("#year");
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }
}

async function init() {
  try {
    await loadDynamicLibraryContent();
  } catch (error) {
    console.error("Failed to initialize dynamic library content", error);
  }

  renderBookshelf();
  renderNotes();
  document.body.classList.add("enable-reveal");
  setupReveal();
  setupScrollProgress();
  setupPointerAurora();
  setupSectionSpy();
  setupOverlayControls();
  setYear();
}

init();
