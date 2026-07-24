import type { AIReport } from "../report/types";
import type { ExportFormat } from "./types";

export const htmlExporter: ExportFormat = {
  name: "HTML",

  extension: "html",

  mimeType: "text/html",

  generate(report: AIReport) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${report.title}</title>

<style>
body{
    font-family:Arial,Helvetica,sans-serif;
    max-width:900px;
    margin:40px auto;
    padding:20px;
    color:#333;
    line-height:1.6;
}

h1{
    color:#2563eb;
    border-bottom:2px solid #2563eb;
    padding-bottom:10px;
}

section{
    margin-top:30px;
}

.card{
    background:#f8fafc;
    border-radius:10px;
    padding:18px;
    margin-top:10px;
    border:1px solid #e5e7eb;
}
</style>

</head>

<body>

<h1>${report.title}</h1>

<p><strong>Generated:</strong> ${report.generatedAt}</p>

<section>
<h2>Executive Summary</h2>
<div class="card">${report.executiveSummary}</div>
</section>

<section>
<h2>Dataset Health</h2>
<div class="card">${report.datasetHealth}</div>
</section>

<section>
<h2>Feature Engineering</h2>
<div class="card">${report.featureEngineering}</div>
</section>

<section>
<h2>Model Recommendations</h2>
<div class="card">${report.modelRecommendations}</div>
</section>

<section>
<h2>Conclusion</h2>
<div class="card">${report.conclusion}</div>
</section>

</body>
</html>`;
  },
};