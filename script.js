const featuredWorks = [
  {
    title: "云层备忘录",
    type: "网页项目",
    year: "2026",
    summary: "一个适合放个人观察、图文内容与实验排版的轻型网站模板。",
    detail:
      "这里可以放你自己做过的网页、课程项目，或者一篇你很喜欢的数字化表达。它更像一个线上展位，而不是单纯的列表页。",
    tags: ["Web", "Editorial", "Visual"]
  },
  {
    title: "晚风穿过教学楼",
    type: "校园观察",
    year: "2026",
    summary: "把大学生活里的微小感受，整理成可被浏览的叙事作品。",
    detail:
      "你可以在这里展示摄影、短文、调研、采访，或者一段你很想留住的校园经验，让作品更有温度和层次。",
    tags: ["Campus", "Story", "Archive"]
  },
  {
    title: "Blue Margin",
    type: "视觉实验",
    year: "2026",
    summary: "以天空蓝、线条感和留白感为核心的界面练习。",
    detail:
      "这一类项目很适合展示你的审美、版式能力和动效感觉。即使不是商业项目，也能很好地体现你的个人风格。",
    tags: ["Motion", "UI", "Personal"]
  },
  {
    title: "资料分享计划",
    type: "开放资源",
    year: "Ongoing",
    summary: "把笔记、整理文档和学习经验长期开放给学弟学妹。",
    detail:
      "这个栏目会让网站不仅好看，而且真正有用。你之后只要持续补充文件，它就会慢慢变成你自己的公开资料库。",
    tags: ["Sharing", "Notes", "Helpful"]
  }
];

const writingArchive = {
  poetry: [
    {
      title: "在风抵达之前",
      meta: "诗歌 / 片段",
      excerpt: "在天色变浅之前，我把没说完的话，轻轻放回口袋里。",
      detail:
        "在风抵达之前，树影先一步晃动。有人从走廊尽头经过，像一小段未署名的诗。我们把很多心事交给沉默，也把很多愿望交给时间。"
    },
    {
      title: "教室后窗",
      meta: "诗歌 / 校园",
      excerpt: "傍晚的光像粉尘一样安静，停在最后一排空着的椅子上。",
      detail:
        "教室后窗总能看见更晚一点的天色。风从操场吹过来，带着广播站试音的杂声，也带着今天还来不及命名的情绪。"
    },
    {
      title: "蓝色留白",
      meta: "诗歌 / 气氛",
      excerpt: "如果页面也会呼吸，它应该像云一样，把锋利的部分藏起来。",
      detail:
        "我想把蓝色写成一种留白。它不是退后，而是一种更轻的表达方式，让人靠近时才看见里面的层次和温度。"
    }
  ],
  fiction: [
    {
      title: "玻璃雨季",
      meta: "短篇小说 / 简介",
      excerpt: "她在每一场突如其来的雨里，都记起那栋教学楼的楼梯转角。",
      detail:
        "故事围绕一个迟迟没能说出口的告别展开。人物在熟悉的校园空间里反复经过彼此，也反复错过真正的时机。"
    },
    {
      title: "岛上的打印店",
      meta: "短篇小说 / 简介",
      excerpt: "那家打印店总在最晚的时候亮着灯，像替所有没交完的作业守夜。",
      detail:
        "一间校园打印店连接着许多人的大学片段。小说会通过不同顾客的经历，把成长、拖延、友情和独处串在一起。"
    }
  ]
};

const notesLibrary = [
  {
    title: "高等数学整理笔记",
    category: "数学",
    description: "适合考前复习，包含极限、导数、积分的基础梳理。",
    file: "downloads/calculus-notes.md",
    meta: ["Markdown", "可继续补充"]
  },
  {
    title: "设计史课堂笔记",
    category: "设计",
    description: "把重点流派、代表人物和时间线整理成更易查找的结构。",
    file: "downloads/design-history-notes.md",
    meta: ["结构清晰", "适合速查"]
  },
  {
    title: "写作方法课笔记",
    category: "写作",
    description: "记录课堂里的文本拆解方法和章节组织技巧。",
    file: "downloads/writing-workshop-notes.md",
    meta: ["创作向", "适合练习"]
  }
];

