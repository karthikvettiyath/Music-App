
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const generateToken = (req, res) => {
    const { channelName, uid, role } = req.body;
    const appID = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appID || !appCertificate) {
        return res.status(500).json({ error: 'Agora credentials missing in server' });
    }
    if (!channelName) {
        return res.status(400).json({ error: 'channel name is required' });
    }

    // Role: 1 for Host (Broadcaster), 2 for Audience (Subscriber)
    // Default to publisher if not specified (e.g. for student who might need to speak? Actually standard is 2 for request-to-speak but for now let's be loose)
    // Let's stick to standard: 1 = RtcRole.PUBLISHER, 2 = RtcRole.SUBSCRIBER
    // If req.body.role is 'publisher', we use PUBLISHER, else SUBSCRIBER
    const userRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    // Token expiration time in seconds (e.g., 1 hour)
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // Build token. uid can be 0 (for Agora to assign) or user ID. 
    // We will use 0 for simplicity if not provided.
    const userUid = uid || 0;

    const token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, userUid, userRole, privilegeExpiredTs);

    res.json({ token, channelName, uid: userUid });
};

module.exports = { generateToken };
