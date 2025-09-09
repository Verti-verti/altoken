// Image generation utilities for Farcaster frames
// This creates simple placeholder images for different frame states

export function generateFrameImage(type, data = {}) {
    const baseUrl = 'https://altoken.netlify.app';
    
    switch (type) {
        case 'next':
            return `${baseUrl}/next-image.png`;
        case 'surveys':
            return `${baseUrl}/surveys-image.png`;
        case 'create':
            return `${baseUrl}/create-image.png`;
        case 'error':
            return `${baseUrl}/error-image.png`;
        default:
            return `${baseUrl}/next-image.png`;
    }
}

// Frame response templates
export const frameTemplates = {
    initial: {
        frame: {
            version: "vNext",
            image: "https://altoken.netlify.app/next-image.png",
            buttons: [
                { label: "Refresh", action: "post" }
            ],
            post_url: "https://altoken.netlify.app/api/frame"
        }
    },
    
    surveys: {
        frame: {
            version: "vNext",
            image: "https://altoken.netlify.app/surveys-image.png",
            buttons: [
                { label: "Back", action: "post" },
                { label: "Vote Now", action: "post" }
            ],
            post_url: "https://altoken.netlify.app/api/frame"
        }
    },
    
    create: {
        frame: {
            version: "vNext",
            image: "https://altoken.netlify.app/create-image.png",
            buttons: [
                { label: "Back", action: "post" },
                { label: "Generate AI Survey", action: "post" }
            ],
            post_url: "https://altoken.netlify.app/api/frame"
        }
    },
    
    error: {
        frame: {
            version: "vNext",
            image: "https://altoken.netlify.app/error-image.png",
            buttons: [
                { label: "Try Again", action: "post" }
            ],
            post_url: "https://altoken.netlify.app/api/frame"
        }
    }
};
