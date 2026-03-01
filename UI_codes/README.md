# Personal Portfolio Website - Full Stack Application with AI Assistant

A modern, intelligent full-stack portfolio website built with **Angular** (frontend) and **Spring Boot** (backend), featuring a personalized AI assistant powered by **Ollama** and **RAG (Retrieval Augmented Generation)**. The application showcases projects, achievements, skills, and provides an interactive AI chatbot that answers questions about the portfolio owner.

## 🚀 Features

### 🏠 Home Page
- **Welcome Section**: Customizable heading and subtitle
- **Profile Carousel**: Multiple profile images with automatic rotation
- **Bio Data Section**: Editable biography with admin controls
- **Project Gallery**: Visual showcase of projects with categories
  - Image upload support (local files or URLs)
  - Project descriptions and categorization
  - Admin mode for adding/editing/deleting items
- **Achievements Gallery**: Display certifications and achievements
  - Customizable icons, dates, and organizations
  - Background images support
  - Full CRUD operations in admin mode
- **Custom Sections**: Admin can create additional content sections
- **Contact Form**: Integrated contact form with email notifications
  - Auto-reply to users
  - Email notifications to portfolio owner

### 💼 Portfolio Page (Project Explorer)
- **Profile Management**: Complete profile information with social links
- **Skills Management**: Categorized skills (Frontend, Backend, Database, DevOps, Other)
  - Proficiency levels
  - Skill categorization and filtering
- **Projects Showcase**: Detailed project information
  - Featured projects highlighting
  - Technology tags
  - Project links (GitHub, Live Demo)
  - Full project descriptions
- **Portfolio Sections**: Customizable portfolio sections
- **Dual-Mode Architecture**: Same UI for public and admin views

### 🤖 LLA AI Bot (Personal AI Assistant)
- **RAG-Powered Chatbot**: Uses Retrieval Augmented Generation with Ollama
- **Strict Scope Control**: Only answers questions about the portfolio owner
  - Profile information
  - Education background
  - Work experience
  - Projects and technologies
  - Skills and expertise
- **Refusal Mechanism**: Politely refuses general knowledge questions
- **System Prompt Engineering**: Controlled behavior through system prompts (no fine-tuning required)
- **Context-Aware**: Uses embedded profile data and web-scraped content
- **Agent Capabilities**: Quick actions for viewing profile, downloading resume, opening project links
- **Real-time Chat Interface**: Modern chat UI with typing indicators
- **Conversation Management**: Maintains conversation context

### 🔐 Admin Dashboard
- **Secure Authentication**: JWT-ready authentication system
- **Admin Mode**: Protected routes with auth guards
- **Content Management**: Full CRUD operations for all content
- **Image Upload**: Backend image storage service
- **Real-time Updates**: Reactive state management with Angular signals

### 📧 Contact & Communication
- **Contact Form**: User-friendly contact form
- **Email Integration**: Spring Mail integration
  - Notification emails to portfolio owner
  - Auto-reply emails to users
  - Gmail SMTP support
- **Form Validation**: Client and server-side validation

### 🖼️ Image Management
- **Image Upload Service**: Backend image storage
- **Multiple Upload Methods**: File upload or URL input
- **Image Storage**: Organized storage in `uploads/` directory
- **Image Serving**: RESTful API for image retrieval

## 📁 Project Structure

### Frontend (Angular)
```
src/app/
├── components/
│   ├── chatbot/                    # LLA AI Bot component
│   │   ├── chatbot.component.ts
│   │   ├── chatbot.component.html
│   │   └── chatbot.component.scss
│   └── agent-capabilities/         # AI agent quick actions
│       ├── agent-capabilities.component.ts
│       ├── agent-capabilities.component.html
│       └── agent-capabilities.component.scss
├── pages/
│   ├── home/                       # Home page with gallery & achievements
│   │   ├── home.component.ts
│   │   ├── home.component.html
│   │   └── home.component.scss
│   ├── portfolio/                  # Portfolio/Project Explorer
│   │   ├── portfolio.ts
│   │   ├── portfolio.html
│   │   └── portfolio.scss
│   ├── login/                      # Authentication
│   │   └── login.ts
│   └── admin-dashboard/            # Admin dashboard
│       └── admin-dashboard.component.ts
├── services/
│   ├── auth.ts                     # Authentication service
│   ├── portfolio.service.ts        # Portfolio data management
│   ├── contact.service.ts          # Contact form service
│   ├── chat.service.ts             # AI chatbot service
│   ├── image-upload.service.ts     # Image upload service
│   └── profile.service.ts          # Profile data service
├── models/
│   ├── portfolio.models.ts         # Portfolio data models
│   ├── home.models.ts              # Home page models
│   └── chat.models.ts              # Chat models
├── guards/
│   └── auth-guard.ts               # Route protection
└── app.routes.ts                    # Routing configuration
```

