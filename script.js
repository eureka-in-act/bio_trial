document.addEventListener("DOMContentLoaded", async () => {
  const showEmailBtn = document.getElementById("show-email");
  const emailText = document.getElementById("email-text");

  if (showEmailBtn && emailText) {
    showEmailBtn.addEventListener("click", function (e) {
      e.preventDefault();

      const isVisible = emailText.style.display === "block";
      emailText.style.display = isVisible ? "none" : "block";
    });
  }

  const toggleBtn = document.getElementById("audio-toggle-btn");
  const nextBtn = document.getElementById("audio-next-btn");
  const volumeSlider = document.getElementById("volume-slider");
  const volumeLabel = document.getElementById("volume-label");
  const skillsBody = document.getElementById("skills-body");
  const nowPlaying = document.getElementById("now-playing");
  const playlistItems = document.querySelectorAll(".playlist-item");

  let player;
  let isPlaying = false;

  function updateNowPlaying() {
    if (!player || !player.getVideoData) return;

    const videoData = player.getVideoData();

    if (videoData && videoData.title) {
      nowPlaying.textContent = `Now playing: ${videoData.title}`;
    } else {
      nowPlaying.textContent = "Now playing: Loading...";
    }
  }

  function updateActivePlaylistItem(index) {
    playlistItems.forEach((item, itemIndex) => {
      item.classList.toggle("active", itemIndex === index);
    });
  }

  function getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  function updateVolumeLabel(value) {
    volumeLabel.textContent = value + "%";
  }

  function updateToggleButton() {
    toggleBtn.textContent = isPlaying ? "⏸ Pause Music" : "▶ Play Music";
  }

  function loadYouTubeAPI() {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    const existingScript = document.querySelector("script[src*='youtube.com/iframe_api']");
    if (existingScript) {
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  }

  function initPlayer() {
    if (!document.getElementById("youtube-player")) {
      return;
    }

    const startingIndex = getDayOfYear();

    player = new YT.Player("youtube-player", {
      height: "0",
      width: "0",
      playerVars: {
        listType: "playlist",
        list: "PLJHGAj4nc0Es",
        index: startingIndex,
        autoplay: 1,
        controls: 0,
        loop: 1,
        rel: 0,
        playsinline: 1
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });
  }

  function onPlayerReady(event) {
    player = event.target;

    const initialVolume = Number(volumeSlider.value);
    player.setVolume(initialVolume);
    updateVolumeLabel(initialVolume);

    updateActivePlaylistItem(player.getPlaylistIndex());
    updateNowPlaying();
    player.playVideo();
    isPlaying = true;
    updateToggleButton();

    toggleBtn.addEventListener("click", () => {
      if (!player) return;

      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    });

    nextBtn.addEventListener("click", () => {
      if (!player) return;
      player.nextVideo();
      player.playVideo();
      isPlaying = true;
      updateToggleButton();
    });

    playlistItems.forEach((item) => {
      item.addEventListener("click", () => {
        const index = Number(item.dataset.index);

        if (player && typeof player.playVideoAt === "function") {
          player.playVideoAt(index);
          updateActivePlaylistItem(index);
        }
      });
    });

    volumeSlider.addEventListener("input", () => {
      const targetVolume = Number(volumeSlider.value);
      updateVolumeLabel(targetVolume);

      if (player && typeof player.setVolume === "function") {
        player.setVolume(targetVolume);
      }
    });
  }

  function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    isPlaying = true;
    updateToggleButton();
    updateNowPlaying();
  } else if (
    event.data === YT.PlayerState.PAUSED ||
    event.data === YT.PlayerState.ENDED ||
    event.data === YT.PlayerState.BUFFERING
  ) {
    isPlaying = false;
    updateToggleButton();
    updateNowPlaying();
  }
}

  window.onYouTubeIframeAPIReady = function () {
    initPlayer();
  };

  updateToggleButton();
  loadYouTubeAPI();

  try {
    const response = await fetch("skills.json");
    const skills = await response.json();

    skills.forEach((item) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${item.skill}</td>
        <td>${item.proficiency}</td>
      `;

      skillsBody.appendChild(row);
    });
  } catch (error) {
    console.error("Failed to load skill data:", error);
  }
});