const worksGrid = document.querySelector("#worksGrid");
const archiveGrid = document.querySelector("#archiveGrid");
const notesGrid = document.querySelector("#notesGrid");
const spotlightTitle = document.querySelector("#spotlightTitle");
const spotlightDescription = document.querySelector("#spotlightDescription");
const spotlightTags = document.querySelector("#spotlightTags");
const modal = document.querySelector("#detailModal");
const modalTitle = document.querySelector("#modalTitle");
const modalBody = document.querySelector("#modalBody");
const modalMeta = document.querySelector("#modalMeta");
const tabButtons = document.querySelectorAll(".tab-button");
const progressBar = document.querySelector(".progress-bar");
const pointerAurora = document.querySelector(".pointer-aurora");
const navLinks = document.querySelectorAll(".nav a");

let activeArchiveTab = "poetry";

function renderWorks() {
  featuredWorks.forEach((work, index) => {
    const card = document.createElement("article");
    card.className = "work-card";
    card.setAttribute("data-reveal", "");
    card.innerHTML = `
      <div class="work-topline">
        <span>${work.type}</span>
        <span>${work.year}</span>
      </div>
      <h3>${work.title}</h3>
      <p>${work.summary}</p>
    `;

    const activateSpotlight = () => {
      spotlightTitle.textContent = work.title;
      spotlightDescription.textContent = work.detail;
      spotlightTags.innerHTML = work.tags.map((tag) => `<span>${tag}</span>`).join("");
    };

    card.addEventListener("mouseenter", activateSpotlight);
    card.addEventListener("focusin", activateSpotlight);
    card.addEventListener("click", () => openModal(work.title, work.detail, `${work.type} · ${work.year}`));

    if (index === 0) {
      activateSpotlight();
    }

    worksGrid.appendChild(card);
  });
}

function renderArchive(tab) {
  archiveGrid.innerHTML = "";
  writingArchive[tab].forEach((item) => {
    const card = document.createElement("article");
    card.className = "archive-card";
    card.setAttribute("data-reveal", "");
    card.innerHTML = `
      <div class="archive-topline">
        <span>${item.meta}</span>
      </div>
      <h3>${item.title}</h3>
      <p>${item.excerpt}</p>
    `;
    card.addEventListener("click", () => openModal(item.title, item.detail, item.meta));
    archiveGrid.appendChild(card);
  });
}

function renderNotes() {
  notesLibrary.forEach((note) => {
    const card = document.createElement("article");
    card.className = "note-card";
    card.setAttribute("data-reveal", "");
    card.innerHTML = `
      <div class="note-topline">
        <span>${note.category}</span>
      </div>
      <h3>${note.title}</h3>
      <p>${note.description}</p>
      <div class="note-meta">${note.meta.map((item) => `<span>${item}</span>`).join("")}</div>
      <a class="button secondary" href="${note.file}" download>免费下载</a>
    `;
    notesGrid.appendChild(card);
  });
}

function openModal(title, body, meta) {
  modalTitle.textContent = title;
  modalBody.textContent = body;
  modalMeta.textContent = meta;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

function setupTabs() {
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeArchiveTab = button.dataset.tab;
      tabButtons.forEach((item) => item.classList.toggle("active", item === button));
      renderArchive(activeArchiveTab);
      setupReveal();
    });
  });
}

function setupReveal() {
  const revealables = document.querySelectorAll("[data-reveal]");
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
  window.addEventListener(
    "pointermove",
    (event) => {
      pointerAurora.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    },
    { passive: true }
  );
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

function setupModalControls() {
  modal.addEventListener("click", (event) => {
    if (event.target.hasAttribute("data-close-modal")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
}

function setYear() {
  document.querySelector("#year").textContent = new Date().getFullYear();
}

renderWorks();
renderArchive(activeArchiveTab);
renderNotes();
setupTabs();
setupReveal();
setupScrollProgress();
setupPointerAurora();
setupSectionSpy();
setupModalControls();
setYear();
