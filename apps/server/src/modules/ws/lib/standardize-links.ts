export const normalizeLink = (input: string) => {
    try {
        let urlStr = input;
        if (!urlStr.startsWith("http")) urlStr = `https://${urlStr}`;

        const url = new URL(urlStr);
        let videoId = "";

        if (url.hostname.includes("youtube.com")) {
            videoId = url.searchParams.get("v") || "";
        } 

        else if (url.hostname.includes("youtu.be")) {
            videoId = url.pathname.slice(1);
        }

        if (videoId) return `https://youtu.be/${videoId}`;
        
        return input;
    } catch (e) {
        return input;
    }
};