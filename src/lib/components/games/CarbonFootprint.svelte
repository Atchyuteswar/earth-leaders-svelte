<script lang="ts">
  import { fade } from 'svelte/transition';

  let currentStep = 0;
  let totalScore = 0;
  let answers: Record<string, number> = {};

  const questions = [
    {
      id: 'transport',
      title: 'Transportation',
      question: 'How do you usually travel to work/school?',
      options: [
        { text: 'Walk or Bike', score: 0 },
        { text: 'Public Transport', score: 2 },
        { text: 'Car (Hybrid/Electric)', score: 3 },
        { text: 'Car (Gasoline)', score: 5 }
      ]
    },
    {
      id: 'diet',
      title: 'Diet',
      question: 'What best describes your diet?',
      options: [
        { text: 'Vegan', score: 0 },
        { text: 'Vegetarian', score: 2 },
        { text: 'Occasional Meat', score: 4 },
        { text: 'Regular Meat', score: 6 }
      ]
    },
    {
      id: 'energy',
      title: 'Home Energy',
      question: 'What energy-saving measures do you use?',
      options: [
        { text: 'Solar Panels & Full LED', score: 0 },
        { text: 'LED Lights & Energy Star', score: 2 },
        { text: 'Some Energy Saving', score: 4 },
        { text: 'No Special Measures', score: 6 }
      ]
    }
  ];

  function selectAnswer(questionId: string, score: number) {
    answers[questionId] = score;
    if (currentStep < questions.length - 1) {
      currentStep++;
    } else {
      calculateScore();
    }
  }

  function calculateScore() {
    totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    currentStep = questions.length; // Move to results
  }

  function restart() {
    currentStep = 0;
    totalScore = 0;
    answers = {};
  }

  function getTips() {
    const tips = [];
    if (answers.transport > 2) {
      tips.push('Consider carpooling, using public transport, or switching to an electric vehicle');
    }
    if (answers.diet > 2) {
      tips.push('Try incorporating more plant-based meals into your diet');
    }
    if (answers.energy > 2) {
      tips.push('Install LED bulbs and consider solar panels for your home');
    }
    return tips;
  }
</script>

<div class="max-w-2xl mx-auto" in:fade>
  {#if currentStep < questions.length}
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div class="mb-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {questions[currentStep].title}
          </h2>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Question {currentStep + 1} of {questions.length}
          </span>
        </div>
        <p class="text-lg text-gray-700 dark:text-gray-300 mb-6">
          {questions[currentStep].question}
        </p>
      </div>

      <div class="space-y-3">
        {#each questions[currentStep].options as option}
          <button
            class="w-full p-4 text-left rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-colors"
            on:click={() => selectAnswer(questions[currentStep].id, option.score)}
          >
            <span class="text-gray-800 dark:text-gray-200">{option.text}</span>
          </button>
        {/each}
      </div>
    </div>
  {:else}
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center" in:fade>
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your Carbon Footprint Score</h2>
      
      <div class="mb-8">
        <div class="text-6xl font-bold mb-2" class:text-green-500={totalScore <= 6} class:text-yellow-500={totalScore > 6 && totalScore <= 12} class:text-red-500={totalScore > 12}>
          {totalScore}
        </div>
        <p class="text-gray-600 dark:text-gray-400">
          {#if totalScore <= 6}
            Excellent! Your carbon footprint is low.
          {:else if totalScore <= 12}
            Good effort! There's room for improvement.
          {:else}
            Consider making some changes to reduce your impact.
          {/if}
        </p>
      </div>

      <div class="mb-8">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Recommendations</h3>
        <ul class="text-left space-y-2">
          {#each getTips() as tip}
            <li class="flex items-start">
              <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-gray-700 dark:text-gray-300">{tip}</span>
            </li>
          {/each}
        </ul>
      </div>

      <button
        class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        on:click={restart}
      >
        Try Again
      </button>
    </div>
  {/if}
</div>
