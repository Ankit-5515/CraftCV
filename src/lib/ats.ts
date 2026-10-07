import { ResumeData, ATSAnalysis, ATSFeedbackItem } from '@/types/resume';

const ACTION_VERBS = [
  'accelerated', 'achieved', 'administered', 'advised', 'analyzed', 'architected',
  'automated', 'boosted', 'built', 'championed', 'collaborated', 'composed',
  'conducted', 'configured', 'constructed', 'created', 'customized', 'decreased',
  'delivered', 'deployed', 'designed', 'developed', 'devised', 'directed',
  'eliminated', 'engineered', 'established', 'evaluated', 'executed', 'expanded',
  'facilitated', 'formulated', 'generated', 'governed', 'guided', 'halved',
  'headed', 'implemented', 'improved', 'increased', 'initiated', 'inspected',
  'installed', 'instituted', 'integrated', 'invented', 'launched', 'led',
  'maintained', 'managed', 'maximized', 'mentored', 'migrated', 'minimized',
  'mobilized', 'moderated', 'monitored', 'negotiated', 'optimized', 'orchestrated',
  'originated', 'outperformed', 'overhauled', 'oversaw', 'partnered', 'pioneered',
  'planned', 'produced', 'programmed', 'projected', 'promoted', 'published',
  'redesigned', 'reduced', 're-engineered', 'refactored', 'reformed', 'remodeled',
  'reorganized', 'resolved', 'restructured', 'revamped', 'revolutionized',
  'scaled', 'secured', 'simplified', 'spearheaded', 'standardized', 'steered',
  'streamlined', 'strengthened', 'structured', 'surpassed', 'synthesized',
  'trained', 'transformed', 'uncovered', 'unified', 'upgraded', 'validated',
];

const COMMON_TECH_KEYWORDS = [
  'react', 'next.js', 'typescript', 'javascript', 'python', 'java', 'c++', 'c#',
  'golang', 'go', 'rust', 'node.js', 'express', 'django', 'fastapi', 'spring',
  'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'git',
  'graphql', 'rest', 'api', 'microservices', 'distributed systems', 'kafka',
  'tailwind', 'html', 'css', 'redux', 'zustand', 'jest', 'playwright', 'cypress',
  'linux', 'agile', 'scrum', 'system design', 'cloud architecture', 'devops',
];

