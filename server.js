const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Stone Code server is running");
});

const languageMap = {
  python: 71,
  javascript: 63,
  java: 62,
  cpp: 54,
  c: 50,
  csharp: 51,
  php: 68,
  ruby: 72,
  go: 60,
  rust: 73,
  kotlin: 78,
  swift: 83
};

app.post("/run", async (req, res) => {
  const { language, code } = req.body;

  const languageId = languageMap[language];

  if (!languageId) {
    return res.json({
      error: "This language is not supported yet."
    });
  }

  try {
    const response = await fetch(
      "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          source_code: code,
          language_id: languageId,
          stdin: ""
        })
      }
    );

    const result = await response.json();

    res.json({
      output:
        result.stdout ||
        result.stderr ||
        result.compile_output ||
        result.message ||
        "Done."
    });
  } catch (error) {
    res.json({
      error: "Code execution failed."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`CodeRun server running on port ${PORT}`);
});
