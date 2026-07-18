from google import genai
from app.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

response = client.models.generate_content(
    model="models/gemini-flash-latest",
    contents="Say only: OK"
)
print(response.text)