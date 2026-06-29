import nodemailer from 'nodemailer';

export const sendHotelReservationEmail = async (adminData, reservationData, hotelData) => {
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

    // Formatting date matrices to classic editorial strings
    const formatConfig = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedCheckIn = new Date(reservationData.checkInDate).toLocaleDateString('en-US', formatConfig);
    const formattedCheckOut = new Date(reservationData.checkOutDate).toLocaleDateString('en-US', formatConfig);

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Premium Hospitality Reservation Confirmed</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif !important; }
    p, h1, h2, h3 { margin: 0; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#090D16; color:#E2E8F0; -webkit-font-smoothing:antialiased;">
  
  <div style="display:none; font-size:1px; color:#090D16; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
    New high-end booking manifest received for ${hotelData.title}.
  </div>

  <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin: 40px auto; background:#111827; border-radius:24px; overflow:hidden; border: 1px solid rgba(213, 176, 102, 0.15); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);">
    
    <tr>
      <td style="padding:40px 40px 30px 40px; background: #090D16; border-bottom: 1px solid rgba(255,255,255,0.03);">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td valign="middle">
              <div style="display:inline-block; width:36px; height:36px; background:linear-gradient(135deg, #D5B066 0%, #A98743 100%); border-radius:10px; text-align:center; line-height:36px; vertical-align:middle; margin-right:12px; box-shadow: 0 4px 14px rgba(213,176,102,0.2);">
                <span style="color:#090D16; font-weight:800; font-size:18px; font-style:italic;">H</span>
              </div>
              <span style="color:#FFFFFF; font-weight:800; font-size:24px; tracking-tight; vertical-align:middle; letter-spacing:-0.5px;">Rentals<span style="color:#D5B066;">Hospitality</span></span>
            </td>
            <td align="right" valign="middle">
              <span style="background: rgba(213, 176, 102, 0.1); color: #D5B066; border: 1px solid rgba(213, 176, 102, 0.2); font-size: 10px; font-weight: 800; padding: 6px 14px; border-radius: 30px; letter-spacing: 1px; text-transform: uppercase;">Reservation</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding:40px;">
        <h1 style="font-size:24px; font-weight:800; letter-spacing:-0.5px; margin:0; color:#FFFFFF; line-height:1.3;">
          Hello Manager, <span style="color:#D5B066;">Suite Allocation Initialized.</span>
        </h1>
        <p style="margin:16px 0 0 0; font-size:14px; line-height:1.6; color:#94A3B8;">
          A premium reservation payload has been securely routed through the logistics gateway for your luxury lodging asset. Review the configuration criteria below.
        </p>
        
        <div style="margin-top: 32px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #64748B;">Target Hospitality Asset</div>
        <p style="font-size:20px; font-weight:800; color:#FFFFFF; margin:4px 0 24px 0; letter-spacing: -0.5px;">
          ${hotelData.title} <span style="font-size:13px; color:#D5B066; font-weight:600; background: rgba(213,176,102,0.08); padding: 2px 8px; border-radius: 4px; margin-left: 6px;">${hotelData.locality}, ${hotelData.state}</span>
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="background: #090D16; border-radius: 16px; padding: 24px; border: 1px solid rgba(255,255,255,0.03);">
          
          <tr>
            <td style="padding-bottom: 18px; border-b: 1px solid rgba(255,255,255,0.05);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="30" valign="top"><span style="font-size:18px;">🔑</span></td>
                  <td>
                    <p style="color:#64748B; font-size:11px; text-transform:uppercase; font-weight:700; margin:0 0 2px 0; letter-spacing:0.5px;">Suite Architecture</p>
                    <p style="color:#FFFFFF; font-weight:700; font-size:15px; margin:0;">${reservationData.roomTypeName}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 18px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="30" valign="top"><span style="font-size:18px;">📅</span></td>
                  <td>
                    <p style="color:#64748B; font-size:11px; text-transform:uppercase; font-weight:700; margin:0 0 4px 0; letter-spacing:0.5px;">Timeline Profile</p>
                    <p style="color:#FFFFFF; font-weight:600; font-size:14px; margin:0;">
                      Check-In: <span style="font-weight:700; color:#D5B066;">${formattedCheckIn}</span>
                    </p>
                    <p style="color:#FFFFFF; font-weight:600; font-size:14px; margin:4px 0 0 0;">
                      Check-Out: <span style="font-weight:700; color:#D5B066;">${formattedCheckOut}</span>
                    </p>
                    <p style="color:#94A3B8; font-size:12px; margin:6px 0 0 0; font-style:italic;">
                      Total Occupancy Window: ${reservationData.numberOfNights} Nights
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 18px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="30" valign="top"><span style="font-size:18px;">👤</span></td>
                  <td>
                    <p style="color:#64748B; font-size:11px; text-transform:uppercase; font-weight:700; margin:0 0 2px 0; letter-spacing:0.5px;">Primary Guest</p>
                    <p style="color:#FFFFFF; font-weight:700; font-size:15px; margin:0;">${reservationData.guestName}</p>
                    <p style="color:#94A3B8; font-size:13px; margin:4px 0 0 0; font-mono">
                      📞 ${reservationData.guestPhone} &nbsp;•&nbsp; ✉️ ${reservationData.guestEmail}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 18px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="30" valign="top"><span style="font-size:18px;">💳</span></td>
                  <td>
                    <p style="color:#64748B; font-size:11px; text-transform:uppercase; font-weight:700; margin:0 0 4px 0; letter-spacing:0.5px;">Financial Matrix</p>
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px; color:#94A3B8;">
                      <tr>
                        <td style="padding: 2px 0;">Nightly Tier Rate:</td>
                        <td align="right" style="color:#FFFFFF; font-weight:600;">₦${reservationData.pricePerNight.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0 2px 0; color:#FFFFFF; font-weight:700; font-size:14px;">Total Ledger Vault:</td>
                        <td align="right" style="color:#D5B066; font-weight:800; font-size:16px;">₦${reservationData.totalAmount.toLocaleString()}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding-top: 18px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="30" valign="top"><span style="font-size:18px;">🥂</span></td>
                  <td>
                    <p style="color:#64748B; font-size:11px; text-transform:uppercase; font-weight:700; margin:0 0 2px 0; letter-spacing:0.5px;">Concierge Notes</p>
                    <p style="color:#E2E8F0; font-size:13px; line-height:1.5; margin:0; font-style: ${reservationData.specialRequests ? 'normal' : 'italic'};">
                      ${reservationData.specialRequests || 'No bespoke accommodations or adjustments appended.'}
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
              <a href="https://www.rentalsafrica.com/dashboard/hospitality" 
                 style="display:inline-block; padding:16px 40px; background:linear-gradient(135deg, #D5B066 0%, #A98743 100%); color:#090D16; text-decoration:none; border-radius:12px; font-size:14px; font-weight:800; letter-spacing:0.5px; box-shadow: 0 8px 24px rgba(213, 176, 102, 0.2);">
                 Access Management Matrix
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding:0 40px 40px 40px;">
        <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.03); border-radius: 12px; padding: 20px; text-align: center;">
          <p style="margin:0; font-size:12px; color:#94A3B8; line-height: 1.5;">
            Need help routing this assignment? Contact your assigned technical account executive directly at <a href="mailto:support@rentalsafrica.com" style="color:#D5B066; text-decoration:none; font-weight:600;">support@rentalsafrica.com</a>
          </p>
        </div>
      </td>
    </tr>

    <tr>
      <td align="center" style="padding:30px; background:#090D16; color:#64748B; border-top:1px solid rgba(255,255,255,0.03);">
        <p style="margin:0; font-size:10px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; color:#94A3B8;">Rentals Africa Hospitality</p>
        <p style="margin:6px 0 0 0; font-size:11px; color:#475569;">Lagos • Abuja • Africa • 2026 Premium Edition</p>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Dispatch the notification matrix
    await transporter.sendMail({
      from: '"Rentals Hospitality Network" <hello@rentalsafrica.com>',
      to: adminData.email,
      subject: `🏨Booking Alert: ${hotelData.title} — Room Allocated`,
      html: htmlContent,
    });
    
    console.log(`✅ Luxury reservation email dispatched safely to Hotel Admin: ${adminData.email}`);
  } catch (error) {
    console.error('❌ Hospitality email transmission pipeline fault:', error);
  }
};