### Backend (Spring Boot)
```
Backend_codes/
├── src/main/java/com/example/demo/
│   ├── controller/
│   │   ├── ChatController.java          # AI chatbot API
│   │   ├── ContactController.java        # Contact form API
│   │   └── ImageUploadController.java    # Image upload API
│   ├── service/
│   │   ├── RagChatService.java          # RAG chat service
│   │   ├── LocalLlmClient.java          # Ollama LLM client
│   │   ├── WebDataIndexer.java          # Web scraping & indexing
│   │   ├── ProfileDataService.java      # Embedded profile data
│   │   ├── EmailService.java            # Email service
│   │   └── ImageStorageService.java     # Image storage service
│   ├── dto/
│   │   ├── ChatRequest.java
│   │   ├── ChatResponse.java
│   │   ├── ContactRequest.java
│   │   └── ContactResponse.java
│   ├── config/
│   │   ├── CorsConfig.java              # CORS configuration
│   │   └── WebConfig.java                # Web configuration
│   └── DemoApplication.java
└── src/main/resources/
    └── application.yml                  # Configuration
```

## 🏗️ Architecture

### Frontend Architecture
- **Standalone Components**: Modern Angular architecture
- **Signals**: Reactive state management
- **Dual-Mode Design**: Same components for public and admin views
- **Service Layer**: Separation of concerns with dedicated services
- **HTTP Client**: Integrated with backend APIs

### Backend Architecture
- **RESTful API**: Clean REST endpoints
- **RAG System**: Retrieval Augmented Generation for AI responses
- **System Prompt Engineering**: Behavior control through prompts
- **Email Service**: Spring Mail integration
- **File Storage**: Image upload and management
- **CORS Configuration**: Cross-origin resource sharing setup

### AI Assistant Architecture
- **Ollama Integration**: Local LLM execution
- **RAG Pipeline**: 
  1. User query → Context retrieval
  2. Profile data + Web data → Context building
  3. System prompt + Context + User query → LLM
  4. Response generation with scope enforcement
- **Strict Scope Control**: System prompts enforce behavior boundaries
- **No Fine-tuning**: Uses pretrained models with prompt engineering

## 🚦 Getting Started

### Prerequisites

**Frontend:**
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI 20.3+

