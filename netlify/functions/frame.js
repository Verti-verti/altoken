// Farcaster Frame API endpoint for Netlify
// Handles POST requests from frame button interactions

exports.handler = async (event, context) => {
    // Parse the request
    const { httpMethod, body, headers } = event;
    
    // Set CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };
    
    // Handle preflight requests
    if (httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: ''
        };
    }
    
    // Only allow POST requests
    if (httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
    
    try {
        // Parse the frame data from the request body
        const frameData = JSON.parse(body || '{}');
        const { untrustedData, trustedData } = frameData;
        
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
                        image: "https://via.placeholder.com/1200x630/6366f1/ffffff?text=Altoken+Frame",
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
                        image: "https://via.placeholder.com/1200x630/10b981/ffffff?text=View+Surveys",
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
                        image: "https://via.placeholder.com/1200x630/f59e0b/ffffff?text=Create+Survey",
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
                        image: "https://via.placeholder.com/1200x630/6366f1/ffffff?text=Altoken+Frame",
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
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(response)
        };
        
    } catch (error) {
        console.error('Frame API error:', error);
        
        // Return error response
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                frame: {
                    version: "vNext",
                    image: "https://via.placeholder.com/1200x630/ef4444/ffffff?text=Error",
                    buttons: [
                        { label: "Try Again", action: "post" }
                    ],
                    post_url: "https://altoken.netlify.app/api/frame"
                }
            })
        };
    }
};