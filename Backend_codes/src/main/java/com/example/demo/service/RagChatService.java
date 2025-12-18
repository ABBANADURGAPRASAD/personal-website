package com.example.demo.service;

import com.example.demo.dto.ChatRequest;
import com.example.demo.dto.ChatResponse;
import com.example.demo.llm.LocalLlmClient;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class RagChatService {

  private final WebDataIndexer webDataIndexer;
  private final LocalLlmClient localLlmClient;
  private final ProfileDataService profileDataService;

  private static final String SYSTEM_PROMPT = """
      You are LLA AI Bot, a personalized AI assistant created specifically for Abbana Durga Prasad.

      CRITICAL RULES - YOU MUST FOLLOW THESE STRICTLY:

      1. SCOPE RESTRICTION:
         - You MUST ONLY answer questions about Abbana Durga Prasad, including:
           * His profile and personal information
           * His education background
           * His work experience
           * His projects and portfolio
           * Technologies he uses (Java, Spring Boot, Spring AI, Ollama, AI/ML basics, databases, frontend tools)
           * His skills and expertise

      2. REFUSAL RULES - YOU MUST REFUSE TO ANSWER:
         - ANY questions about general world knowledge
         - Questions about current events, history, science, or any topic unrelated to Abbana Durga Prasad
         - Questions about other people, celebrities, or public figures
         - General programming questions not related to his specific projects or work
         - Questions outside the scope defined above

      3. RESPONSE FORMAT FOR OUT-OF-SCOPE QUESTIONS:
         - If asked about topics outside your scope, respond EXACTLY with:
           "I'm LLA AI Bot, designed specifically to help with information about Abbana Durga Prasad. 
            I can only answer questions about his profile, education, work experience, projects, and technologies. 
            Please ask me something about him instead."

      4. ANSWERING GUIDELINES:
         - Use ONLY the provided context about Abbana Durga Prasad
         - If the context doesn't contain information to answer the question, say: 
           "I don't have that specific information about Abbana Durga Prasad in my knowledge base. 
            Please ask about his profile, projects, skills, or technologies instead."
         - Be accurate and only state facts that are in the provided context
         - Keep responses concise and relevant

      5. IDENTITY:
         - You are NOT a general-purpose AI assistant
         - You are a specialized assistant for Abbana Durga Prasad only
         - You do NOT have knowledge beyond what's provided in the context

      Remember: Your sole purpose is to provide information about Abbana Durga Prasad. 
      You must firmly refuse any question that falls outside this scope.
      """;

  public RagChatService(
      WebDataIndexer webDataIndexer,
      LocalLlmClient localLlmClient,
      ProfileDataService profileDataService) {
    this.webDataIndexer = webDataIndexer;
    this.localLlmClient = localLlmClient;
    this.profileDataService = profileDataService;
  }

  public ChatResponse chat(ChatRequest request) {
    String userMessage = request.getMessage();

    // Get relevant chunks from web data (if available)
    List<WebDataIndexer.TextChunk> relevantChunks =
        webDataIndexer.findRelevant(userMessage, 5);

    // Combine embedded profile data with web-scraped data
    StringBuilder contextBuilder = new StringBuilder();
    
    // Always include embedded profile data as primary source
    contextBuilder.append(profileDataService.getProfileData())
        .append("\n\n")
        .append(profileDataService.getTechnologiesData())
        .append("\n\n");

    // Add web-scraped data if available
    if (!relevantChunks.isEmpty()) {
      contextBuilder.append("ADDITIONAL CONTEXT FROM PORTFOLIO/PROJECTS:\n");
      String webContextText = relevantChunks.stream()
          .map(WebDataIndexer.TextChunk::getText)
          .collect(Collectors.joining("\n\n"));
      contextBuilder.append(webContextText);
    }

    String contextText = contextBuilder.toString();

    // Build sources list
    List<String> sources = new ArrayList<>();
    sources.add("Embedded Profile Data");
    relevantChunks.stream()
        .map(WebDataIndexer.TextChunk::getSource)
        .distinct()
        .forEach(sources::add);

    // Build user prompt with context
    String userPrompt = String.format("""
        CONTEXT INFORMATION ABOUT ABBANA DURGA PRASAD:
        %s

        USER QUESTION: %s

        Based on the context above, answer the user's question. Remember:
        - If the question is about Abbana Durga Prasad (his profile, education, work, projects, technologies), answer it using the context.
        - If the question is about anything else, you MUST refuse to answer and direct them to ask about Abbana Durga Prasad instead.
        
        Your response:""", contextText, userMessage);

    String llmReply;
    try {
      llmReply = localLlmClient.generate(userPrompt, SYSTEM_PROMPT);
    } catch (Exception e) {
      e.printStackTrace();
      llmReply = "Sorry, I encountered a technical issue processing your request. Please try again later.";
    }

    return new ChatResponse(llmReply, sources);
  }
}


