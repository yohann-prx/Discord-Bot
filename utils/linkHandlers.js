const specialDomainHandlers = {
  "youtube.com": async (url) => {
    const videoId = url.searchParams.get("v");
    if (!videoId) return null;

    return {
      title: "YouTube Video",
      color: 0xff0000,
    };
  },

  "github.com": async (url) => {
    return {
      title: "GitHub Repository",
      color: 0x24292e,
    };
  },
};

module.exports = specialDomainHandlers;
