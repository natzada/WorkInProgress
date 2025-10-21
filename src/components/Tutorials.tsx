// src/components/Tutorials.tsx
import React, { useState, useEffect } from "react";
import Icon from "@mdi/react";
import { mdiHeartOutline, mdiHeart } from "@mdi/js";
import { educationalContentService, type EducationalContent } from "../services/educationalContentService";

const Tutorials: React.FC = () => {
  const [videos, setVideos] = useState<EducationalContent[]>([]);
  const [likedVideos, setLikedVideos] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const contents = await educationalContentService.getAllContents();
      setVideos(contents);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stars = (n: number) => {
    return "★".repeat(n) + "☆".repeat(5 - n);
  };

  const handleLike = (videoId: number) => {
    setLikedVideos(prev =>
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl">Carregando tutoriais...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-20">
      <div className="bg-placeholder w-5xl p-10 rounded-4xl">
        <h1 className="font-extrabold text-4xl">Tutoriais</h1>
        
        {/* Video principal - você pode ajustar conforme necessário */}
        <iframe
          className="rounded-4xl m-5 w-4xl"
          width="560"
          height="315"
          src="https://www.youtube.com/embed/lDH7qc__b1c?si=xPv0J9OsRYMuoKdd"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>

        <ul>
          {videos.map((video) => {
            const isLiked = likedVideos.includes(video.id);
            const videoId = video.url.split('v=')[1]?.split('&')[0]; // Extrai ID do YouTube

            return (
              <li key={video.id} className="flex border-b-2 p-5 border-black/30">
                {videoId && (
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                    alt={video.title}
                    className="rounded-2xl mt-2 w-25 h-25 object-cover"
                  />
                )}
                <div className="flex flex-col justify-around ml-5">
                  <a 
                    href={video.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-2xl hover:text-blue-600"
                  >
                    {video.title}
                  </a>
                  <p className="italic text-sm text-neutral-600">
                    {video.category}
                    <br />
                    {video.description || "Assista para aprender mais!"}
                  </p>
                </div>
                <div className="flex flex-row items-center ml-auto space-x-4">
                  <span className="text-neutral-700 text-lg">{stars(5)}</span>
                  <button 
                    onClick={() => handleLike(video.id)} 
                    className="focus:outline-none"
                  >
                    <Icon 
                      path={isLiked ? mdiHeart : mdiHeartOutline} 
                      size={0.8} 
                      color={isLiked ? "#EF4444" : "#6B7280"} 
                    />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Tutorials;