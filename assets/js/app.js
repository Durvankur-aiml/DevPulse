const commands = [
  {
    tool: "Git",
    name: "Clone Repository",
    cmd: "git clone <repo-url>",
    desc: "Clone a remote repository to your local machine."
  },
  {
    tool: "Git",
    name: "Check Status",
    cmd: "git status -s",
    desc: "Display modified, staged, and untracked files in a short format."
  },
  {
    tool: "Git",
    name: "Switch Branch",
    cmd: "git switch -c <branch-name>",
    desc: "Create and immediately switch to a new local branch."
  },
  {
    tool: "Docker",
    name: "Run Container",
    cmd: "docker run -d -p 80:80 nginx",
    desc: "Run an Nginx web server container in detached mode mapped to port 80."
  },
  {
    tool: "Docker",
    name: "List Running Containers",
    cmd: "docker ps",
    desc: "List all currently running Docker containers on the host system."
  },
  {
    tool: "Docker",
    name: "Stop Container",
    cmd: "docker stop <container-id>",
    desc: "Gracefully stop one or more running Docker containers."
  },
  {
    tool: "Kubernetes",
    name: "Get Pods",
    cmd: "kubectl get pods -A",
    desc: "List all Kubernetes pods across all namespaces."
  },
  {
    tool: "Kubernetes",
    name: "Stream Pod Logs",
    cmd: "kubectl logs -f <pod-name>",
    desc: "Stream and tail real-time log output from a specified pod."
  },
  {
    tool: "Kubernetes",
    name: "Describe Resource",
    cmd: "kubectl describe pod <pod-name>",
    desc: "Display detailed state, events, and diagnostics of a pod."
  }
];

function copyCommand(text, buttonElement) {
  const applySuccessState = () => {
    buttonElement.textContent = "Copied! ✔";
    buttonElement.classList.add("copied");
    buttonElement.style.backgroundColor = "#22c55e";
    buttonElement.style.color = "#020617";

    setTimeout(() => {
      buttonElement.textContent = "Copy";
      buttonElement.classList.remove("copied");
      buttonElement.style.backgroundColor = "";
      buttonElement.style.color = "";
    }, 1500);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        applySuccessState();
      })
      .catch(() => {
        fallbackCopy(text, applySuccessState);
      });
  } else {
    fallbackCopy(text, applySuccessState);
  }
}

function fallbackCopy(text, onSuccess) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    onSuccess();
  } catch (err) {
    console.error("Failed to copy command using fallback: ", err);
  } finally {
    document.body.removeChild(textarea);
  }
}

function renderCards(list) {
  const container = document.getElementById("commandContainer");
  if (!container) return;

  container.innerHTML = "";

  if (!list || list.length === 0) {
    const noResults = document.createElement("div");
    noResults.className = "no-results";
    noResults.style.gridColumn = "1 / -1";
    noResults.style.textAlign = "center";
    noResults.style.color = "var(--text-muted, #94a3b8)";
    noResults.style.padding = "3rem 1rem";
    noResults.style.fontSize = "1.2rem";
    noResults.textContent = "No matching commands found";
    container.appendChild(noResults);
    return;
  }

  list.forEach((item) => {
    const card = document.createElement("div");
    card.className = "command-card";

    card.innerHTML = `
      <div class="card-header">
        <span class="tool-tag">${item.tool}</span>
      </div>
      <h3 class="card-title">${item.name}</h3>
      <p class="card-desc">${item.desc}</p>
      <div class="code-box">
        <code>${item.cmd}</code>
        <button class="copy-btn" type="button">Copy</button>
      </div>
    `;

    const copyBtn = card.querySelector(".copy-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        copyCommand(item.cmd, copyBtn);
      });
    }

    container.appendChild(card);
  });
}

function initApp() {
  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filtered = commands.filter((item) => {
        return (
          item.name.toLowerCase().includes(query) ||
          item.tool.toLowerCase().includes(query) ||
          item.cmd.toLowerCase().includes(query)
        );
      });
      renderCards(filtered);
    });
  }

  renderCards(commands);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
