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
                        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnR3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNjM2NmYxO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM4YjVjZjY7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJjb2luR3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmJiZjI0O3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmNTllMGI7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8Y2lyY2xlIGN4PSIyNTYiIGN5PSIyNTYiIHI9IjI0MCIgZmlsbD0idXJsKCNiZ0dyYWRpZW50KSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjgiLz4KICA8Y2lyY2xlIGN4PSIyNTYiIGN5PSIyMDAiIHI9IjgwIiBmaWxsPSJ1cmwoI2NvaW5HcmFkaWVudCkiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI2Ii8+CiAgPHRleHQgeD0iMjU2IiB5PSIyMTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMiIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmZmZmYiPkFMVEs8L3RleHQ+CiAgPHJlY3QgeD0iMTgwIiB5PSIzMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSI2MCIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC45Ii8+CiAgPHJlY3QgeD0iMjEwIiB5PSIzMDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSI4MCIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC45Ii8+CiAgPHJlY3QgeD0iMjQwIiB5PSIyODAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuOSIvPgogIDxyZWN0IHg9IjI3MCIgeT0iMjkwIiB3aWR0aD0iMjAiIGhlaWdodD0iOTAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuOSIvPgogIDxyZWN0IHg9IjMwMCIgeT0iMzEwIiB3aWR0aD0iMjAiIGhlaWdodD0iNzAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuOSIvPgogIDxjaXJjbGUgY3g9IjIwMCIgY3k9IjE4MCIgcj0iMjAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMyIvPgogIDxjaXJjbGUgY3g9IjMyMCIgY3k9IjIyMCIgcj0iMTUiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMiIvPgo8L3N2Zz4=",
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
                        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnR3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNjM2NmYxO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM4YjVjZjY7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJjb2luR3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmJiZjI0O3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmNTllMGI7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8Y2lyY2xlIGN4PSIyNTYiIGN5PSIyNTYiIHI9IjI0MCIgZmlsbD0idXJsKCNiZ0dyYWRpZW50KSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjgiLz4KICA8Y2lyY2xlIGN4PSIyNTYiIGN5PSIyMDAiIHI9IjgwIiBmaWxsPSJ1cmwoI2NvaW5HcmFkaWVudCkiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI2Ii8+CiAgPHRleHQgeD0iMjU2IiB5PSIyMTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMiIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmZmZmYiPkFMVEs8L3RleHQ+CiAgPHJlY3QgeD0iMTgwIiB5PSIzMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSI2MCIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC45Ii8+CiAgPHJlY3QgeD0iMjEwIiB5PSIzMDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSI4MCIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC45Ii8+CiAgPHJlY3QgeD0iMjQwIiB5PSIyODAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuOSIvPgogIDxyZWN0IHg9IjI3MCIgeT0iMjkwIiB3aWR0aD0iMjAiIGhlaWdodD0iOTAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuOSIvPgogIDxyZWN0IHg9IjMwMCIgeT0iMzEwIiB3aWR0aD0iMjAiIGhlaWdodD0iNzAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuOSIvPgogIDxjaXJjbGUgY3g9IjIwMCIgY3k9IjE4MCIgcj0iMjAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMyIvPgogIDxjaXJjbGUgY3g9IjMyMCIgY3k9IjIyMCIgcj0iMTUiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMiIvPgo8L3N2Zz4=",
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
