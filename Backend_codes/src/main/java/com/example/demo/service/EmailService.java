package com.example.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

  private static final Logger log = LoggerFactory.getLogger(EmailService.class);

  private final JavaMailSender mailSender;

  @Value("${mail.from:}")
  private String fromEmail;

  @Value("${mail.to:}")
  private String toEmail;

  @Value("${mail.subject.prefix:Portfolio Contact Form: }")
  private String subjectPrefix;

  @Value("${frontend.url:http://localhost:4200}")
  private String frontendUrl;

  public EmailService(JavaMailSender mailSender) {
    this.mailSender = mailSender;
  }

  @PostConstruct
  public void validateMailConfiguration() {
    if (fromEmail == null || fromEmail.isBlank()) {
      log.warn("mail.from is not configured");
    }
    if (toEmail == null || toEmail.isBlank()) {
      log.warn("mail.to is not configured");
    }
  }

  public boolean sendContactNotification(String name, String email, String message) {
    try {
      // Notification email to site owner
      MimeMessage notificationEmail = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(notificationEmail, true, "UTF-8");
      if (fromEmail != null && !fromEmail.isBlank()) {
        helper.setFrom(fromEmail);
      }
      if (toEmail != null && !toEmail.isBlank()) {
        helper.setTo(toEmail);
      }
      helper.setSubject(subjectPrefix + "New Contact from " + name.toUpperCase());
      helper.setText(buildNotificationEmailBody(name, email, message), true);
      mailSender.send(notificationEmail);

      // Auto-reply to user
      MimeMessage autoReplyEmail = mailSender.createMimeMessage();
      MimeMessageHelper replyHelper = new MimeMessageHelper(autoReplyEmail, true, "UTF-8");
      if (fromEmail != null && !fromEmail.isBlank()) {
        replyHelper.setFrom(fromEmail);
      }
      replyHelper.setTo(email);
      replyHelper.setSubject("Thank you for contacting Abbana Durga Prasad");
      replyHelper.setText(buildAutoReplyEmailBody(name), true);
      mailSender.send(autoReplyEmail);

      return true;
    } catch (Exception e) {
      log.error("Failed to send contact notification emails", e);
      return false;
    }
  }

  private String buildNotificationEmailBody(String name, String email, String message) {
    return String.format("""
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
          <table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding: 30px 40px; border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; text-align: center;">Here's an Update for You</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 20px; font-weight: 600;">Hi %s,</h2>
                      <p style="margin: 0 0 30px 0; color: #475569; font-size: 16px; line-height: 1.6;">You have received a new contact form submission from your portfolio website. The details are provided below:</p>
                      <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 25px; margin: 30px 0;">
                        <h3 style="margin: 0 0 20px 0; color: #1e293b; font-size: 18px; font-weight: 600;">Contact Details</h3>
                        <table width="100%%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;"><strong style="color: #334155; font-size: 14px;">Name:</strong><span style="color: #475569; font-size: 14px; margin-left: 10px;">%s</span></td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;"><strong style="color: #334155; font-size: 14px;">Email:</strong><a href="mailto:%s" style="color: #667eea; font-size: 14px; margin-left: 10px; text-decoration: none;">%s</a></td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0;"><strong style="color: #334155; font-size: 14px;">Message:</strong></td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0 0 0;"><div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin-top: 10px;"><p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">%s</p></div></td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        """, name, name, email, email, escapeHtml(message));
  }

  private String buildAutoReplyEmailBody(String name) {
    return String.format("""
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank You for Contacting</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
          <table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding: 30px 40px; border-radius: 8px 8px 0 0;"><h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; text-align: center;">Here's an Update for You</h1></td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;"><h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 20px; font-weight: 600;">Hi %s,</h2>
                      <p style="margin: 0 0 30px 0; color: #475569; font-size: 16px; line-height: 1.6;">Thank you for contacting me through my portfolio website! I have received your message and truly appreciate you taking the time to reach out. Your message has been successfully delivered and I will review it shortly.</p>
                      <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid #e2e8f0;"><p style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px; font-weight: 600;">Best regards,</p><p style="margin: 0 0 5px 0; color: #475569; font-size: 16px; font-weight: 500;">Abbana Durga Prasad</p><p style="margin: 0; color: #64748b; font-size: 14px;">Software Developer | Portfolio: <a href="%s" style="color: #667eea; text-decoration: none;">Visit Website</a></p></div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        """, name, frontendUrl);
  }

  private String escapeHtml(String text) {
    if (text == null) return "";
    return text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\"", "&quot;")
        .replace("'", "&#39;");
  }
}

