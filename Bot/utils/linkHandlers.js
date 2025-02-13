const specialDomainHandlers = {
  // Object with the domain as key and a function as value
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

  "medium.com": async (url) => {
    return {
      title: "Medium Article",
      color: 0x12100e,
    };
  },
};

module.exports = specialDomainHandlers;
