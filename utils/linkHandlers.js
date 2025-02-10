const specialDomainHandlers = {
  "youtube.com": async (url) => {
    // Add special handling for YouTube links
    const videoId = url.searchParams.get("v");
    if (!videoId) return null;

    return {
      title: "YouTube Video",
      color: 0xff0000, // YouTube red
      // Add specific YouTube metadata
    };
  },

  "github.com": async (url) => {
    // Add special handling for GitHub links
    return {
      title: "GitHub Repository",
      color: 0x24292e, // GitHub dark
      // Add specific GitHub metadata
    };
  },
  // Add more special domain handlers as needed
};

const categories = {
  "youtube.com": "📺 Video",
  "github.com": "💻 Code",
  "medium.com": "📚 Article",
  // Add more categories
};

fields: [
  {
    name: "Category",
    value: categories[new URL(url).hostname] || "🔗 Link",
    inline: true,
  },
  // ... other fields
];
