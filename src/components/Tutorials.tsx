/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-escape */
// src/components/Tutorials.tsx
import React, { useState, useEffect } from "react";
import Icon from "@mdi/react";
import { mdiHeartOutline, mdiHeart } from "@mdi/js";
import { educationalContentService, type EducationalContent } from "../services/educationalContentService";
import { youtubeService, type YouTubeVideoInfo } from "../services/youtubeService";
import LoadingPage from "./LoadingPage";
import { useLoadingDelay } from "../hooks/useLoadingDelay";

interface VideoRating {
  videoId: number;
  rating: number;
}

interface VideoWithYouTubeInfo extends EducationalContent {
  youtubeInfo?: YouTubeVideoInfo;
  isLoadingInfo: boolean;
}

const Tutorials: React.FC = () => {
  const isLoadingDelay = useLoadingDelay(1000);
  const [videos, setVideos] = useState<VideoWithYouTubeInfo[]>([]);
  const [likedVideos, setLikedVideos] = useState<number[]>([]);
  const [videoRatings, setVideoRatings] = useState<VideoRating[]>([]);

  useEffect(() => {
    if (!isLoadingDelay) {
      loadVideos();
    }
  }, [isLoadingDelay]);

  const loadVideos = async () => {
    try {
      const contents = await educationalContentService.getAllContents();
      
      let videosToSet: VideoWithYouTubeInfo[];
      
      if (contents.length === 0) {
        videosToSet = getMockVideos().map(video => ({
          ...video,
          isLoadingInfo: true
        }));
      } else {
        videosToSet = contents.map(video => ({
          ...video,
          isLoadingInfo: true
        }));
      }
      
      setVideos(videosToSet);
      
      loadYouTubeInfo(videosToSet);
    } catch (error) {
      console.error('Error loading videos:', error);
      const mockVideos = getMockVideos().map(video => ({
        ...video,
        isLoadingInfo: false
      }));
      setVideos(mockVideos);
    }
  };

  const loadYouTubeInfo = async (videosList: VideoWithYouTubeInfo[]) => {
    const updatedVideos = [...videosList];
    
    for (let i = 0; i < updatedVideos.length; i++) {
      const video = updatedVideos[i];
      const videoId = getYouTubeId(video.url);
      
      if (videoId) {
        try {
          const youtubeInfo = await youtubeService.getVideoInfo(videoId);
          if (youtubeInfo) {
            updatedVideos[i] = {
              ...video,
              youtubeInfo,
              isLoadingInfo: false
            };
            setVideos([...updatedVideos]);
          }
        } catch (error) {
          console.error(`Error loading info for video ${videoId}:`, error);
          updatedVideos[i] = {
            ...video,
            isLoadingInfo: false
          };
          setVideos([...updatedVideos]);
        }
      }
    }
  };

  const getMockVideos = (): EducationalContent[] => {
    return [
      {
        id: 1,
        title: "Video 1",
        category: "$8 - 1.2 miles away",
        description: "Supporting line text items (puan dolor sit amet, consectetur...)",
        url: "https://youtu.be/69l-iaw_Vz0?si=NCMt0rKoVgyz_iAD"
      },
      {
        id: 2,
        title: "Video 2",
        category: "$9 - 1.2 miles away",
        description: "Supporting line text items (puan dolor sit amet, consectetur...)",
        url: "https://youtu.be/SvT6kOjwyRw?si=9DGxzHlIIDJAxPk0"
      },
      {
        id: 3,
        title: "Video 3",
        category: "$9 - 1.2 miles away",
        description: "Supporting line text items (puan dolor sit amet, consectetur...)",
        url: "https://youtu.be/eOSpCe1xdjw?si=jLWBcHqOnze03ltQ"
      },
    ];
  };

  const handleLike = (videoId: number) => {
    setLikedVideos(prev =>
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleRating = (videoId: number, rating: number) => {
    setVideoRatings(prev => {
      const existingRating = prev.find(r => r.videoId === videoId);
      
      if (existingRating) {
        if (existingRating.rating === rating) {
          return prev.filter(r => r.videoId !== videoId);
        }
        return prev.map(r => 
          r.videoId === videoId ? { ...r, rating } : r
        );
      } else {
        return [...prev, { videoId, rating }];
      }
    });
  };

  const getVideoRating = (videoId: number): number => {
    const rating = videoRatings.find(r => r.videoId === videoId);
    return rating ? rating.rating : 0;
  };

  const renderStars = (videoId: number) => {
    const currentRating = getVideoRating(videoId);
    
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= currentRating;
      
      return (
        <button
          key={starValue}
          onClick={() => handleRating(videoId, starValue)}
          className="focus:outline-none text-lg transition-transform hover:scale-110"
          aria-label={`Avaliar com ${starValue} estrelas`}
        >
          {isFilled ? "★" : "☆"}
        </button>
      );
    });
  };

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  if (isLoadingDelay) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-8">
      <div className="w-full max-w-5xl p-10 rounded-4xl bg-placeholder">
        <h1 className="font-extrabold text-4xl mb-8">Tutoriais</h1>
        
        {/* Video Principal */}
        <div className="mb-8">
          <iframe
            className="rounded-4xl w-full aspect-video h-100"
            src="https://www.youtube.com/embed/lDH7qc__b1c?si=xPv0J9OsRYMuoKdd"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>

        {/* Lista de Videos */}
        <div className="space-y-6">
          {videos.map((video) => {
            const isLiked = likedVideos.includes(video.id);
            const videoId = getYouTubeId(video.url);
            const currentRating = getVideoRating(video.id);

            const displayTitle = video.youtubeInfo?.title || video.title;
            const displayDescription = video.youtubeInfo?.description 
              ? video.youtubeInfo.description.substring(0, 100) + "..."
              : video.description;

            return (
              <div key={video.id} className="flex items-start border-b-2 pb-6 border-black/30 last:border-b-0">
                {videoId && (
                  <img
                    src={video.youtubeInfo?.thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                    alt={displayTitle}
                    className="rounded-2xl w-32 h-32 object-cover flex-shrink-0"
                  />
                )}
                
                <div className="ml-5 flex-grow">
                  <a 
                    href={video.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-2xl font-semibold hover:text-blue-600 block mb-2"
                  >
                    {displayTitle}
                  </a>
                  <p className="text-sm text-neutral-600 font-medium mb-1">
                    {video.category}
                  </p>
                  <p className="text-neutral-600 italic text-sm">
                    {displayDescription || "Supporting line text items (puan dolor sit amet, consectetur...)"}
                  </p>
                </div>

                <div className="flex items-center space-y-2 ml-4">
                  <div className="flex text-neutral-700 text-lg mr-4">
                    {renderStars(video.id)}
                  </div>
                  <button 
                    onClick={() => handleLike(video.id)} 
                    className="focus:outline-none hover:scale-110 transition-transform"
                  >
                    <Icon 
                      path={isLiked ? mdiHeart : mdiHeartOutline} 
                      size={1} 
                      color={isLiked ? "#404040" : "#404040"} 
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Tutorials;