# OpenAI Vision API Setup for RIKA Care

## Quick Setup (5 minutes)

### 1. Get OpenAI API Key
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Sign in or create account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

### 2. Add to Environment Variables

**For Render deployment:**
1. Go to your Render dashboard
2. Select your RIKA Care service
3. Go to "Environment" tab
4. Add new environment variable:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** `sk-your-actual-key-here`
5. Save and redeploy

**For local development:**
Create `.env` file in backend folder:
```
OPENAI_API_KEY=sk-your-actual-key-here
```

### 3. Test the Feature
1. Open RIKA Care app
2. Go to skin analysis
3. Take a photo
4. You should now get real AI analysis instead of "AI features coming soon"

## Cost Information
- OpenAI Vision API costs ~$0.01-0.03 per image
- For 100 users taking 1 photo/day = ~$1-3/day
- Consider adding usage limits or premium feature

## Fallback Behavior
- If no API key is set, app shows mock analysis
- If API fails, gracefully falls back to default values
- No app crashes or errors for users

## Security Notes
- Never commit API keys to code
- Use environment variables only
- Monitor usage in OpenAI dashboard
- Set spending limits if needed