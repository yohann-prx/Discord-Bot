const categories = {
  "youtube.com": "📺 Video",
  "github.com": "💻 Code",
  "medium.com": "📚 Article",
};

// Sanitize URL by removing UTM parameters
function sanitizeUrl(url) {
  const cleanUrl = new URL(url);
  ["utm_source", "utm_medium", "utm_campaign"].forEach((param) => {
    cleanUrl.searchParams.delete(param);
  });
  return cleanUrl.toString();
}

const rateLimits = new Map();

// Check rate limit for a user
function checkRateLimit(userId) {
  const now = Date.now();
  const userLimit = rateLimits.get(userId);

  if (userLimit && now - userLimit < 30000) {
    return false;
  }

  rateLimits.set(userId, now);
  return true;
}

// Export the functions
module.exports = {
  categories,
  sanitizeUrl,
  checkRateLimit,
};
