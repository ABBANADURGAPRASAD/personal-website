package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

  private final JavaMailSender mailSender;

  @Value("${mail.from:your-email@gmail.com}")
  private String fromEmail;

  @Value("${mail.to:your-email@gmail.com}")
  private String toEmail;

  @Value("${mail.subject.prefix:Portfolio Contact Form: }")
  private String subjectPrefix;

  public EmailService(JavaMailSender mailSender) {
    this.mailSender = mailSender;
  }

  /**
   * Sends an email notification when a contact form is submitted
   * 
   * @param name    The name of the person submitting the form
   * @param email   The email of the person submitting the form
   * @param message The message content
   * @return true if email was sent successfully, false otherwise
   */
  public boolean sendContactNotification(String name, String email, String message) {
    try {
      // Email to you (notification about new contact)
      SimpleMailMessage notificationEmail = new SimpleMailMessage();
      notificationEmail.setFrom(fromEmail);
      notificationEmail.setTo(toEmail);
      notificationEmail.setSubject(subjectPrefix + "New Contact from " + name);
      notificationEmail.setText(buildNotificationEmailBody(name, email, message));
      mailSender.send(notificationEmail);

      // Auto-reply email to the user
      SimpleMailMessage autoReplyEmail = new SimpleMailMessage();
      autoReplyEmail.setFrom(fromEmail);
      autoReplyEmail.setTo(email);
      autoReplyEmail.setSubject("Thank you for contacting Abbana Durga Prasad");
      autoReplyEmail.setText(buildAutoReplyEmailBody(name));
      mailSender.send(autoReplyEmail);

      return true;
    } catch (Exception e) {
      e.printStackTrace();
      return false;
    }
  }

  private String buildNotificationEmailBody(String name, String email, String message) {
    return String.format("""
        You have received a new contact form submission from your portfolio website.
        
        Contact Details:
        Name: %s
        Email: %s
        
        Message:
        %s
        
        ---
        This is an automated notification from your portfolio website.
        """, name, email, message);
  }

  private String buildAutoReplyEmailBody(String name) {
    return String.format("""
        Hello %s,
        
        Thank you for reaching out through my portfolio website! I have received your message and will get back to you as soon as possible.
        
        Best regards,
        Abbana Durga Prasad
        
        ---
        This is an automated response. Please do not reply to this email.
        """, name);
  }
}

