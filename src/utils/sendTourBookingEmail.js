import nodemailer from 'nodemailer';


/**
 * Dispatches a world-class, premium tour booking notification to the Agency Administrator
 * @param {Object} adminData - { name, email } of the targeted AGENCY_ADMIN
 * @param {Object} visitorData - { fullName, email, phone, clientNotes } of the explorer
 * @param {Object} scheduleData - { date, timeSlot } of the requested physical tour
 * @param {Object} propertyData - { title, id } of the viewed asset
 */
export const sendTourBookingEmail = async (adminData, visitorData, scheduleData, propertyData) => {
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

    // Formatting the date to a cleaner string format if it arrives as an ISO string
    const formattedDate = new Date(scheduleData.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Tour Booking Request</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif !important; }
    p, h1, h2, h3 { margin: 0; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#0F172A; color:#E2E8F0; -webkit-font-smoothing:antialiased;">
  
  <div style="display:none; font-size:1px; color:#0F172A; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
    A new client has scheduled an inspection for ${propertyData.title}.
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
              <span style="background: rgba(255, 107, 107, 0.1); color: #FF6B6B; font-size: 11px; font-weight: 800; padding: 6px 14px; border-radius: 30px; letter-spacing: 1px; text-transform: uppercase;">New Tour</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding:40px;">
        <h1 style="font-size:26px; font-weight:800; letter-spacing:-1px; margin:0; color:#FFFFFF; line-height:1.3;">
          Hello <span style="color:#FF6B6B;">${adminData.name}</span>, you have a new tour scheduled.
        </h1>
        <p style="margin:16px 0 0 0; font-size:15px; line-height:1.6; color:#94A3B8;">
          An explorer has requested a physical/virtual inspection for one of your listed luxury portfolio assets. Please find the verified tour details below.
        </p>
        
        <div style="margin-top: 30px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748B;">Target Asset</div>
        <p style="font-size:18px; font-weight:700; color:#FFFFFF; margin:4px 0 24px 0;">
          ${propertyData.title} <span style="font-size:13px; color:#64748B; font-weight:400;">(${propertyData.id})</span>
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="background: #0F172A; border-radius: 16px; padding: 24px; border: 1px solid rgba(255,107,107,0.1);">
          <tr>
            <td style="padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.05);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="30" valign="top"><span style="font-size:20px;">📅</span></td>
                  <td>
                    <p style="color:#64748B; font-size:12px; text-transform:uppercase; font-weight:700; margin:0 0 2px 0; letter-spacing:0.5px;">Requested Date</p>
                    <p style="color:#FFFFFF; font-weight:700; font-size:15px; margin:0;">${formattedDate}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="30" valign="top"><span style="font-size:20px;">⏰</span></td>
                  <td>
                    <p style="color:#64748B; font-size:12px; text-transform:uppercase; font-weight:700; margin:0 0 2px 0; letter-spacing:0.5px;">Preferred Window</p>
                    <p style="color:#FFFFFF; font-weight:700; font-size:15px; margin:0;">${scheduleData.timeSlot}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="30" valign="top"><span style="font-size:20px;">👤</span></td>
                  <td>
                    <p style="color:#64748B; font-size:12px; text-transform:uppercase; font-weight:700; margin:0 0 2px 0; letter-spacing:0.5px;">Prospect Profile</p>
                    <p style="color:#FFFFFF; font-weight:700; font-size:15px; margin:0;">${visitorData.fullName}</p>
                    <p style="color:#94A3B8; font-size:13px; margin:4px 0 0 0;">
                      📞 ${visitorData.phone} &nbsp;•&nbsp; ✉️ ${visitorData.email}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="30" valign="top"><span style="font-size:20px;">📝</span></td>
                  <td>
                    <p style="color:#64748B; font-size:12px; text-transform:uppercase; font-weight:700; margin:0 0 2px 0; letter-spacing:0.5px;">Client Notes</p>
                    <p style="color:#E2E8F0; font-size:14px; line-height:1.5; margin:0; font-style: ${visitorData.clientNotes ? 'normal' : 'italic'};">
                      ${visitorData.clientNotes || 'No custom requirements or notes appended to this request.'}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
          <tr>
            <td align="center">
              <a href="https://www.rentalsafrica.com/dashboard" 
                 style="display:inline-block; padding:18px 40px; background:#FF6B6B; color:#FFFFFF; text-decoration:none; border-radius:12px; font-size:15px; font-weight:700; letter-spacing:0.5px; box-shadow: 0 8px 20px rgba(255, 107, 107, 0.25);">
                 Manage Tour Request
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
            Need help routing this assignment? Contact your assigned technical account executive directly at <a href="mailto:support@rentalsafrica.com" style="color:#FF6B6B; text-decoration:none; font-weight:600;">support@rentalsafrica.com</a>
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
      from: '"Rentals Notification" <hello@rentalsafrica.com>',
      to: adminData.email,
      subject: `🚨 New Tour Request: ${propertyData.title}`,
      html: htmlContent,
    });
    
    console.log(`✅ Tour booking email dispatched safely to Agency Admin: ${adminData.email}`);
  } catch (error) {
    console.error('❌ Tour email transmission pipeline fault:', error);
  }
};