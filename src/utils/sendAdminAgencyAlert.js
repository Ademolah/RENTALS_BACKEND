import nodemailer from 'nodemailer';

/**
 * Dispatches an internal operational alert to Super Admins for new agency reviews
 * @param {string} adminEmail - The destination address of the SUPERADMIN
 * @param {Object} agencyData - The newly created agency document
 * @param {Object} applicantData - The user who submitted the application
 */
export const sendAdminAgencyAlert = async (adminEmail, agencyData, applicantData) => {
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

    // Safely extract data with fallbacks
    const corporateName = agencyData.corporateName || 'N/A';
    const cacNumber = agencyData.cacNumber || 'N/A';
    const hqAddress = agencyData.hqAddress || 'N/A';
    const applicantName = `${applicantData.firstName} ${applicantData.lastName}` || 'N/A';
    const applicantEmail = applicantData.email || 'N/A';

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Admin Alert: New Agency Registration</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif !important; }
        p, h1, h2, h3 { margin: 0; }
      </style>
    </head>
    <body style="margin:0; padding:0; background-color:#0F172A; color:#E2E8F0; -webkit-font-smoothing:antialiased;">
      
      <!-- Hidden Preheader -->
      <div style="display:none; font-size:1px; color:#0F172A; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
        Action Required: A new corporate agency application for ${corporateName} is pending review.
      </div>

      <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin: 40px auto; background:#1E293B; border-radius:24px; overflow:hidden; border: 1px solid rgba(148,163,184,0.15); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
        
        <!-- HEADER -->
        <tr>
          <td style="padding:30px 40px; background: #0F172A; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td valign="middle">
                  <span style="color:#FFFFFF; font-weight:800; font-size:22px; tracking-tight;">Rentals<span style="color:#38BDF8;">.</span> Admin</span>
                </td>
                <td align="right" valign="middle">
                  <span style="font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:2px; color:#38BDF8; background:rgba(56,189,248,0.1); padding:6px 12px; border-radius:100px; border:1px solid rgba(56,189,248,0.2);">Pending Review</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- MAIN BODY -->
        <tr>
          <td style="padding:40px;">
            <h1 style="font-size:24px; font-weight:800; letter-spacing:-0.5px; margin:0; color:#FFFFFF; line-height:1.3;">
              New Corporate Application
            </h1>
            <p style="margin:16px 0 0 0; font-size:15px; line-height:1.6; color:#94A3B8;">
              A new agency has submitted their credentials to join the network. Please review the corporate documentation and determine their verified status.
            </p>
            
            <!-- DATA CARD: REGISTRATION DETAILS -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0; background: #0F172A; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); overflow: hidden;">
              <tr>
                <td style="padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <p style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#64748B; margin-bottom:4px;">Corporate Entity</p>
                  <p style="font-size:16px; font-weight:600; color:#FFFFFF;">${corporateName}</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <p style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#64748B; margin-bottom:4px;">Registration ID (CAC)</p>
                  <p style="font-size:16px; font-weight:600; color:#E2E8F0; font-family: monospace;">${cacNumber}</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <p style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#64748B; margin-bottom:4px;">Headquarters</p>
                  <p style="font-size:15px; font-weight:500; color:#E2E8F0;">${hqAddress}</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; background: rgba(56,189,248,0.03);">
                  <p style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#64748B; margin-bottom:4px;">Submitted By</p>
                  <p style="font-size:15px; font-weight:500; color:#E2E8F0;">${applicantName} <span style="color:#64748B;">(${applicantEmail})</span></p>
                </td>
              </tr>
            </table>
            
            <!-- CALL TO ACTION -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <!-- Adjust the href to point to your actual admin dashboard route -->
                  <a href="https://www.rentalsafrica.com" 
                     style="display:inline-block; padding:16px 36px; background:#FFFFFF; color:#0F172A; text-decoration:none; border-radius:10px; font-size:14px; font-weight:700; letter-spacing:0.5px; box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15);">
                     Review Application in Dashboard
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td align="center" style="padding:24px; background:#0F172A; color:#64748B; border-top:1px solid rgba(255,255,255,0.05);">
            <p style="margin:0; font-size:11px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:#64748B;">Internal Operational Alert • Rentals.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    await transporter.sendMail({
      from: '"Rentals. Operations" <alerts@rentalsafrica.com>',
      to: adminEmail,
      subject: `Action Required: Agency Registration - ${corporateName}`,
      html: htmlContent,
    });
    
    console.log(`✅ Admin alert dispatched for ${corporateName} to ${adminEmail}`);
  } catch (error) {
    console.error('❌ Admin alert email pipeline fault:', error);
  }
};