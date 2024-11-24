<script lang="ts">
  import { fade } from 'svelte/transition';

  let currentQuestion = 0;
  let score = 0;
  let showResult = false;
  let selectedAnswer: number | null = null;

  const questions = [
    {
      question: "What percentage of the world's chocolate comes from West Africa?",
      options: ['30%', '50%', '70%', '90%'],
      correct: 2,
      explanation: "About 70% of the world's cocoa comes from West Africa, with Côte d'Ivoire and Ghana being the largest producers."
    },
    {
      question: 'How many years does it take for a cocoa tree to produce its first pods?',
      options: ['1-2 years', '3-5 years', '7-10 years', '12-15 years'],
      correct: 1,
      explanation: 'Cocoa trees take 3-5 years to produce their first pods, making sustainable farming crucial.'
    },
    {
      question: 'Which of these is NOT a major environmental impact of cocoa production?',
      options: ['Deforestation', 'Water pollution', 'Air pollution', 'Soil degradation'],
      correct: 2,
      explanation: 'While cocoa production can cause deforestation, water pollution, and soil degradation, it has minimal direct impact on air pollution.'
    },
    {
      question: 'What percentage of cocoa farmers live below the poverty line?',
      options: ['20%', '40%', '60%', '80%'],
      correct: 3,
      explanation: 'Approximately 80% of cocoa farmers live below the poverty line, highlighting the need for fair trade practices.'
    },
    {
      question: 'Which certification ensures sustainable chocolate production?',
      options: ['FDA Approved', 'Rainforest Alliance', 'ISO 9001', 'CE Mark'],
      correct: 1,
      explanation: 'Rainforest Alliance certification ensures environmental, social, and economic sustainability in chocolate production.'
    }
  ];

  function checkAnswer(selected: number) {
    selectedAnswer = selected;
    if (selected === questions[currentQuestion].correct) {
      score++;
    }
  }

  function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      selectedAnswer = null;
    } else {
      showResult = true;
    }
  }

  function restart() {
    currentQuestion = 0;
    score = 0;
    showResult = false;
    selectedAnswer = null;
  }
</script>

<div class="max-w-2xl mx-auto" in:fade>
  {#if !showResult}
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Chocolate Impact Quiz</h2>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <p class="text-lg text-gray-700 dark:text-gray-300">
          {questions[currentQuestion].question}
        </p>
      </div>

      <div class="space-y-3 mb-6">
        {#each questions[currentQuestion].options as option, index}
          <button
            class="w-full p-4 text-left rounded-lg border-2 transition-colors"
            class:border-gray-200={selectedAnswer === null}
            class:dark:border-gray-700={selectedAnswer === null}
            class:border-green-500={selectedAnswer !== null && index === questions[currentQuestion].correct}
            class:border-red-500={selectedAnswer === index && index !== questions[currentQuestion].correct}
            class:bg-green-50={selectedAnswer !== null && index === questions[currentQuestion].correct}
            class:bg-red-50={selectedAnswer === index && index !== questions[currentQuestion].correct}
            on:click={() => selectedAnswer === null && checkAnswer(index)}
            disabled={selectedAnswer !== null}
          >
            <span class="text-gray-800 dark:text-gray-200">{option}</span>
          </button>
        {/each}
      </div>

      {#if selectedAnswer !== null}
        <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <p class="text-blue-800 dark:text-blue-200">
            {questions[currentQuestion].explanation}
          </p>
        </div>

        <button
          class="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          on:click={nextQuestion}
        >
          {currentQuestion === questions.length - 1 ? 'See Results' : 'Next Question'}
        </button>
      {/if}
    </div>
  {:else}
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center" in:fade>
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Quiz Complete!</h2>
      
      <div class="mb-8">
        <div class="text-6xl font-bold mb-2" 
          class:text-green-500={score >= 4}
          class:text-yellow-500={score === 3}
          class:text-red-500={score <= 2}
        >
          {score}/{questions.length}
        </div>
        <p class="text-gray-600 dark:text-gray-400">
          {#if score >= 4}
            Excellent! You're well-informed about chocolate's environmental impact!
          {:else if score === 3}
            Good effort! You know quite a bit about sustainable chocolate.
          {:else}
            Keep learning about sustainable chocolate production!
          {/if}
        </p>
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
