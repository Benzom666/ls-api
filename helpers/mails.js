const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async function sendMail(mailOptions, callBack) {
  try {
    const msg = {
      to: mailOptions.to,
      from: process.env.MAIL_FROM || process.env.MAIL_ID_FROM,
      subject: mailOptions.subject,
      html: mailOptions.html || mailOptions.text,
      text: mailOptions.text || undefined,
    };
    const [response] = await sgMail.send(msg);
    if (callBack) callBack(null, response);
    return response;
  } catch (err) {
    if (callBack) callBack(err);
    throw err;
  }
};
