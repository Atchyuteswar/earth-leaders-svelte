<script lang="ts">
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Climate Scientist',
      image: '/team/sarah.jpg',
      github: 'https://github.com/sarahj',
      linkedin: 'https://linkedin.com/in/sarahj'
    },
    {
      name: 'Michael Chen',
      role: 'Environmental Engineer',
      image: '/team/michael.jpg',
      github: 'https://github.com/michaelc',
      linkedin: 'https://linkedin.com/in/michaelc'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Sustainability Expert',
      image: '/team/emma.jpg',
      github: 'https://github.com/emmar',
      linkedin: 'https://linkedin.com/in/emmar'
    }
  ];
</script>

<div class="min-h-screen bg-gray-50 py-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-4xl font-bold text-green-700 mb-12 text-center">Our Team</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each team as member}
        <div class="bg-white rounded-lg shadow-md overflow-hidden group">
          <div class="aspect-w-1 aspect-h-1 relative">
            <img
              src={member.image}
              alt={member.name}
              class="w-full h-64 object-cover"
            />
            <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                class="text-white hover:text-green-400 transition-colors"
              >
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                class="text-white hover:text-green-400 transition-colors"
              >
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-800">{member.name}</h3>
            <p class="text-gray-600">{member.role}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
