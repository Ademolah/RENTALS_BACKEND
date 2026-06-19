import nodemailer from 'nodemailer';

/**
 * Dispatches an ultra-premium operational onboarding alert to a user when their hotel application is approved
 * @param {string} businessName - The verified hotel entity trade name
 * @param {string} userEmail - The destination inbox address of the account owner
 * @param {string} firstName - The given name of the upgraded user
 */
export const sendUpgradeToHotelEmail = async (businessName, userEmail, firstName) => {
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

    const hotelName = businessName || 'Verified Hotel Partner';
    const name = firstName || 'Partner';

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Hospitality Portal Activated: ${hotelName}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif !important; }
        p, h1, h2, h3 { margin: 0; }
      </style>
    </head>
    <body style="margin:0; padding:0; background-color:#0F172A; color:#E2E8F0; -webkit-font-smoothing:antialiased;">
      
      <!-- Hidden System Preheader -->
      <div style="display:none; font-size:1px; color:#0F172A; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
        Corporate compliance verification clear. Your luxury hospitality engine is fully online.
      </div>

      <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin: 40px auto; background:#1E293B; border-radius:24px; overflow:hidden; border: 1px solid rgba(245,158,11,0.15); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
        
        <!-- HEADER MODULE -->
        <tr>
          <td style="padding:40px 40px 30px 40px; background: #0F172A; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td valign="middle">
                  <div style="display:inline-block; width:36px; height:36px; background:linear-gradient(135deg, #F59E0B 0%, #D97706 100%); border-radius:10px; text-align:center; line-height:36px; vertical-align:middle; margin-right:12px; box-shadow: 0 4px 10px rgba(245,158,11,0.3);">
                    <span style="color:#0F172A; font-weight:900; font-size:20px; font-style:italic;">R</span>
                  </div>
                  <span style="color:#FFFFFF; font-weight:800; font-size:26px; tracking-tight; vertical-align:middle; letter-spacing:-0.5px;">Rentals<span style="color:#F59E0B;">.</span></span>
                </td>
                <td align="right" valign="middle">
                  <span style="font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:2px; color:#F59E0B; background:rgba(245,158,11,0.1); padding:6px 12px; border-radius:100px; border:1px solid rgba(245,158,11,0.2);">Hotel Vendor</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- BODY CONTENT -->
        <tr>
          <td style="padding:40px;">
            <h1 style="font-size:28px; font-weight:800; letter-spacing:-1px; margin:0; color:#FFFFFF; line-height:1.3;">
              Hospitality Engine <span style="color:#F59E0B;">Activated</span>.
            </h1>
            <p style="margin:20px 0 0 0; font-size:16px; line-height:1.6; color:#94A3B8;">
              Greetings <strong style="color:#FFFFFF;">${name}</strong>, your credential ledger audit is complete. Your corporate entity profile for <strong style="color:#F59E0B;">${hotelName}</strong> has been officially elevated to Verified Vendor status across our network infrastructure.
            </p>
            
            <!-- HOSPITALITY CAPABILITIES CARD -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0; background: #0F172A; border-radius: 16px; padding: 24px; border: 1px solid rgba(245,158,11,0.1);">
              <tr>
                <td style="padding-bottom: 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="34" valign="top"><span style="font-size:22px; line-height:1;">🛎️</span></td>
                      <td>
                        <p style="color:#FFFFFF; font-weight:700; font-size:15px; margin:0 0 4px 0;">Suite & Allocation Management</p>
                        <p style="color:#64748B; font-size:14px; line-height:1.5; margin:0;">Configure custom rooms, room tiers, luxury premium variations, and custom property amenity matrices flawlessly.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="34" valign="top"><span style="font-size:22px; line-height:1;">📅</span></td>
                      <td>
                        <p style="color:#FFFFFF; font-weight:700; font-size:15px; margin:0 0 4px 0;">Live Dynamic Reservation Ledger</p>
                        <p style="color:#64748B; font-size:14px; line-height:1.5; margin:0;">Control guest bookings, process reservations, check spatial availability, and oversee live user calendars.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="34" valign="top"><span style="font-size:22px; line-height:1;">💎</span></td>
                      <td>
                        <p style="color:#FFFFFF; font-weight:700; font-size:15px; margin:0 0 4px 0;">Premium Hospitality Analytics</p>
                        <p style="color:#64748B; font-size:14px; line-height:1.5; margin:0;">Track booking volumes, operational metrics, guest feedback loops, and multi-channel revenue data pipelines in real-time.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            
            <!-- ACTION VECTOR -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="https://www.rentalsafrica.com" 
                     style="display:inline-block; padding:18px 40px; background:#F59E0B; color:#0F172A; text-decoration:none; border-radius:12px; font-size:15px; font-weight:800; letter-spacing:0.5px; box-shadow: 0 8px 20px rgba(245, 158, 11, 0.25);">
                     Launch Vendor Console
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER METADATA -->
        <tr>
          <td align="center" style="padding:30px; background:#0F172A; color:#64748B; border-top:1px solid rgba(255,255,255,0.05);">
            <p style="margin:0; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#94A3B8;">Rentals. Sovereign Hospitality Collective</p>
            <p style="margin:8px 0 0 0; font-size:12px; color:#475569;">Vendor Onboarding System • 2026 Edition</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    await transporter.sendMail({
      from: '"Rentals" <support@rentalsafrica.com>',
      to: userEmail,
      subject: `🎉 Application Approved: Welcome to Rentals, ${hotelName}!`,
      html: htmlContent,
    });
    
    console.log(`✅ Luxury hotel onboarding alert dispatched cleanly for ${hotelName} to ${userEmail}`);
  } catch (error) {
    console.error('❌ Luxury hotel onboarding email pipeline fault:', error);
  }
};