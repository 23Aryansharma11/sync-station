interface YouTubeOEmbed {
    title?: string;
    thumbnail_url?: string;
    author_name?: string;
}

export async function getYoutubeData(videoUrl: string) {
    try {
        const url = `https://www.youtube.com/oembed?url=${videoUrl}&format=json`;
        const res = await fetch(url);
        
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json() as YouTubeOEmbed;

        return {
            title: data.title || "Unknown Title",
            thumbnail: data.thumbnail_url || "" 
        };
    } catch (e) {
        return { 
            title: "Unknown Title", 
            thumbnail: "" 
        };
    }
}