**Backend:**
- Java 17 or higher
- Maven 3.6+
- Ollama (for AI chatbot)
  - Install from [ollama.com](https://ollama.com)
  - Pull a model: `ollama pull llama3` (or mistral, llama3.1, etc.)

**Email Setup:**
- Gmail account with App Password
  - Enable 2-Step Verification
  - Generate App Password from Google Account settings

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd personal-website
```

#### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
ng serve
# Navigate to http://localhost:4200
```

#### 3. Backend Setup
```bash
cd Backend_codes

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
# Or run the JAR
java -jar target/personal-ai-backend-0.0.1-SNAPSHOT.jar
```

#### 4. Ollama Setup
```bash
# Install Ollama (if not already installed)
# Visit https://ollama.com/download

# Pull a model (choose one)
ollama pull llama3
# or
ollama pull mistral
# or
ollama pull llama3.1

# Start Ollama (usually runs automatically)
# Verify it's running
curl http://localhost:11434/api/tags
```

#### 5. Configuration

**Backend Configuration** (`Backend_codes/src/main/resources/application.yml`):

```yaml
# Update email settings
spring:
  mail:
    username: ${MAIL_USERNAME:your-email@gmail.com}
    password: ${MAIL_PASSWORD:your-app-password}

mail:
  from: "your-email@gmail.com"
  to: "your-email@gmail.com"

# Update AI model (if using different model)
ai:
  ollama:
    model: "llama3"  # Change to your model name
    baseUrl: "http://localhost:11434"

# Update profile URLs (optional)
ai:
  profileUrls:
    - "https://your-portfolio-site.com"
    - "https://github.com/your-username"
```

**Environment Variables** (Recommended):
```bash
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password
```

### Default Credentials
- **Username**: `admin`
- **Password**: `admin123`

## 🔌 API Endpoints

### Chat API
```
POST /api/chat
Body: { "message": "string", "conversationId": "string" (optional) }
Response: { "reply": "string", "sources": ["string"] }
```

### Contact API
```
POST /api/contact
Body: { "name": "string", "email": "string", "message": "string" }
Response: { "success": boolean, "message": "string" }
```

### Image Upload API
```
POST /api/images/upload
Content-Type: multipart/form-data
Body: file (multipart file)
Response: { "url": "string", "filename": "string" }

DELETE /api/images/delete?filename={filename}
Response: { "success": boolean }
```

## 🎨 Key Features Explained

### LLA AI Bot - Personal AI Assistant

The AI assistant uses **RAG (Retrieval Augmented Generation)** with **Ollama** to provide personalized responses:

1. **System Prompt Engineering**: Strict behavior control through system prompts
   - Only answers questions about the portfolio owner
   - Refuses general knowledge questions
   - Provides context-aware responses

2. **Context Sources**:
   - Embedded profile data (`ProfileDataService`)
   - Web-scraped content from profile URLs (`WebDataIndexer`)
   - Real-time context retrieval based on user queries

3. **Technology Stack**:
   - **Ollama**: Local LLM runtime
   - **Spring AI**: AI integration framework
   - **RAG**: Retrieval Augmented Generation pattern
   - **JSoup**: Web scraping for additional context

### Dual-Mode Architecture

The application uses the same components for both public and admin views:

- **Public Routes**: `/`, `/portfolio` - Read-only view
- **Secure Routes**: `/secure/*` - Protected by auth guard, enables editing
- **Mode Detection**: Components check route data to determine mode
- **Conditional Rendering**: Edit controls appear only in secure mode

### Image Management

- **Upload Methods**: File upload or URL input
- **Storage**: Backend stores images in `uploads/` directory
- **Organization**: Images organized by type (gallery, profile, achievements)
- **Serving**: RESTful API serves images

## 🔧 Development

### Build for Production

**Frontend:**
```bash
ng build --configuration production
```

**Backend:**
```bash
mvn clean package
# JAR will be in target/personal-ai-backend-0.0.1-SNAPSHOT.jar
```

### Running Tests

**Frontend:**
```bash
ng test
```

**Backend:**
```bash
mvn test
```

## 🔐 Security Notes

- **Authentication**: JWT-ready authentication system
- **Route Guards**: Protected admin routes
- **CORS**: Configured for specific origins
- **Input Validation**: Server-side validation for all inputs
- **Email Credentials**: Use environment variables for sensitive data
- **File Upload**: Size limits and validation

## 📦 Dependencies

### Frontend
- Angular 20.3+
- RxJS
- Angular Forms
- Angular Router

### Backend
- Spring Boot 3.3.1
- Spring Web
- Spring Mail
- Spring WebFlux (for Ollama API calls)
- JSoup (web scraping)
- Jackson (JSON processing)
- Validation API

## 🚀 Deployment

### Frontend Deployment
- Build the Angular app: `ng build`
- Deploy the `dist/` folder to your hosting service
- Update API URLs in services for production

### Backend Deployment
- Build JAR: `mvn clean package`
- Run: `java -jar target/personal-ai-backend-0.0.1-SNAPSHOT.jar`
- Ensure Ollama is running and accessible
- Configure environment variables for email

### Environment Variables
```bash
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## 🎯 Future Enhancements

- [ ] JWT authentication implementation
- [ ] Database integration (PostgreSQL/MySQL)
- [ ] User analytics
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Resume PDF generation
- [ ] Blog section
- [ ] Comment system
- [ ] Social media integration
- [ ] Advanced AI features (multi-turn conversations, memory)

## 📝 Customization

### Updating Profile Data

Edit `Backend_codes/src/main/java/com/example/demo/service/ProfileDataService.java` to update:
- Personal information
- Education details
- Work experience
- Technologies and skills
- Projects information

### Customizing AI Behavior

Edit the system prompt in `Backend_codes/src/main/java/com/example/demo/service/RagChatService.java`:
- Modify the `SYSTEM_PROMPT` constant
- Adjust scope restrictions
- Change refusal messages
- Update response guidelines

### Styling

- Global styles: `src/styles.scss`
- Component styles: Individual `.scss` files
- Color scheme: Customize CSS variables

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Abbana Durga Prasad**
- Portfolio: [Your Portfolio URL]
- GitHub: [Your GitHub URL]
- Email: abbanadurgaprasad9390@gmail.com

---

Built with ❤️ using Angular 20, Spring Boot 3.3.1, and Ollama
