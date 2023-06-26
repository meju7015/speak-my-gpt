import { Router } from 'express';

const router = Router();

router.get('/slack/events', (req, res) => {
    const slackEvent = req.body;

    if (slackEvent.type === 'event_callback') {
        const message = slackEvent.event.text;
        const user = slackEvent.event.user;
        const channel = slackEvent.event.channel;

        console.log(`Received a message event: user ${user} in channel ${channel} says ${message}`);
    }

    res.sendStatus(200);
})

export default router;
