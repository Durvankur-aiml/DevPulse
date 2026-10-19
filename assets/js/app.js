const commands = [
  // --- LINUX COMMANDS ---
  {
    tool: "Linux",
    name: "System Resource Monitor",
    cmd: "htop",
    desc: "Interactive real-time process viewer and system resource manager.",
    tagClass: "tag-linux"
  },
  {
    tool: "Linux",
    name: "Check Listening Ports",
    cmd: "sudo ss -tulpn | grep LISTEN",
    desc: "Inspect active TCP/UDP listening sockets with process IDs.",
    tagClass: "tag-linux"
  },
  {
    tool: "Linux",
    name: "Disk Space Usage",
    cmd: "df -h --total",
    desc: "Show human-readable filesystem disk space usage summary.",
    tagClass: "tag-linux"
  },
  {
    tool: "Linux",
    name: "Follow System Logs",
    cmd: "journalctl -u nginx.service -f -n 50",
    desc: "Stream the last 50 log lines for a specific systemd service.",
    tagClass: "tag-linux"
  },

  // --- GIT COMMANDS ---
  {
    tool: "Git",
    name: "Formatted Commit History",
    cmd: "git log --oneline --graph --decorate --all",
    desc: "Display compact visual branching tree across all branches.",
    tagClass: "tag-git"
  },
  {
    tool: "Git",
    name: "Stash Uncommitted Changes",
    cmd: "git stash push -m 'wip-feature-save'",
    desc: "Temporarily shelter uncommitted tracked and untracked work.",
    tagClass: "tag-git"
  },
  {
    tool: "Git",
    name: "Undo Last Commit (Keep Files)",
    cmd: "git reset --soft HEAD~1",
    desc: "Rewinds the latest commit while preserving staged changes.",
    tagClass: "tag-git"
  },
  {
    tool: "Git",
    name: "Clean Untracked Files",
    cmd: "git clean -fd",
    desc: "Forcefully remove untracked directories and files from tree.",
    tagClass: "tag-git"
  },

  // --- DOCKER COMMANDS ---
  {
    tool: "Docker",
    name: "Run Container Detached",
    cmd: "docker run -d --name web-app -p 8080:80 --restart unless-stopped nginx:alpine",
    desc: "Run background container mapped to port 8080 with auto-restart.",
    tagClass: "tag-docker"
  },
  {
    tool: "Docker",
    name: "Stream Container Logs",
    cmd: "docker logs -f --tail 100 <container-id>",
    desc: "Follow the live standard output and errors of a container.",
    tagClass: "tag-docker"
  },
  {
    tool: "Docker",
    name: "Interactive Container Shell",
    cmd: "docker exec -it <container-id> /bin/sh",
    desc: "Attach an interactive TTY shell session inside a running container.",
    tagClass: "tag-docker"
  },
  {
    tool: "Docker",
    name: "Purge Dangling Resources",
    cmd: "docker system prune -af --volumes",
    desc: "Remove all stopped containers, unused networks, and dangling volumes.",
    tagClass: "tag-docker"
  },

  // --- KUBERNETES COMMANDS ---
  {
    tool: "Kubernetes",
    name: "List All Namespace Pods",
    cmd: "kubectl get pods -A -o wide",
    desc: "Retrieve all running pods across clusters with assigned node IPs.",
    tagClass: "tag-kubernetes"
  },
  {
    tool: "Kubernetes",
    name: "Describe Problematic Pod",
    cmd: "kubectl describe pod <pod-name> -n default",
    desc: "Show detailed status events and lifecycle errors for debugging.",
    tagClass: "tag-kubernetes"
  },
  {
    tool: "Kubernetes",
    name: "Stream Deployment Logs",
    cmd: "kubectl logs -f deployment/<deploy-name> --all-containers=true",
    desc: "Stream real-time stdout across all pods in a deployment.",
    tagClass: "tag-kubernetes"
  },
  {
    tool: "Kubernetes",
    name: "Rollout Status & History",
    cmd: "kubectl rollout status deployment/<deploy-name>",
    desc: "Monitor status of rolling update deployment progression.",
    tagClass: "tag-kubernetes"
  }
];

const container = document.getElementById("commandContainer");
const searchInput = document.getElementById("searchInput");
const filterChips = document.querySelectorAll(".filter-chip");
let activeCategory = "all";

function renderCards(list) {
  if (!container) return;
  container.innerHTML = "";
  if (!list || list.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <p>No matching commands found.</p>
        <small>Try querying terms like 'htop', 'prune', 'stash', or 'rollout'</small>
      </div>`;
    return;
  }

  list.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "card";
    const formattedId = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;
    card.innerHTML = `
      <div class="card-header">
        <span class="tag ${item.tagClass}">${item.tool}</span>
        <span class="cmd-id">#${formattedId}</span>
      </div>
      <h3 class="card-title">${item.name}</h3>
      <p class="card-desc">${item.desc}</p>
      <div class="code-box">
        <span class="terminal-prefix">$</span>
        <code id="cmd-${index}">${item.cmd}</code>
        <button class="copy-btn" onclick="copySnippet('cmd-${index}', this)" title="Copy syntax" aria-label="Copy syntax">
          <svg class="copy-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span class="btn-text">Copy</span>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function copySnippet(elementId, btn) {
  const codeElement = document.getElementById(elementId);
  if (!codeElement) return;
  const text = codeElement.innerText;

  navigator.clipboard.writeText(text).then(() => {
    btn.classList.add("copied");
    const btnText = btn.querySelector(".btn-text");
    if (btnText) btnText.innerText = "Copied";
    setTimeout(() => {
      btn.classList.remove("copied");
      if (btnText) btnText.innerText = "Copy";
    }, 1500);
  }).catch(() => {
    // Fallback for non-https or older browser permissions
    const tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    btn.classList.add("copied");
    const btnText = btn.querySelector(".btn-text");
    if (btnText) btnText.innerText = "Copied";
    setTimeout(() => {
      btn.classList.remove("copied");
      if (btnText) btnText.innerText = "Copy";
    }, 1500);
  });
}

window.copySnippet = copySnippet;

function filterDataset() {
  if (!searchInput) return;
  const query = searchInput.value.trim().toLowerCase();
  const filtered = commands.filter(c => {
    const matchesCategory = (activeCategory === "all") || (c.tool.toLowerCase() === activeCategory);
    const matchesSearch = c.name.toLowerCase().includes(query) ||
                          c.tool.toLowerCase().includes(query) ||
                          c.cmd.toLowerCase().includes(query) ||
                          c.desc.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
  renderCards(filtered);
}

if (searchInput) {
  searchInput.addEventListener("input", filterDataset);
}

if (filterChips) {
  filterChips.forEach(chip => {
    chip.addEventListener("click", () => {
      filterChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeCategory = chip.getAttribute("data-category");
      filterDataset();
    });
  });
}

// Initial Render
renderCards(commands);