export function analyzeResumeATS(resume: ResumeData, jobDescription?: string): ATSAnalysis {
  const feedback: ATSFeedbackItem[] = [];
  const pInfo = resume.personalInfo;

  // 1. CONTACT INFO (Max 20)
  let contactScore = 0;
  if (pInfo.fullName?.trim()) {
    contactScore += 4;
  } else {
    feedback.push({
      id: 'fix-name',
      category: 'contact',
      severity: 'critical',
      title: 'Full Name is missing',
      description: 'ATS parsers require an identifiable candidate name at the top.',
      fixSuggestion: 'Enter your full legal name in the Personal Info section.',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (pInfo.email?.trim() && emailRegex.test(pInfo.email.trim())) {
    contactScore += 6;
  } else if (pInfo.email?.trim()) {
    contactScore += 3;
    feedback.push({
      id: 'fix-email-fmt',
      category: 'contact',
      severity: 'warning',
      title: 'Email format may be invalid',
      description: 'Ensure email has proper user@domain.com formatting.',
    });
  } else {
    feedback.push({
      id: 'fix-email',
      category: 'contact',
      severity: 'critical',
      title: 'Email address missing',
      description: 'Recruiters and ATS need a verified email to invite you to interviews.',
      fixSuggestion: 'Add your professional contact email.',
    });
  }

  if (pInfo.phone?.trim()) {
    contactScore += 4;
  } else {
    feedback.push({
      id: 'fix-phone',
      category: 'contact',
      severity: 'warning',
      title: 'Phone number missing',
      description: 'Providing a phone number helps recruiters contact you for phone screens.',
      fixSuggestion: 'Add a contact phone number with country/area code.',
    });
  }

  if (pInfo.location?.trim()) {
    contactScore += 3;
  } else {
    feedback.push({
      id: 'fix-location',
      category: 'contact',
      severity: 'warning',
      title: 'Location missing',
      description: 'ATS filters often sort candidates by region or remote readiness.',
      fixSuggestion: 'Add City, State/Country or "Remote".',
    });
  }

  if (pInfo.linkedin?.trim() || pInfo.github?.trim() || pInfo.website?.trim()) {
    contactScore += 3;
  } else {
    feedback.push({
      id: 'fix-links',
      category: 'contact',
      severity: 'warning',
      title: 'Online presence link missing',
      description: 'Include a LinkedIn profile, GitHub, or portfolio website link.',
    });
  }

  // 2. STANDARD SECTION HEADINGS (Max 20)
  let headingsScore = 0;
  if (resume.experience.length > 0 && resume.sectionVisibility.experience) {
    headingsScore += 6;
  } else {
    feedback.push({
      id: 'fix-experience',
      category: 'headings',
      severity: 'critical',
      title: 'No Work Experience listed',
      description: 'The Experience section is the #1 section recruiters and ATS parse.',
      fixSuggestion: 'Add at least one professional work experience or internship role.',
    });
  }

  if (resume.education.length > 0 && resume.sectionVisibility.education) {
    headingsScore += 5;
  } else {
    feedback.push({
      id: 'fix-education',
      category: 'headings',
      severity: 'warning',
      title: 'Education section missing',
      description: 'Degrees, certifications, or colleges are standard for role qualification.',
      fixSuggestion: 'Add your university degree, bootcamp, or highest qualification.',
    });
  }

  if (resume.skills.length > 0 && resume.sectionVisibility.skills) {
    const totalSkills = resume.skills.reduce((acc, cat) => acc + cat.skills.length, 0);
    if (totalSkills >= 5) {
      headingsScore += 5;
    } else {
      headingsScore += 3;
      feedback.push({
        id: 'fix-skills-count',
        category: 'headings',
        severity: 'warning',
        title: 'Few skills listed',
        description: 'Listing at least 6-10 core skills maximizes ATS keyword matching.',
      });
    }
  } else {
    feedback.push({
      id: 'fix-skills',
      category: 'headings',
      severity: 'critical',
      title: 'Skills section missing',
      description: 'An ATS scans for exact technical and core skills in your skills list.',
      fixSuggestion: 'Add categorized technical or professional skills.',
    });
  }

  if (
    (resume.projects.length > 0 && resume.sectionVisibility.projects) ||
    (resume.certifications.length > 0 && resume.sectionVisibility.certifications)
  ) {
    headingsScore += 4;
  }

  // 3. BULLET QUALITY & ACTION VERBS & METRICS (Max 20)
  let bulletsScore = 0;
  const actionVerbsFound = new Set<string>();
  let metricCount = 0;
  let totalBullets = 0;

  // Aggregate all bullet texts
  const allBulletTexts: string[] = [];
  resume.experience.forEach((exp) => {
    if (exp.description) allBulletTexts.push(exp.description);
    exp.highlights?.forEach((h) => allBulletTexts.push(h));
  });
  resume.projects.forEach((proj) => {
    if (proj.description) allBulletTexts.push(proj.description);
    proj.highlights?.forEach((h) => allBulletTexts.push(h));
  });

  totalBullets = allBulletTexts.length;

  const metricRegex = /(\d+[\d,.]*|\$\d+|\d+%\s*|\b\d+x\b|\b\d+\s*(?:k|m|ms|seconds|users|clients|percent|million|billion)\b)/gi;

  allBulletTexts.forEach((text) => {
    const words = text.toLowerCase().split(/[^a-zA-Z0-9_-]+/);
    words.forEach((w) => {
      if (ACTION_VERBS.includes(w)) {
        actionVerbsFound.add(w);
      }
    });

    const metrics = text.match(metricRegex);
    if (metrics) {
      metricCount += metrics.length;
    }
  });

  // Action verbs scoring (max 10)
  if (actionVerbsFound.size >= 6) {
    bulletsScore += 10;
  } else if (actionVerbsFound.size >= 3) {
    bulletsScore += 6;
  } else if (actionVerbsFound.size >= 1) {
    bulletsScore += 3;
    feedback.push({
      id: 'fix-action-verbs',
      category: 'content',
      severity: 'warning',
      title: 'Strengthen bullet points with action verbs',
      description: `Found only ${actionVerbsFound.size} distinct action verbs. Leading bullets with words like "Architected", "Engineered", "Reduced", or "Spearheaded" demonstrates ownership.`,
    });
  } else if (totalBullets > 0) {
    feedback.push({
      id: 'fix-no-action-verbs',
      category: 'content',
      severity: 'critical',
      title: 'No strong action verbs detected',
      description: 'Start each bullet with a powerful past-tense action verb (e.g. Spearheaded, Built, Optimized).',
    });
  }

  // Quantifiable metrics scoring (max 10)
  if (metricCount >= 4) {
    bulletsScore += 10;
  } else if (metricCount >= 2) {
    bulletsScore += 6;
    feedback.push({
      id: 'fix-metrics-few',
      category: 'content',
      severity: 'warning',
      title: 'Add more quantifiable metrics',
      description: 'Quantify your accomplishments (e.g., "improved latency by 35%", "scaled to 50k users").',
    });
  } else {
    bulletsScore += 2;
    feedback.push({
      id: 'fix-metrics-none',
      category: 'content',
      severity: 'critical',
      title: 'Lack of measurable results (numbers, percentages)',
      description: 'Hiring managers look for proof of impact. Use percentages (%), dollar amounts ($), or concrete user metrics.',
      fixSuggestion: 'Rewrite 2-3 bullets using the formula: [Action Verb] + [Task] + [Measurable Result %/Number].',
    });
  }

  // 4. SUMMARY IMPACT (Max 15)
  let summaryScore = 0;
  const summaryText = pInfo.summary?.trim() || '';
  const summaryWords = summaryText ? summaryText.split(/\s+/).length : 0;

  if (summaryWords >= 30 && summaryWords <= 120) {
    summaryScore += 15;
  } else if (summaryWords > 120) {
    summaryScore += 9;
    feedback.push({
      id: 'fix-summary-long',
      category: 'content',
      severity: 'warning',
      title: 'Professional summary is slightly long',
      description: `Current summary has ${summaryWords} words. Ideal length is 30–90 words (3-4 crisp sentences).`,
    });
  } else if (summaryWords > 0) {
    summaryScore += 7;
    feedback.push({
      id: 'fix-summary-short',
      category: 'content',
      severity: 'warning',
      title: 'Professional summary is too brief',
      description: 'Expand your summary into 2-3 sentences highlighting your core expertise and value proposition.',
    });
  } else {
    feedback.push({
      id: 'fix-summary-empty',
      category: 'content',
      severity: 'warning',
      title: 'No Professional Summary',
      description: 'A 2-3 sentence executive summary quickly hooks the recruiter before reading experience.',
    });
  }

  // 5. FORMATTING & LENGTH SAFETY (Max 15)
  let formattingScore = 15;
  const fullText = JSON.stringify(resume);
  const totalWords = fullText.split(/\s+/).length;
  const estimatedPages = totalWords < 550 ? 1 : totalWords < 1100 ? 2 : 3;

  if (estimatedPages > 2) {
    formattingScore -= 5;
    feedback.push({
      id: 'fix-pages',
      category: 'formatting',
      severity: 'warning',
      title: 'Resume may exceed 2 pages',
      description: 'Unless you have 15+ years experience, keep the resume to 1 or 2 tight pages for maximum ATS compatibility.',
    });
  }

  // 6. JOB DESCRIPTION KEYWORD MATCH (Max 10)
  let keywordMatchScore = 10;
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  if (jobDescription && jobDescription.trim().length > 20) {
    const jdClean = jobDescription.toLowerCase();
    const resumeTextLower = JSON.stringify(resume).toLowerCase();

    // Extract potential tech and industry terms from JD or compare with common dictionary
    const extractedKeywords = new Set<string>();
    COMMON_TECH_KEYWORDS.forEach((kw) => {
      if (jdClean.includes(kw)) {
        extractedKeywords.add(kw);
      }
    });

    // Also pick significant words in JD
    const jdWords = jdClean.match(/\b[a-z]{3,18}\b/g) || [];
    const wordFreq: Record<string, number> = {};
    const stopWords = new Set([
      'the', 'and', 'for', 'with', 'you', 'our', 'that', 'this', 'will', 'are', 'your',
      'work', 'team', 'years', 'experience', 'ability', 'skills', 'role', 'company',
      'must', 'have', 'from', 'each', 'into', 'such', 'their', 'about', 'join',
    ]);

    jdWords.forEach((w) => {
      if (!stopWords.has(w) && w.length >= 4) {
        wordFreq[w] = (wordFreq[w] || 0) + 1;
      }
    });

    // Top frequent meaningful words
    Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .forEach(([w]) => extractedKeywords.add(w));

    extractedKeywords.forEach((kw) => {
      if (resumeTextLower.includes(kw)) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    });

    const totalExtracted = extractedKeywords.size;
    if (totalExtracted > 0) {
      const matchRatio = matchedKeywords.length / totalExtracted;
      keywordMatchScore = Math.round(matchRatio * 10);

      if (matchRatio < 0.5 && missingKeywords.length > 0) {
        feedback.push({
          id: 'fix-keywords',
          category: 'keywords',
          severity: 'warning',
          title: `${missingKeywords.length} target job keywords missing`,
          description: `Add missing keywords found in the job description: ${missingKeywords.slice(0, 6).join(', ')}.`,
          fixSuggestion: 'Integrate these terms into your Skills, Summary, or Experience bullets.',
        });
      }
    }
  }

  // Calculate Overall Score
  const overallScore = Math.min(
    100,
    Math.max(
      0,
      contactScore + headingsScore + bulletsScore + summaryScore + formattingScore + keywordMatchScore
    )
  );

  return {
    overallScore,
    categoryScores: {
      contact: contactScore,
      headings: headingsScore,
      bullets: bulletsScore,
      summary: summaryScore,
      formatting: formattingScore,
      keywordMatch: keywordMatchScore,
    },
    feedback,
    matchedKeywords,
    missingKeywords,
    actionVerbsFound: Array.from(actionVerbsFound),
    quantifiableMetricsCount: metricCount,
    totalWords,
    estimatedPages,
  };
}
