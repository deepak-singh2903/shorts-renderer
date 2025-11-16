const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const SECRET = process.env.RENDER_SECRET;

// TEMP JOB STORAGE (real system uses database)
let jobs = {};

app.post("/jobs", (req, res) => {
  const incomingSecret = req.headers["x-render-secret"];
  if (incomingSecret !== SECRET)
    return res.status(401).json({ error: "Unauthorized" });

  const jobId = "job_" + Date.now();
  jobs[jobId] = {
    id: jobId,
    status: "queued",
    topic: req.body.topic,
    script: req.body.script,
    shot_list: req.body.shot_list,
    assets: req.body.assets,
    output: req.body.output,
    video_url: ""
  };

  console.log("NEW JOB RECEIVED:", jobId);

  // TEMP: immediately return job_id (actual rendering comes in Step 5)
  res.json({ job_id: jobId });
});

app.get("/jobs/:id", (req, res) => {
  const job = jobs[req.params.id];
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Renderer running on port", PORT));
