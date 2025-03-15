import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Track a key redemption for a specific server
 * @param {string} serverId The ID of the server
 * @returns {Promise<void>}
 */
export async function trackRedemption(serverId) {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        
        const possiblePaths = [
            path.join(process.cwd(), 'botdata/redemptions.json'),
            path.join(process.cwd(), '../botdata/redemptions.json'),
            path.join(__dirname, '../botdata/redemptions.json'),
            path.join(__dirname, '../../botdata/redemptions.json')
        ];
        let redemptionsPath = path.join(process.cwd(), '../botdata/redemptions.json');
        
        let redemptionData;
        let fileFound = false;
        
        for (const filePath of possiblePaths) {
            try {
                const fileContent = await fs.readFile(filePath, 'utf8');
                redemptionData = JSON.parse(fileContent);
                redemptionsPath = filePath;
                fileFound = true;
                console.log(`Found/using redemptions.json at: ${filePath}`);
                break;
            } catch (err) {

                console.log(`Couldn't access redemptions.json at: ${filePath} (${err.code})`);
            }
        }
        
        if (!fileFound) {
            console.log('No redemptions.json found, creating new data structure');
            redemptionData = { redemptions: [] };
        }        
        if (!redemptionData.redemptions) {
            console.log('No redemptions array in the data, initializing it');
            redemptionData.redemptions = [];
        }
        let serverEntry = redemptionData.redemptions.find(r => r.serverId === serverId);
        
        if (serverEntry) {
            serverEntry.count += 1;
        } else {
            redemptionData.redemptions.push({
                serverId: serverId,
                count: 1
            });
        }
        
        try {
            console.log('Saving redemption data:', JSON.stringify(redemptionData));
            await fs.writeFile(redemptionsPath, JSON.stringify(redemptionData, null, 2), 'utf8');
            console.log(`Successfully saved redemption data to ${redemptionsPath}`);
        } catch (writeError) {
            console.error(`Failed to write to ${redemptionsPath}:`, writeError);
            
            const fallbackPath = path.join(process.cwd(), 'redemptions.json');
            console.log(`Attempting to save to fallback location: ${fallbackPath}`);
            await fs.writeFile(fallbackPath, JSON.stringify(redemptionData, null, 2), 'utf8');
        }
    } catch (error) {
        console.error('Error tracking redemption:', error);
    }
}

/**
 * Get the number of redemptions for a specific server
 * @param {string} serverId The ID of the server
 * @returns {Promise<number>} The number of redemptions
 */
export async function getRedemptionCount(serverId) {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        
        const possiblePaths = [
            path.join(process.cwd(), 'botdata/redemptions.json'),
            path.join(process.cwd(), '../botdata/redemptions.json'),
            path.join(__dirname, '../botdata/redemptions.json'),
            path.join(__dirname, '../../botdata/redemptions.json')
        ];
        
        for (const filePath of possiblePaths) {
            try {
                const fileContent = await fs.readFile(filePath, 'utf8');
                const redemptionData = JSON.parse(fileContent);
                
                if (!redemptionData.redemptions) {
                    console.log(`File found at ${filePath} but no redemptions array`);
                    continue;
                }
                
                const serverEntry = redemptionData.redemptions.find(r => r.serverId === serverId);
                return serverEntry ? serverEntry.count : 0;
            } catch (err) {
            }
        }
        
        return 0;
    } catch (error) {
        console.error('Error getting redemption count:', error);
        return 0;
    }
}