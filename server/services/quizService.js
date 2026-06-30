class QuizService {
  constructor() {
    // Enhanced, AI-ready quiz bank (28 questions).
    // Each option contributes weighted scores to one or more streams.
    this.questions = [
      // Interests
      {
        id: 1,
        category: 'Interests',
        question: "What kind of tasks do you naturally enjoy the most?",
        options: [
          { text: "Figuring out how things work (logic, systems, experiments)", weights: { science: 3, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Planning, budgeting, or finding smart ways to earn/save money", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Creating something new (design, writing, music, ideas)", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Fixing/building things with your hands (practical, real-world)", weights: { science: 1, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 2,
        category: 'Interests',
        question: "Which school activity would you happily do even without marks?",
        options: [
          { text: "Lab work, coding, robotics, or science projects", weights: { science: 3, commerce: 0, arts: 0, vocational: 1 } },
          { text: "Business fairs, selling products, or managing event budgets", weights: { science: 0, commerce: 3, arts: 0, vocational: 1 } },
          { text: "Drama, debates, creative writing, or media work", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Workshops like electrical, carpentry, cooking, or repair tasks", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 3,
        category: 'Interests',
        question: "If you had a free weekend, what would you pick?",
        options: [
          { text: "Watch documentaries or try a science/tech DIY project", weights: { science: 3, commerce: 0, arts: 0, vocational: 1 } },
          { text: "Follow business/news trends or learn investing basics", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Create content (art, writing, photography, video)", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Learn a hands-on skill (tools, cooking, styling, repairs)", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 4,
        category: 'Interests',
        question: "What type of problems feel most satisfying to solve?",
        options: [
          { text: "Complex puzzles that need logic and step-by-step reasoning", weights: { science: 3, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Real-life money or business problems with trade-offs", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Human stories, emotions, or social issues", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Practical problems where you can quickly see results", weights: { science: 1, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 5,
        category: 'Interests',
        question: "Which of these feels like 'your zone'?",
        options: [
          { text: "Technology, coding, machines, or medicine", weights: { science: 3, commerce: 0, arts: 0, vocational: 1 } },
          { text: "Business, marketing, finance, or management", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Psychology, languages, history, media, or design", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Skilled trades and applied work (IT support, electrician, chef)", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },

      // Strengths
      {
        id: 6,
        category: 'Strengths',
        question: "When studying, what comes easiest to you?",
        options: [
          { text: "Math, formulas, and logical steps", weights: { science: 3, commerce: 1, arts: 0, vocational: 0 } },
          { text: "Numbers + real-life application (accounts, budgets)", weights: { science: 1, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Remembering concepts, stories, and expressing ideas", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Learning by doing (practice, tools, repetition)", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 7,
        category: 'Strengths',
        question: "People usually praise you for…",
        options: [
          { text: "Your logic, accuracy, and problem-solving", weights: { science: 3, commerce: 1, arts: 0, vocational: 0 } },
          { text: "Your planning, organizing, and decision-making", weights: { science: 0, commerce: 3, arts: 0, vocational: 1 } },
          { text: "Your creativity and ability to express ideas", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Your practical skills and ability to fix things quickly", weights: { science: 1, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 8,
        category: 'Strengths',
        question: "How do you handle a challenging topic?",
        options: [
          { text: "Break it down and test it until it makes sense", weights: { science: 3, commerce: 0, arts: 0, vocational: 1 } },
          { text: "Find a strategy and focus on what gives best results", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Relate it to real examples and communicate it in your own words", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Practice it repeatedly until it becomes a skill", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 9,
        category: 'Strengths',
        question: "Which tool would you rather use for a school project?",
        options: [
          { text: "Spreadsheet for data + graphs (science stats, analysis)", weights: { science: 3, commerce: 1, arts: 0, vocational: 0 } },
          { text: "Spreadsheet for budgeting + business planning", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Slides/storyboard for presenting ideas creatively", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "A prototype or model you can build and demonstrate", weights: { science: 1, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 10,
        category: 'Strengths',
        question: "If a friend asks for help, you’re most likely to…",
        options: [
          { text: "Explain the logic step-by-step until they get it", weights: { science: 3, commerce: 0, arts: 1, vocational: 0 } },
          { text: "Make a plan/checklist so they can finish efficiently", weights: { science: 0, commerce: 3, arts: 0, vocational: 1 } },
          { text: "Motivate them and help them express their thoughts clearly", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Show them practically how to do it (demo + practice)", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },

      // Personality
      {
        id: 11,
        category: 'Personality',
        question: "In a group project, you usually become the…",
        options: [
          { text: "Problem-solver who handles tough technical parts", weights: { science: 3, commerce: 1, arts: 0, vocational: 0 } },
          { text: "Leader who divides work and keeps everyone on track", weights: { science: 0, commerce: 3, arts: 0, vocational: 1 } },
          { text: "Presenter/creative mind who makes it interesting", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Doer who builds/executes and gets it finished", weights: { science: 1, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 12,
        category: 'Personality',
        question: "How do you feel about taking risks?",
        options: [
          { text: "I take calculated risks if the logic checks out", weights: { science: 3, commerce: 1, arts: 0, vocational: 0 } },
          { text: "I’m comfortable taking business risks for rewards", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "I take creative risks to try new ideas", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "I prefer safe, skill-based growth where I can practice and improve", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 13,
        category: 'Personality',
        question: "What energizes you more?",
        options: [
          { text: "Learning something complex and mastering it", weights: { science: 3, commerce: 0, arts: 0, vocational: 1 } },
          { text: "Achieving goals and seeing measurable progress", weights: { science: 0, commerce: 3, arts: 0, vocational: 1 } },
          { text: "Expressing yourself and connecting with people through ideas", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Building something useful that others can immediately use", weights: { science: 1, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 14,
        category: 'Personality',
        question: "When you disagree with someone, you usually…",
        options: [
          { text: "Use facts/logic to explain your point", weights: { science: 3, commerce: 1, arts: 0, vocational: 0 } },
          { text: "Negotiate and find a win-win outcome", weights: { science: 0, commerce: 3, arts: 1, vocational: 0 } },
          { text: "Try to understand their feelings and perspective", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Prefer to show results through action rather than debate", weights: { science: 1, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 15,
        category: 'Personality',
        question: "Which describes you best?",
        options: [
          { text: "Curious and detail-focused", weights: { science: 3, commerce: 1, arts: 0, vocational: 0 } },
          { text: "Ambitious and goal-oriented", weights: { science: 0, commerce: 3, arts: 0, vocational: 1 } },
          { text: "Imaginative and expressive", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Practical and action-oriented", weights: { science: 1, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },

      // Work Style
      {
        id: 16,
        category: 'Work Style',
        question: "Which work style feels most comfortable?",
        options: [
          { text: "Structured problem-solving with clear methods", weights: { science: 3, commerce: 1, arts: 0, vocational: 0 } },
          { text: "Fast-paced, target-driven work", weights: { science: 0, commerce: 3, arts: 0, vocational: 1 } },
          { text: "Flexible work where creativity matters", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Hands-on work where skills matter more than theory", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 17,
        category: 'Work Style',
        question: "Where do you see yourself working most happily?",
        options: [
          { text: "Lab/tech environment (research, hospital, engineering)", weights: { science: 3, commerce: 0, arts: 0, vocational: 1 } },
          { text: "Office/corporate environment (finance, management, sales)", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Creative environment (studio, media, writing, design)", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Workshop/field work (on-site, service, skilled trades)", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 18,
        category: 'Work Style',
        question: "How do you prefer to learn something new?",
        options: [
          { text: "Understand the theory and then practice", weights: { science: 3, commerce: 1, arts: 0, vocational: 0 } },
          { text: "Learn by examples and optimize for results", weights: { science: 0, commerce: 3, arts: 0, vocational: 1 } },
          { text: "Learn through stories, videos, and creative exploration", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Jump in and learn by doing with guidance", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 19,
        category: 'Work Style',
        question: "Which type of task would you choose first at work?",
        options: [
          { text: "Analyze data and find patterns", weights: { science: 3, commerce: 1, arts: 0, vocational: 0 } },
          { text: "Plan timelines, budgets, and resources", weights: { science: 0, commerce: 3, arts: 0, vocational: 1 } },
          { text: "Create content/design that people enjoy", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Repair, build, or operate equipment", weights: { science: 1, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 20,
        category: 'Work Style',
        question: "Which describes your ideal day?",
        options: [
          { text: "Focused deep work on a tough problem", weights: { science: 3, commerce: 0, arts: 0, vocational: 1 } },
          { text: "Meetings + decisions + moving projects forward", weights: { science: 0, commerce: 3, arts: 0, vocational: 1 } },
          { text: "Brainstorming and creating something meaningful", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Active hands-on work with visible outcomes", weights: { science: 1, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },

      // Career Motivation
      {
        id: 21,
        category: 'Career Motivation',
        question: "What matters most to you in a future career?",
        options: [
          { text: "Solving important problems and building expertise", weights: { science: 3, commerce: 1, arts: 0, vocational: 0 } },
          { text: "Good income and growth opportunities", weights: { science: 0, commerce: 3, arts: 0, vocational: 1 } },
          { text: "Doing something you truly enjoy and feel proud of", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Stability through strong practical skills", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 22,
        category: 'Career Motivation',
        question: "How do you define success?",
        options: [
          { text: "Being respected for knowledge/skill in a technical field", weights: { science: 3, commerce: 0, arts: 0, vocational: 1 } },
          { text: "Achieving financial independence and leadership", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Making an impact through ideas, creativity, or helping people", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Being great at a skill that people rely on every day", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 23,
        category: 'Career Motivation',
        question: "What kind of future feels most exciting?",
        options: [
          { text: "Working on tech/health innovations", weights: { science: 3, commerce: 0, arts: 0, vocational: 1 } },
          { text: "Running a business or leading teams", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Creating stories, designs, or changing opinions", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Mastering a trade and becoming highly skilled quickly", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 24,
        category: 'Career Motivation',
        question: "Which statement sounds most like you?",
        options: [
          { text: "I enjoy learning deeply and I’m okay with long study time", weights: { science: 3, commerce: 0, arts: 0, vocational: 1 } },
          { text: "I like practical goals and seeing fast progress in career", weights: { science: 0, commerce: 2, arts: 0, vocational: 2 } },
          { text: "I want a career where I can express who I am", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "I prefer skill-based learning and earning sooner", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 25,
        category: 'Career Motivation',
        question: "What kind of impact do you want to have?",
        options: [
          { text: "Solve real problems using science/technology", weights: { science: 3, commerce: 0, arts: 0, vocational: 1 } },
          { text: "Create jobs/wealth and improve businesses", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Inspire, educate, or influence society through ideas", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Provide skilled services people need daily", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },

      // Blend/validation questions (helps reduce ties)
      {
        id: 26,
        category: 'Personality',
        question: "Which feedback would you like to hear most?",
        options: [
          { text: "\"You think clearly and solve tough problems.\"", weights: { science: 3, commerce: 1, arts: 0, vocational: 0 } },
          { text: "\"You make smart decisions and lead confidently.\"", weights: { science: 0, commerce: 3, arts: 0, vocational: 1 } },
          { text: "\"Your ideas and creativity stand out.\"", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "\"You’re skilled and dependable in practical work.\"", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 27,
        category: 'Work Style',
        question: "If you had to choose one, you’d prefer a career that is…",
        options: [
          { text: "Research/innovation focused", weights: { science: 3, commerce: 0, arts: 0, vocational: 1 } },
          { text: "Business/strategy focused", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "People/communication focused", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Skill/trade focused", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 28,
        category: 'Strengths',
        question: "Which feels most 'natural' for you under pressure?",
        options: [
          { text: "Stay calm and solve it logically", weights: { science: 3, commerce: 1, arts: 0, vocational: 0 } },
          { text: "Prioritize tasks and manage the situation", weights: { science: 0, commerce: 3, arts: 0, vocational: 1 } },
          { text: "Communicate, explain, and keep everyone aligned", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Take action and fix what’s needed immediately", weights: { science: 1, commerce: 0, arts: 0, vocational: 3 } }
        ]
      }
    ];
  }

  getQuestions() {
    return this.questions;
  }

  calculateScores(answers) {
    const initialScores = {
      science: 0,
      commerce: 0,
      arts: 0,
      vocational: 0
    };

    // Calculate raw scores
    answers.forEach(answer => {
      const question = this.questions.find(q => q.id === answer.question_id);
      if (question && answer.selected_option_index < question.options.length) {
        const selectedOption = question.options[answer.selected_option_index];
        initialScores.science += selectedOption.weights.science;
        initialScores.commerce += selectedOption.weights.commerce;
        initialScores.arts += selectedOption.weights.arts;
        initialScores.vocational += selectedOption.weights.vocational;
      }
    });

    // Normalize scores to 0-100 scale
    const totalScore = initialScores.science + initialScores.commerce + initialScores.arts + initialScores.vocational;
    
    if (totalScore === 0) {
      return {
        science: 25,
        commerce: 25,
        arts: 25,
        vocational: 25
      };
    }

    const normalizedScores = {
      science: Math.round((initialScores.science / totalScore) * 100),
      commerce: Math.round((initialScores.commerce / totalScore) * 100),
      arts: Math.round((initialScores.arts / totalScore) * 100),
      vocational: Math.round((initialScores.vocational / totalScore) * 100)
    };

    // Ensure total is 100
    const normalizedTotal = normalizedScores.science + normalizedScores.commerce + normalizedScores.arts + normalizedScores.vocational;
    if (normalizedTotal !== 100) {
      const diff = 100 - normalizedTotal;
      const maxScoreDomain = Object.keys(normalizedScores).reduce((a, b) => 
        normalizedScores[a] > normalizedScores[b] ? a : b
      );
      normalizedScores[maxScoreDomain] += diff;
    }

    return normalizedScores;
  }

  determineDominantDomain(scores) {
    const maxScore = Math.max(scores.science, scores.commerce, scores.arts, scores.vocational);
    
    if (maxScore === scores.science) {
      return 'Science';
    } else if (maxScore === scores.commerce) {
      return 'Commerce';
    } else if (maxScore === scores.vocational) {
      return 'Vocational';
    } else {
      return 'Arts';
    }
  }

  validateAnswers(answers) {
    const errors = [];
    
    if (!Array.isArray(answers)) {
      errors.push('Answers must be an array');
      return errors;
    }

    if (answers.length !== this.questions.length) {
      errors.push(`Must answer all ${this.questions.length} questions`);
    }

    answers.forEach((answer, index) => {
      if (!answer.question_id || !Number.isInteger(answer.question_id)) {
        errors.push(`Invalid question_id at index ${index}`);
      }
      
      if (!Number.isInteger(answer.selected_option_index)) {
        errors.push(`Invalid selected_option_index at index ${index}`);
      }
      
      const question = this.questions.find(q => q.id === answer.question_id);
      if (question) {
        if (answer.selected_option_index < 0 || answer.selected_option_index >= question.options.length) {
          errors.push(`Invalid option selection for question ${answer.question_id}`);
        }
      } else {
        errors.push(`Question ${answer.question_id} not found`);
      }
    });

    return errors;
  }

  getStreamRanking(scores) {
    return Object.entries(scores)
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => b.value - a.value);
  }

  toStreamLabel(streamKey) {
    const map = { science: 'Science', commerce: 'Commerce', arts: 'Arts', vocational: 'Vocational' };
    return map[streamKey] || streamKey;
  }

  getCareerMappingForStream(streamLabel) {
    const mapping = {
      Science: {
        courses: ['B.Sc', 'Engineering', 'MBBS', 'Data Science', 'Biotechnology'],
        careers: ['Software Engineer', 'Doctor/Healthcare Professional', 'Data Analyst/Data Scientist']
      },
      Commerce: {
        courses: ['B.Com', 'BBA', 'CA', 'Finance', 'Banking'],
        careers: ['Chartered Accountant', 'Financial Analyst', 'Business Manager']
      },
      Arts: {
        courses: ['B.A', 'Psychology', 'Journalism', 'Civil Services', 'Design'],
        careers: ['Psychologist/Counsellor', 'Journalist/Content Creator', 'Civil Services Aspirant']
      },
      Vocational: {
        courses: ['Diploma Courses', 'ITI', 'Skill-based Certifications', 'Apprenticeships', 'Technical Training'],
        careers: ['Electrician/Technician', 'IT Support Specialist', 'Chef/Hospitality Professional']
      }
    };
    return mapping[streamLabel] || { courses: [], careers: [] };
  }

  buildDynamicExplanation({ primary, secondary, scores, profile }) {
    const ranked = this.getStreamRanking(scores);
    const top = ranked[0];
    const second = ranked[1];

    const lines = [];
    const name = profile?.name ? profile.name.split(' ')[0] : null;

    const opening = name
      ? `Based on your answers, ${name}, you seem to have a clear pattern in what you enjoy and what feels natural to you.`
      : `Based on your answers, you seem to have a clear pattern in what you enjoy and what feels natural to you.`;
    lines.push(opening);

    lines.push(
      `Your strongest match is **${primary}** (${top.value}%), with **${secondary}** (${second.value}%) as a close second.`
    );

    const patternBits = [];
    if (primary === 'Science') patternBits.push('analytical thinking', 'curiosity for how things work', 'comfort with structured problem-solving');
    if (primary === 'Commerce') patternBits.push('planning and decision-making', 'goal focus', 'interest in money/business outcomes');
    if (primary === 'Arts') patternBits.push('creative expression', 'interest in people and ideas', 'strong communication style');
    if (primary === 'Vocational') patternBits.push('hands-on learning', 'practical execution', 'preference for skill-based progress');

    if (patternBits.length) {
      lines.push(`What stood out: you leaned towards ${patternBits.slice(0, 2).join(' and ')} — that’s a strong fit for ${primary}-aligned paths.`);
    }

    if (secondary && secondary !== primary) {
      lines.push(
        `The reason ${secondary} also shows up is because some of your choices support that style too. A combination of ${primary} + ${secondary} can be a smart, flexible direction.`
      );
    }

    // Light personalization using profile signals (non-breaking, optional)
    if (profile?.declared_interest && profile.declared_interest !== primary) {
      lines.push(
        `Also, your declared interest is **${profile.declared_interest}** — that can be a helpful tie-breaker when choosing specific courses within your top streams.`
      );
    }

    if (profile?.personal_details?.city || profile?.personal_details?.state) {
      const loc = [profile.personal_details.city, profile.personal_details.state].filter(Boolean).join(', ');
      lines.push(`If you want, we can also tailor your next steps to options available around **${loc}**.`);
    }

    return lines.join(' ');
  }

  personalizeScores(scores, profile) {
    const adjusted = { ...scores };
    const declared = profile?.declared_interest;

    // Small bias towards declared interest (keeps quiz dominant signal).
    const bias = 4;
    if (declared === 'Science') adjusted.science += bias;
    if (declared === 'Commerce') adjusted.commerce += bias;
    if (declared === 'Arts') adjusted.arts += bias;
    if (declared === 'Vocational') adjusted.vocational += bias;

    // Blend in previous quiz result if it exists (stability over time).
    if (profile?.aptitude_scores) {
      const prev = profile.aptitude_scores;
      const alpha = 0.25; // 25% prior, 75% current
      adjusted.science = Math.round((1 - alpha) * adjusted.science + alpha * (prev.science || 0));
      adjusted.commerce = Math.round((1 - alpha) * adjusted.commerce + alpha * (prev.commerce || 0));
      adjusted.arts = Math.round((1 - alpha) * adjusted.arts + alpha * (prev.arts || 0));
      adjusted.vocational = Math.round((1 - alpha) * adjusted.vocational + alpha * (prev.vocational || 0));
    }

    // Renormalize to 100
    const total = adjusted.science + adjusted.commerce + adjusted.arts + adjusted.vocational;
    if (total <= 0) return { science: 25, commerce: 25, arts: 25, vocational: 25 };

    const norm = {
      science: Math.round((adjusted.science / total) * 100),
      commerce: Math.round((adjusted.commerce / total) * 100),
      arts: Math.round((adjusted.arts / total) * 100),
      vocational: Math.round((adjusted.vocational / total) * 100)
    };
    const normTotal = norm.science + norm.commerce + norm.arts + norm.vocational;
    if (normTotal !== 100) {
      const diff = 100 - normTotal;
      const maxKey = Object.keys(norm).reduce((a, b) => (norm[a] > norm[b] ? a : b));
      norm[maxKey] += diff;
    }
    return norm;
  }

  generateCareerGuidance(scores, profile) {
    const personalizedScores = this.personalizeScores(scores, profile);
    const ranked = this.getStreamRanking(personalizedScores);

    const primaryKey = ranked[0]?.key || 'science';
    const secondaryKey = ranked[1]?.key || 'commerce';
    const primary = this.toStreamLabel(primaryKey);
    const secondary = this.toStreamLabel(secondaryKey);

    const primaryMap = this.getCareerMappingForStream(primary);
    const secondaryMap = this.getCareerMappingForStream(secondary);

    const courses = Array.from(new Set([...primaryMap.courses, ...secondaryMap.courses])).slice(0, 5);
    const careers = Array.from(new Set([...primaryMap.careers, ...secondaryMap.careers])).slice(0, 3);

    const explanation = this.buildDynamicExplanation({
      primary,
      secondary,
      scores: personalizedScores,
      profile
    });

    return {
      streams: [primary, secondary],
      courses,
      careers,
      explanation,
      scores: personalizedScores
    };
  }

  generateAptitudeReport(scores, dominantDomain) {
    return {
      scores,
      dominant_domain: dominantDomain,
      strengths: this.getStrengths(scores),
      recommendations: this.getGeneralRecommendations(dominantDomain),
      confidence_level: this.calculateConfidenceLevel(scores)
    };
  }

  getStrengths(scores) {
    const strengths = [];
    Object.entries(scores).forEach(([domain, score]) => {
      if (score >= 40) {
        strengths.push(`${domain}: Strong aptitude (${score}%)`);
      } else if (score >= 25) {
        strengths.push(`${domain}: Moderate aptitude (${score}%)`);
      }
    });
    return strengths;
  }

  getGeneralRecommendations(dominantDomain) {
    const recommendations = {
      Science: "Consider careers in engineering, medicine, research, data science, or technology",
      Commerce: "Consider careers in business management, finance, accounting, marketing, or entrepreneurship",
      Arts: "Consider careers in design, literature, performing arts, education, or social sciences",
      Vocational: "Consider skill-based careers through diplomas/ITI, technical training, apprenticeships, and hands-on roles"
    };
    return recommendations[dominantDomain] || "Explore various fields to find your best fit";
  }

  calculateConfidenceLevel(scores) {
    const values = Object.values(scores).sort((a, b) => b - a);
    const maxScore = values[0];
    const secondMaxScore = values[1];
    
    const difference = maxScore - secondMaxScore;
    
    if (difference >= 20) return 'High';
    if (difference >= 10) return 'Medium';
    return 'Low';
  }
}

module.exports = new QuizService();
