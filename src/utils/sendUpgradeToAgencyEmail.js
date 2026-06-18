import nodemailer from 'nodemailer';


 
export const sendUpgradeToAgencyEmail = async (name, email) => {
  try {
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
      <title>Account Upgraded: Verified Agency</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif !important; }
        p, h1, h2, h3 { margin: 0; }
      </style>
    </head>
    <body style="margin:0; padding:0; background-color:#0F172A; color:#E2E8F0; -webkit-font-smoothing:antialiased;">
      
      <div style="display:none; font-size:1px; color:#0F172A; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
        Your corporate compliance review is clear. Your broker pipeline is now completely active.
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
                <td align="right" valign="middle">
                  <span style="font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:2px; color:#FF6B6B; background:rgba(255,107,107,0.1); padding:6px 12px; border-radius:100px; border:1px solid rgba(255,107,107,0.2);">Verified Agency</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:40px;">
            <h1 style="font-size:28px; font-weight:800; letter-spacing:-1px; margin:0; color:#FFFFFF; line-height:1.3;">
              Broker Pipeline <span style="color:#FF6B6B;">Activated</span>.
            </h1>
            <p style="margin:20px 0 0 0; font-size:16px; line-height:1.6; color:#94A3B8;">
              Congratulations <strong style="color:#FFFFFF;">${name}</strong>, your corporate compliance review is clear. Your profile has been officially elevated to Verified Realtor status across our premium network.
            </p>
            
            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0; background: #0F172A; border-radius: 16px; padding: 24px; border: 1px solid rgba(255,107,107,0.1);">
              <tr>
                <td style="padding-bottom: 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="30" valign="top"><span style="font-size:20px;">🏢</span></td>
                      <td>
                        <p style="color:#FFFFFF; font-weight:700; font-size:15px; margin:0 0 4px 0;">Unlimited Portfolio Listings</p>
                        <p style="color:#64748B; font-size:14px; line-height:1.5; margin:0;">Upload and manage luxury residential, commercial, and land assets with zero friction.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="30" valign="top"><span style="font-size:20px;">🌍</span></td>
                      <td>
                        <p style="color:#FFFFFF; font-weight:700; font-size:15px; margin:0 0 4px 0;">Diaspora Lead Acquisition</p>
                        <p style="color:#64748B; font-size:14px; line-height:1.5; margin:0;">Get your properties placed directly in front of high-net-worth local and international clients.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="30" valign="top"><span style="font-size:20px;">📊</span></td>
                      <td>
                        <p style="color:#FFFFFF; font-weight:700; font-size:15px; margin:0 0 4px 0;">Advanced Broker Analytics</p>
                        <p style="color:#64748B; font-size:14px; line-height:1.5; margin:0;">Track property views, client inquiries, and transaction metrics in real-time.</p>
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
                     Launch Broker Console
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td align="center" style="padding:30px; background:#0F172A; color:#64748B; border-top:1px solid rgba(255,255,255,0.05);">
            <p style="margin:0; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#94A3B8;">Rentals. Sovereign Real Estate</p>
            <p style="margin:8px 0 0 0; font-size:12px; color:#475569;">Partner Communications • 2026 Edition</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    await transporter.sendMail({
      from: '"Rentals" <success@rentalsafrica.com>',
      to: email,
      subject: 'Account Upgraded: Verified Realtor Credentials Active',
      html: htmlContent,
    });
    
    console.log(`✅ Agency Upgrade email dispatched to ${name}`);
  } catch (error) {
    console.error('❌ Agency Upgrade email pipeline fault:', error);
  }
};