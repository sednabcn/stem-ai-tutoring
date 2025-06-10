const fetch = require("node-fetch"); // or native fetch in newer runtimes

exports.handler = async function(event, context) {
  const GH_PAT = process.env.GH_PAT;

  if (!GH_PAT) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "GitHub token not configured" }),
    };
  }

  try {
    // You can customize the API endpoint and method based on client request
    // For example, forward a GET request to GitHub API with query params

    const { path, queryStringParameters, httpMethod, body } = event;

    // Example: call GitHub API repos endpoint, or pass endpoint via query or body
    // Here we assume client sends a `path` query param like: /user/repos

    if (!queryStringParameters || !queryStringParameters.path) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'path' query parameter" }),
      };
    }

    const apiPath = queryStringParameters.path; // e.g., 'user/repos'
    const apiUrl = `https://api.github.com${apiPath.startsWith("/") ? apiPath : "/" + apiPath}`;

    const response = await fetch(apiUrl, {
      method: httpMethod || "GET",
      headers: {
        Authorization: `token ${GH_PAT}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: body ? body : null,
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
