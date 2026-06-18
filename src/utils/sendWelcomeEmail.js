import nodemailer from 'nodemailer';

/**
 * Dispatches a world-class, premium welcome onboarding email notification
 * @param {string} name - The registered user's full name or identity label
 * @param {string} email - The targeted corporate destination address
 */
export const sendWelcomeEmail = async (name, email) => {
  try {
    // 🎯 SURGICAL RUNTIME SECURE GUARD: Initialize transporter inside the function scope
    // to guarantee process.env.RESEND_API_KEY is fully hydrated by your entry point's dotenv configuration.
    const transporter = nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
      },
    });

    const htmlContent = `
   <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Rentals</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif !important; }
    /* Reset margins for email clients */
    p, h1, h2, h3 { margin: 0; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#0F172A; color:#E2E8F0; -webkit-font-smoothing:antialiased;">
  
  <div style="display:none; font-size:1px; color:#0F172A; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
    Your search for luxury properties ends here. Welcome to the network.
  </div>

  <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin: 40px auto; background:#1E293B; border-radius:24px; overflow:hidden; border: 1px solid rgba(255,107,107,0.15); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
    
    <tr>
      <td style="padding:40px 40px 30px 40px; background: #0F172A; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td valign="middle">
              <div style="display:inline-block; width:36px; height:36px; background:linear-gradient(135deg, #FF6B6B 0%, #E05252 100%); border-radius:10px; text-align:center; line-height:36px; vertical-align:middle; margin-right:12px; box-shadow: 0 4px 10px rgba(255,107,107,0.3);">
                <span style="color:#FFFFFF; font-weight:800; font-size:20px; font-style:italic;">R</span>
              </div>
              <span style="color:#FFFFFF; font-weight:800; font-size:26px; tracking-tight; vertical-align:middle; letter-spacing:-0.5px;">Rentals<span style="color:#FF6B6B;">.</span></span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding:40px;">
        <h1 style="font-size:28px; font-weight:800; letter-spacing:-1px; margin:0; color:#FFFFFF; line-height:1.3;">
          Your key to Africa's finest properties, <span style="color:#FF6B6B;">${name}</span>.
        </h1>
        <p style="margin:20px 0 0 0; font-size:16px; line-height:1.6; color:#94A3B8;">
          Welcome to the ultimate property network. Whether you are looking for a weekend shortlet, a luxury apartment, or your next permanent home, your seamless search starts right now.
        </p>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0; background: #0F172A; border-radius: 16px; padding: 24px; border: 1px solid rgba(255,107,107,0.1);">
          <tr>
            <td style="padding-bottom: 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="30" valign="top"><span style="font-size:20px;">✨</span></td>
                  <td>
                    <p style="color:#FFFFFF; font-weight:700; font-size:15px; margin:0 0 4px 0;">Curated Shortlets & Homes</p>
                    <p style="color:#64748B; font-size:14px; line-height:1.5; margin:0;">Discover hand-picked, premium properties tailored for elite comfort and style.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="30" valign="top"><span style="font-size:20px;">🛡️</span></td>
                  <td>
                    <p style="color:#FFFFFF; font-weight:700; font-size:15px; margin:0 0 4px 0;">100% Verified Listings</p>
                    <p style="color:#64748B; font-size:14px; line-height:1.5; margin:0;">Zero guesswork. Every property and host on our network undergoes strict security checks.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="30" valign="top"><span style="font-size:20px;">📱</span></td>
                  <td>
                    <p style="color:#FFFFFF; font-weight:700; font-size:15px; margin:0 0 4px 0;">Seamless Direct Booking</p>
                    <p style="color:#64748B; font-size:14px; line-height:1.5; margin:0;">Lock down your next stay or schedule an immediate physical inspection in just three clicks.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <a href="https://www.rentalsafrica.com" 
                 style="display:inline-block; padding:18px 40px; background:#FF6B6B; color:#FFFFFF; text-decoration:none; border-radius:12px; font-size:15px; font-weight:700; letter-spacing:0.5px; box-shadow: 0 8px 20px rgba(255, 107, 107, 0.25);">
                 Start Exploring
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding:0 40px 40px 40px;">
        <div style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 20px; text-align: center;">
          <p style="margin:0; font-size:13px; color:#94A3B8; line-height: 1.5;">
            Need private concierge assistance?<br> Connect with our resident specialists at <a href="mailto:support@rentalsafrica.com" style="color:#FF6B6B; text-decoration:none; font-weight:600;">support@rentalsafrica.com</a>
          </p>
        </div>
      </td>
    </tr>

    <tr>
      <td align="center" style="padding:30px; background:#0F172A; color:#64748B; border-top:1px solid rgba(255,255,255,0.05);">
        <p style="margin:0; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#94A3B8;">Rentals Africa</p>
        <p style="margin:8px 0 0 0; font-size:12px; color:#475569;">Lagos • Abuja • Africa • 2026 Edition</p>
        <div style="margin-top:20px;">
            <a href="#" style="color:#64748B; text-decoration:none; font-size:11px; margin:0 12px; font-weight: 500;">Privacy Policy</a>
            <a href="#" style="color:#64748B; text-decoration:none; font-size:11px; margin:0 12px; font-weight: 500;">Terms of Service</a>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await transporter.sendMail({
      from: '"Rentals" <hello@rentalsafrica.com>',
      to: email,
      subject: 'Welcome to the Rentals. Network',
      html: htmlContent,
    });
    
    console.log(`✅ Welcome email dispatched smoothly via ESM pipeline to ${name}`);
  } catch (error) {
    console.error('❌ Welcome email pipeline fault:', error);
  }
};