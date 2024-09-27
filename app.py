from flask import Flask, request, jsonify
import google.generativeai as genai
from transformers import pipeline
import spacy
import difflib
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])
API_KEY = 'AIzaSyA7KWxO8MXBQou5INzucuiqujqE8Vof3ec'  # Add your Google Gemini API key here

# Configure the Google Gemini API
genai.configure(api_key=API_KEY)
model_name = 'gemini-1.5-flash'

# Memory to store conversation context
memory = {
    "symptoms": [],
    "context": "",
    "chat_history": []
}

# Expanded list of COVID-related keywords
covid_keywords = [
    "covid", "coronavirus", "virus", "pandemic", "symptoms", "fever", "cough",
    "breathing", "test", "vaccine", "isolation", "quarantine", "mask", "lockdown",
    "social distancing", "sanitizer", "ventilator", "icu", "hospitalization",
    "contact tracing", "variant", "booster", "herd immunity", "exposure", 
    "long covid", "antibody", "asymptomatic", "epidemic", "outbreak", "delta",
    "omicron", "face mask", "PPE", "immunization", "clinical trials", "viral load", "cold", "dry"
]

# Load the sentiment analysis pipeline
nlu_model = pipeline("sentiment-analysis", model="/home/the_priest/csc_452/sentiment-analysis-model/")

# Load the spaCy model
nlp = spacy.load("en_core_web_sm")

def get_gemini_response(prompt):
    """
    Sends a prompt to Google Gemini API and returns a professional and concise response.
    """
    try:
        model = genai.GenerativeModel(model_name=model_name)
        response = model.generate_content([prompt], stream=True)

        # Initialize buffer to collect response parts
        buffer = []
        for chunk in response:
            for part in chunk.parts:
                buffer.append(part.text)

        # Join all parts of the response into a single string
        full_response = ''.join(buffer)

        # Process the response to ensure it is professional
        if full_response:
            # Formatting the response for professionalism
            formatted_response = format_professional_response(full_response)
        else:
            formatted_response = "Sorry, there was an issue with the response."

        return formatted_response

    except Exception as e:
        print(f"Error while getting Gemini response: {e}")
        return "Sorry, there was an error generating the response."

def format_professional_response(response_text):
    """
    Formats the response to be professional, concise, and actionable.
    Emphasizes key points and structures the output for clarity.
    """
    # Define some basic structure and styling for the response
    sections = {
        "Introduction": [],
        "Key Points": [],
        "Recommendations": [],
        "Additional Information": []
    }

    # Split response into paragraphs
    paragraphs = response_text.split('\n\n')

    # Heuristics to categorize the content into different sections
    for paragraph in paragraphs:
        paragraph = paragraph.strip()
        if any(keyword in paragraph.lower() for keyword in ["important", "key points", "highlights"]):
            sections["Key Points"].append(paragraph)
        elif any(keyword in paragraph.lower() for keyword in ["recommend", "advice", "suggest"]):
            sections["Recommendations"].append(paragraph)
        elif len(sections["Introduction"]) == 0:
            sections["Introduction"].append(paragraph)
        else:
            sections["Additional Information"].append(paragraph)

    # Format the response with headings and bullet points
    formatted_response = ""
    for section, content in sections.items():
        if content:
            formatted_response += f"**{section}:**\n"
            formatted_response += "\n".join(f"- {line}" for line in content) + "\n\n"

    # Ensure the response is polite and professional
    if not formatted_response.strip():
        formatted_response = "Sorry, there was an issue generating a comprehensive response."

    return formatted_response


def is_covid_related(user_input):
    """
    Checks if the user input is related to COVID-19, considering close matches for typos.
    """
    words = user_input.lower().split()
    for word in words:
        close_matches = difflib.get_close_matches(word, covid_keywords, n=1, cutoff=0.8)
        if close_matches:
            return True
    return False

def understand_input(user_input):
    """
    Processes the user input using both NLU (sentiment analysis) and NER (Named Entity Recognition).
    """
    doc = nlp(user_input)
    entities = [(ent.text, ent.label_) for ent in doc.ents]
    sentiment = nlu_model(user_input)
    return entities, sentiment

def update_memory(symptoms, context):
    """
    Updates the chatbot's memory with new symptoms and context.
    """
    memory["symptoms"].extend(symptoms)
    memory["context"] = context
    memory["chat_history"].append({
        "symptoms": symptoms,
        "context": context
    })


@app.route('/chat', methods=['POST'])
def chat():
    """
    Handles user input and provides responses based on the chatbot's memory and external APIs.
    """
    try:
        data = request.json
        user_message = data.get('message', '')

        if not user_message:
            return jsonify({'response': 'Please provide a message.'})

        if not is_covid_related(user_message):
            return jsonify({'response': 'Let\'s keep our conversation focused on COVID-19-related topics.'})

        entities, sentiment = understand_input(user_message)

        if sentiment[0]['label'] == "NEGATIVE":
            sentiment_message = "I sense some concern in your message."
        else:
            sentiment_message = ""

        if "symptom" in user_message:
            symptoms = user_message.split(", ")
            context = memory["context"]
            update_memory(symptoms, context)
        else:
            symptoms = memory["symptoms"]
            context = user_message
            update_memory(symptoms, context)

        prompt = f"Given the symptoms: {', '.join(memory['symptoms'])} and context: {memory['context']}, provide a detailed COVID-19-related response."
        response = get_gemini_response(prompt)

        full_response = f"{sentiment_message}\n\n{response}"

        # Format the response to look better on the frontend
        formatted_full_response = format_professional_response(full_response)

        memory["chat_history"].append({"user": user_message, "chatbot": formatted_full_response})

        return jsonify({'response': formatted_full_response})

    except Exception as e:
        print(f"Error: {e}")  # Print error details to console
        return jsonify({'response': f'Sorry, there was an error. {str(e)}'})


if __name__ == '__main__':
    app.run(debug=True)
