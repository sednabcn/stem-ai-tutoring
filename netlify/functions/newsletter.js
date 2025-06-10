const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const params = new URLSearchParams(event.body);
  const email = params.get("email");

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Email is required" })
    };
  }

  const GH_PAT = process.env.GH_PAT;
  const owner = "sednabcn";           // Replace with your GitHub username
  const repo = "stem-ai-tutoring";                // Replace with your GitHub repo
  const path = "data/newsletter-emails.txt"; // Where to store emails
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  try {
    // 1. Get existing content
    const getRes = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${GH_PAT}`,
        Accept: "application/vnd.github.v3+json"
      }
    });

    const getData = await getRes.json();

    let content = "";
    let sha = null;

    if (getRes.ok) {
      content = Buffer.from(getData.content, "base64").toString("utf-8");
      sha = getData.sha;
    }

    // 2. Append new email with timestamp
    const timestamp = new Date().toISOString();
    const updatedContent = content + `${email}, ${timestamp}\n`;

    // 3. Commit updated content
    const commitRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${GH_PAT}`,
        Accept: "application/vnd.github.v3+json"
      },
      body: JSON.stringify({
        message: `Add email ${email}`,
        content: Buffer.from(updatedContent).toString("base64"),
        sha: sha
      })
    });

    if (!commitRes.ok) {
      throw new Error("GitHub commit failed");
    }

    return {
      statusCode: 200,
      body: "success"
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
