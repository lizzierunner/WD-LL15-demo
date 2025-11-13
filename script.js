// Get references to the buttons and response area
const iceBtn = document.getElementById('iceBtn');
const factBtn = document.getElementById('factBtn');
const jokeBtn = document.getElementById('jokeBtn');
const weatherBtn = document.getElementById('weatherBtn');
const themeBtn = document.getElementById('themeBtn');
const contextSelect = document.getElementById('contextSelect');
const personaSelect = document.getElementById('personaSelect');
const responseDiv = document.getElementById('response');

// Array of available themes
const themes = ['default', 'theme-ocean', 'theme-sunset', 'theme-forest', 'theme-purple'];
let currentThemeIndex = 0;

// Function to get the context instruction based on selected setting
function getContextInstruction() {
  const context = contextSelect.value;
  
  // Return different instructions based on the selected context
  switch(context) {
    case 'team':
      return 'This is for a team meeting at work. Keep it professional but friendly, appropriate for coworkers.';
    case 'classroom':
      return 'This is for a classroom setting with students. Keep it educational, age-appropriate, and engaging for learning.';
    case 'gamenight':
      return 'This is for a game night with friends. Make it fun, playful, and entertaining for a casual social gathering.';
    case 'party':
      return 'This is for a party or social event. Make it lively, fun, and great for mingling and socializing.';
    case 'networking':
      return 'This is for a networking event. Keep it professional, interesting, and good for making business connections.';
    default:
      return 'This is for a general setting. Keep it friendly and appropriate for any situation.';
  }
}

// Function to get the persona instruction based on selected personality
function getPersonaInstruction() {
  const persona = personaSelect.value;
  
  // Return different personality styles based on selection
  switch(persona) {
    case 'friendly':
      return 'Respond in a warm, approachable tone like a friendly coworker. Be helpful and supportive.';
    case 'casual':
      return 'Respond in the voice of a friendly, casual intern who uses emojis. Keep it relaxed, fun, and conversational. Use relevant emojis throughout your response to add personality! 😊';
    case 'sassy':
      return 'Respond with a bit of sass and attitude like a witty intern. Be playful, slightly cheeky, but still helpful. Add some humor and personality!';
    case 'professor':
      return 'Respond in an educational, scholarly tone like a professor. Be informative, articulate, and use a more academic style. You may include interesting context or background information.';
    case 'enthusiastic':
      return 'Respond with high energy and enthusiasm like an excited friend! Use exclamation points and show genuine excitement about everything!';
    case 'zen':
      return 'Respond in a calm, peaceful, and mindful tone like a zen master. Be thoughtful and serene in your responses.';
    default:
      return 'Respond in a friendly, helpful tone.';
  }
}

// Function to change the theme
function changeTheme() {
  // Remove the current theme class from body
  document.body.className = '';
  
  // Move to the next theme
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  
  // Add the new theme class (unless it's default)
  if (themes[currentThemeIndex] !== 'default') {
    document.body.classList.add(themes[currentThemeIndex]);
  }
  
  // Show which theme is active
  const themeName = themes[currentThemeIndex].replace('theme-', '').replace('-', ' ');
  const displayName = themeName.charAt(0).toUpperCase() + themeName.slice(1);
  
  // Give feedback to user
  responseDiv.textContent = `🎨 Theme changed to: ${displayName === 'Default' ? 'Original' : displayName}`;
}

// Function to call OpenAI API through Cloudflare Worker
async function getOpenAIResponse(prompt) {
  // Show loading message while waiting for response
  responseDiv.textContent = '🚀 Loading awesomeness...';
  
  try {
    // Make a request to Cloudflare Worker (which calls OpenAI)
    const response = await fetch('https://fllr-worker.esjohn15.workers.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt
      })
    });
    
    // Check if the response is successful
    if (!response.ok) {
      // Get more detailed error information
      const errorText = await response.text();
      console.error('Response error:', errorText);
      throw new Error(`Server responded with status ${response.status}`);
    }
    
    // Parse the response data
    const data = await response.json();
    console.log('Received data:', data); // Log the data to help debug
    
    // Get the AI's message from the response - try different possible formats
    let aiMessage = '';
    if (data.response) {
      aiMessage = data.response;
    } else if (data.message) {
      aiMessage = data.message;
    } else if (data.choices && data.choices[0] && data.choices[0].message) {
      aiMessage = data.choices[0].message.content;
    } else if (data.content) {
      aiMessage = data.content;
    } else {
      console.error('Unexpected response format:', data);
      throw new Error('Could not find response text in the data');
    }
    
    // Display the response on the page
    responseDiv.textContent = aiMessage;
    
  } catch (error) {
    // Show error message if something goes wrong
    responseDiv.textContent = `❌ Oops! Something went wrong: ${error.message}. Check the browser console (F12) for more details.`;
    console.error('Full error:', error);
  }
}

// Add click event listener for Icebreaker button
iceBtn.addEventListener('click', () => {
  // Get the context and persona instructions
  const contextInstruction = getContextInstruction();
  const personaInstruction = getPersonaInstruction();
  const prompt = `${personaInstruction} ${contextInstruction} Generate a fun and engaging icebreaker question or conversation starter that would help people get to know each other better. Keep it light and friendly.`;
  getOpenAIResponse(prompt);
});

// Add click event listener for Weird Fact button
factBtn.addEventListener('click', () => {
  // Get the context and persona instructions
  const contextInstruction = getContextInstruction();
  const personaInstruction = getPersonaInstruction();
  const prompt = `${personaInstruction} ${contextInstruction} Share a surprising and unusual fact that most people don't know. Make it interesting and fun!`;
  getOpenAIResponse(prompt);
});

// Add click event listener for Joke button
jokeBtn.addEventListener('click', () => {
  // Get the context and persona instructions
  const contextInstruction = getContextInstruction();
  const personaInstruction = getPersonaInstruction();
  const prompt = `${personaInstruction} ${contextInstruction} Tell me a light-hearted, clean joke that would make people laugh. Keep it appropriate for the setting.`;
  getOpenAIResponse(prompt);
});

// Add click event listener for Weather button
weatherBtn.addEventListener('click', () => {
  // Get the context and persona instructions
  const contextInstruction = getContextInstruction();
  const personaInstruction = getPersonaInstruction();
  const prompt = `${personaInstruction} ${contextInstruction} Generate a weather-related conversation prompt or question that encourages people to share what the weather is like where they are and how it affects their day.`;
  getOpenAIResponse(prompt);
});

// Add click event listener for Theme button
themeBtn.addEventListener('click', changeTheme);
