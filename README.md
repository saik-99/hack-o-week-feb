# AcademiCal AI 📅🤖

**Smart Academic Calendar Assistant powered by Google Gemini 2.5 Flash**

AcademiCal AI is an intelligent React application that transforms static academic calendar images into interactive, queryable data. By leveraging Google's Gemini API with multimodal capabilities and structured JSON output, it allows students to upload a screenshot of their semester schedule and ask natural language questions like *"When is the Sem 5 CS exam?"* or *"List all holidays in March."*

## 🚀 Key Features

*   **Multimodal Analysis**: Upload generic academic calendar images (PNG/JPG). The AI "reads" the grid structure, merged cells, and headers.
*   **Entity Extraction**: Automatically identifies and tags specific entities from your questions and the calendar:
    *   📅 **Dates** (e.g., "May 5th", "Next Monday")
    *   🎓 **Semesters** (e.g., "Sem 4", "Even Semester")
    *   📚 **Courses/Subjects** (e.g., "CS", "Mathematics")
    *   📝 **Events** (e.g., "Mid-Sem Exam", "Submission")
*   **Structured UI Feedback**: Displays extracted entities as visual chips alongside natural language responses.
*   **Contextual Chat**: Maintains conversation history for follow-up questions.
*   **Privacy-Focused**: Images are processed in-memory and sent directly to the Gemini API; no intermediate server storage.

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS
*   **AI/LLM**: Google Gemini API (`gemini-3-flash-preview`) via `@google/genai` SDK
*   **Data Handling**: Client-side `FileReader` for image processing

## ⚙️ How It Works

1.  **Image Upload**: The user drops an image file onto the interface. The app converts this to a Base64 string stored in the React state.
2.  **Prompt Engineering**: When a question is asked, the app constructs a multipart request containing:
    *   The Base64 image data.
    *   The chat history.
    *   A system instruction forcing a specific **JSON Schema** output.
3.  **AI Processing**: The Gemini model analyzes the visual layout of the calendar and the semantic meaning of the question simultaneously.
4.  **Response Parsing**: The application receives a JSON object containing both the natural language `answer` and a structured `entities` object, which are rendered dynamically in the chat interface.

## 📦 Getting Started

### Prerequisites

You need a Google Gemini API Key. Get one at [Google AI Studio](https://aistudio.google.com/).

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/academical-ai.git
    cd academical-ai
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file in the root directory (or configure your environment) with your API key:
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run the development server**
    ```bash
    npm start
    ```

## 📸 Usage Example

1.  Upload an image of your university's academic calendar.
2.  Ask: *"When do the exams start for Semester 6?"*
3.  The AI will respond: *"The End Semester Exams for Semester 6 start on May 15th, 2024."* and display tags for `[Sem 6]` `[Exam]` `[May 15th]`.

---

*Built for the Google Gemini Developer Competition.*
