// Farcaster Frame API endpoint
// Handles POST requests from frame button interactions

export default async function handler(req, res) {
    // Set CORS headers for Farcaster
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        // Parse the frame data from the request body
        const { untrustedData, trustedData } = req.body;
        
        console.log('Frame interaction received:', {
            untrustedData,
            trustedData
        });
        
        // Extract button index and user info
        const buttonIndex = untrustedData?.buttonIndex || 1;
        const fid = untrustedData?.fid;
        const username = untrustedData?.username;
        
        // Handle different button actions
        let response;
        
        switch (buttonIndex) {
            case 1: // Refresh button
                response = {
                    frame: {
                        version: "vNext",
                        image: "https://altoken.netlify.app/next-image.png",
                        buttons: [
                            { label: "Refresh", action: "post" },
                            { label: "View Surveys", action: "post" },
                            { label: "Create Survey", action: "post" }
                        ],
                        post_url: "https://altoken.netlify.app/api/frame"
                    }
                };
                break;
                
            case 2: // View Surveys button
                response = {
                    frame: {
                        version: "vNext",
                        image: "https://altoken.netlify.app/surveys-image.png",
                        buttons: [
                            { label: "Back", action: "post" },
                            { label: "Vote Now", action: "post" }
                        ],
                        post_url: "https://altoken.netlify.app/api/frame"
                    }
                };
                break;
                
            case 3: // Create Survey button
                response = {
                    frame: {
                        version: "vNext",
                        image: "https://altoken.netlify.app/create-image.png",
                        buttons: [
                            { label: "Back", action: "post" },
                            { label: "Generate AI Survey", action: "post" }
                        ],
                        post_url: "https://altoken.netlify.app/api/frame"
                    }
                };
                break;
                
            default:
                // Default refresh response
                response = {
                    frame: {
                        version: "vNext",
                        image: "https://altoken.netlify.app/next-image.png",
                        buttons: [
                            { label: "Refresh", action: "post" }
                        ],
                        post_url: "https://altoken.netlify.app/api/frame"
                    }
                };
        }
        
        // Log the interaction for analytics
        console.log(`Frame interaction: Button ${buttonIndex} clicked by user ${username} (FID: ${fid})`);
        
        // Return the frame response
        return res.status(200).json(response);
        
    } catch (error) {
        console.error('Frame API error:', error);
        
        // Return error response
        return res.status(500).json({
            frame: {
                version: "vNext",
                image: "https://altoken.netlify.app/error-image.png",
                buttons: [
                    { label: "Try Again", action: "post" }
                ],
                post_url: "https://altoken.netlify.app/api/frame"
            }
        });
    }
}
