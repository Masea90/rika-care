# RIKA Care AI Chat - Testing Guide

## Overview
The RIKA Care AI chatbot provides personalized beauty advice using rule-based responses. It reads user profile data, product recommendations, and community stats to generate contextual answers.

## How to Test

### 1. Access the Chat
1. Open RIKA Care in your browser
2. Log in to your account
3. Click the "AI Chat" tab (💬 icon) in the navigation
4. You should see the chat interface with a welcome message

### 2. Test Basic Interactions

#### Greeting
- **Try**: "Hello", "Hi", "Hey"
- **Expected**: Personalized greeting mentioning your skin type if available
- **Suggested follow-ups**: Product recommendations, routine status, skin type info

#### Product Recommendations
- **Try**: "What products do you recommend?", "Suggest something for me"
- **Expected**: Recommendations based on your skin/hair profile with explanations
- **Should mention**: Your skin type, why the product matches, community insights

#### Skin Questions
- **Try**: "Help with my skin", "I have dry skin", "What about acne?"
- **Expected**: Advice tailored to your skin type and concerns
- **Should include**: Your sensitivities, specific product suggestions

#### Hair Questions
- **Try**: "Hair advice", "My hair is frizzy", "Curly hair tips"
- **Expected**: Hair-specific advice based on your hair type
- **Should mention**: Your hair concerns, suitable products

#### Routine & Progress
- **Try**: "How is my routine?", "Tell me about my progress", "My streak"
- **Expected**: Info about routine completion, streak status, points earned
- **Should show**: Current streak, total points, encouragement

### 3. Test Personalization

#### With Complete Profile
1. Ensure your profile has:
   - Skin type (e.g., "combination")
   - Skin concerns (e.g., "dryness", "acne")
   - Hair type (e.g., "curly")
   - Ingredient sensitivities (e.g., "fragrance", "sulfates")
2. Ask: "What should I use for my skin?"
3. **Expected**: Specific advice mentioning your skin type, concerns, and avoiding your sensitivities

#### With Incomplete Profile
1. Clear some profile data
2. Ask the same questions
3. **Expected**: Generic advice with suggestions to complete your profile

### 4. Test Context Awareness

#### Points & Rewards
- **Try**: "How many points do I have?", "Tell me about rewards"
- **Expected**: Current point total, streak info, reward system explanation

#### Ingredients & Sensitivities
- **Try**: "What ingredients should I avoid?", "I have sensitive skin"
- **Expected**: Reference to your specific sensitivities, clean beauty advice

#### Community Insights
- **Try**: Ask about products after other users have similar profiles
- **Expected**: Mentions like "Many users with [your skin type] have found this helpful"

### 5. Test Suggested Questions
1. After each AI response, check for suggested follow-up questions
2. Click on suggested questions to test them
3. **Expected**: Questions should be relevant to the conversation context

### 6. Test Chat History
1. Have a conversation with multiple messages
2. Reference earlier parts of the conversation
3. **Expected**: AI should maintain context within the session

## API Testing

### Direct API Test
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What products do you recommend for my skin?",
    "history": []
  }'
```

### Expected Response Format
```json
{
  "reply": "Based on your combination skin profile, I'd recommend trying...",
  "suggestedFollowUps": [
    "Tell me more about this product",
    "What about hair products?",
    "How do I use this?"
  ]
}
```

## User Context Data

The AI has access to:

### User Profile
- Name, skin type, hair type
- Skin concerns, hair concerns
- Ingredient sensitivities
- Clean beauty preferences

### Activity Data
- Today's routine completion status
- Current streak count
- Total points earned

### Recommendations
- Top 3 personalized product matches
- Match scores and reasons

### Community Stats (Anonymous)
- Number of users with similar skin type
- Number of users with similar hair type

## Response Patterns

### Greeting Responses
- Personalized with user's name
- Mentions skin type if available
- Offers help with beauty journey

### Product Recommendations
- References user's specific profile
- Explains why products match
- Includes community validation when relevant

### Skin/Hair Advice
- Tailored to user's type and concerns
- Considers sensitivities and preferences
- Suggests specific products when available

### Routine & Progress
- Shows current stats (points, streak)
- Provides encouragement
- Explains point system

### Default Responses
- Friendly and supportive tone
- Asks clarifying questions
- Offers relevant suggestions

## Troubleshooting

### Chat Not Loading
1. Check browser console for errors
2. Verify user is logged in (token exists)
3. Ensure backend server is running on port 3000

### No Personalized Responses
1. Check if user profile is complete
2. Verify product recommendations are loading
3. Check database for user data

### API Errors
1. Check server logs for errors
2. Verify authentication token is valid
3. Test with simpler messages first

### Missing Context
1. Ensure all profile fields are populated
2. Check if recommendations endpoint works
3. Verify community stats are calculating

## Future Enhancements

### Ready for LLM Integration
The code is structured to easily replace the rule-based logic with real LLM calls:

1. Replace `generateAIResponse()` function
2. Keep the same `userContext` building
3. Maintain the same API interface
4. Add LLM provider configuration

### Potential Improvements
- Image analysis integration
- Voice input/output
- Multi-language support
- Conversation memory across sessions
- Advanced product matching
- Appointment scheduling
- Progress tracking visualizations

## Security Notes

### Data Privacy
- No personal data is shared in community stats
- All responses are non-medical
- User context is built fresh for each request
- Chat history is session-only (not persisted)

### Content Safety
- Responses avoid medical claims
- Always supportive and encouraging tone
- No diagnostic or treatment advice
- Focuses on cosmetic and wellness aspects only