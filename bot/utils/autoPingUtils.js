import fs from 'fs';
import path from 'path';

const autopingFilePath = path.join(process.cwd(), 'botdata', 'autoping.json');

export function loadAutoPingData() {
    if (!fs.existsSync(autopingFilePath)) {
        fs.writeFileSync(autopingFilePath, JSON.stringify({}));
    }
    const data = fs.readFileSync(autopingFilePath, 'utf8');
    return JSON.parse(data);
}

export function saveAutoPingData(data) {
    fs.writeFileSync(autopingFilePath, JSON.stringify(data, null, 4));
}

export const activePings = new Map();

export function startAutoPing(channel, intervalInMinutes) {
    const intervalInMs = intervalInMinutes * 60000

    const ping = async () => {
        try {
            const message = await channel.send(`@everyone`);
            setTimeout(() => message.delete().catch(console.error), 1000);
        } catch (error) {
            console.error('Failed to send ping message:', error);
        }
    };

    const intervalId = setInterval(ping, intervalInMs);
    activePings.set(channel.id, intervalId);
    ping();
}