async function queryAi(prompt) {
  const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer API-KEY`
    },
    body: JSON.stringify({
      model: 'gpt-oss-120b',
      messages: [{ role: 'user', content: `${prompt}` }]
    })
  });

  const data = await response.json();
  const message = data.choices[0].message.content;
  return message;
}

async function getPdfText(url) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.worker.min.mjs";
    let doc = await pdfjsLib.getDocument({url: url}).promise;
    let pageTexts = Array.from({length: doc.numPages}, async (v,i) => {
        return (await (await doc.getPage(i+1)).getTextContent()).items.map(token => token.str).join('');
    });
    return (await Promise.all(pageTexts)).join('');
}


export async function getResumeDetails(resumeId, jobId, resumeText) {
  const { data: { user } } = await supabaseClient.auth.getUser();

  const namePrompt = `This is the resume: ${resumeText}.  What is the name of the applicant? Reply with just the name or No Name if none was given.`;
  const summaryPrompt = `Give a short summary of this resume: ${resumeText}`;
  let scorePrompt = "";
  let insightPrompt = "";

  const { data, fetchError } = await supabaseClient
  .from('job')
  .select('description, skills, qualifications')
  .eq('id', jobId);

  if (fetchError) {
    window.error("Error on analyzing resume");
    return;
  } else {
    scorePrompt = `Based on this resume: ${resumeText}, and the following information: Job description ${data[0].description}; Skills required ${data[0].skills}; and Qualifications ${data[0].qualifications}; give the candidate ONE SCORE ONLY from 0-100 on how good of a fit they are for the job. reply with just the number`;
    insightPrompt = scorePrompt = `Based on this resume: ${resumeText}, and the following information: Job description ${data[0].description}; Skills required ${data[0].skills}; and Qualifications ${data[0].qualifications}; give some insights into the strengths and weaknesses of the candidate with respect to the job for the consideration of hiring managers.`;
  }

  const name = await queryAi(namePrompt);
  const score = await queryAi(scorePrompt);
  const summary = await queryAi(summaryPrompt);
  const insight = await queryAi(insightPrompt);  

  console.log(resumeText);
  console.log(name);
  console.log(score);
  console.log(summary);
  console.log(insight);

  return {name, score, summary, insight, user_id: user.id, resume_id: resumeId};
}

export async function insertInsight(d) {
  const data = await d;
  console.log(`currently at insertInsight v.2 data: ${data}`);
  console.log(data);
  const { insertError } = await supabaseClient
  .from('insight')
  .insert({resume_id: data.resume_id, name: data.name, summary: data.summary, score: data.score, insight: data.insight, user_id: data.user_id});

  if (insertError) {
    window.error("Error on inserting insights analysis");
  }
}

export async function analyze(url, resumeId, jobId) {
  let resumeText = await getPdfText(url);
  insertInsight(getResumeDetails(resumeId, jobId, resumeText));
}


