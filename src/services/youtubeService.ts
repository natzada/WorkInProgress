const YOUTUBE_API_KEY = 'AIzaSyDMIk1m_BlFVHZhAzEItDfKyvKGr7uPg80'; 
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/videos';

export interface YouTubeVideoInfo {
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
}

export const youtubeService = {
  async getVideoInfo(videoId: string): Promise<YouTubeVideoInfo | null> {
    try {
      const response = await fetch(
        `${YOUTUBE_API_URL}?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch video info');
      
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const snippet = data.items[0].snippet;
        return {
          title: snippet.title,
          description: snippet.description,
          thumbnail: snippet.thumbnails.high?.url || snippet.thumbnails.default.url,
          channelTitle: snippet.channelTitle,
          publishedAt: snippet.publishedAt
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching YouTube video info:', error);
      return null;
    }
  }
};