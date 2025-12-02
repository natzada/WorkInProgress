/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-escape */
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
  const [isRestored, setIsRestored] = useState(false); // marca se já restauramos do localStorage

  // ✅ 1. Ao montar o componente — restaura curtidas/avaliações salvas
  useEffect(() => {
    const savedLikes = localStorage.getItem("likedVideos");
    const savedRatings = localStorage.getItem("videoRatings");

    if (savedLikes) {
      try {
        setLikedVideos(JSON.parse(savedLikes));
      } catch {
        console.warn("likedVideos no localStorage não é JSON válido");
      }
    }

    if (savedRatings) {
      try {
        setVideoRatings(JSON.parse(savedRatings));
      } catch {
        console.warn("videoRatings no localStorage não é JSON válido");
      }
    }

    setIsRestored(true);
  }, []); // rodar apenas uma vez no mount

  // ✅ 2. Depois que o delay de loading passar E depois da restauração — carregamos os vídeos
  useEffect(() => {
    if (!isLoadingDelay && isRestored) {
      loadVideos();
    }
  }, [isLoadingDelay, isRestored]);

  // ✅ 3. Sempre que likedVideos mudar, salvamos no localStorage (após restauração)
  useEffect(() => {
    if (isRestored) {
      localStorage.setItem("likedVideos", JSON.stringify(likedVideos));
    }
  }, [likedVideos, isRestored]);

  // ✅ 4. Sempre que videoRatings mudar, salvamos no localStorage (após restauração)
  useEffect(() => {
    if (isRestored) {
      localStorage.setItem("videoRatings", JSON.stringify(videoRatings));
    }
  }, [videoRatings, isRestored]);

  const loadVideos = async () => {
    try {
      const contents = await educationalContentService.getAllContents();

      const videosToSet = contents.length === 0
        ? getMockVideos().map(v => ({ ...v, isLoadingInfo: true }))
        : contents.map(v => ({ ...v, isLoadingInfo: true }));

      setVideos(videosToSet);
      loadYouTubeInfo(videosToSet);
    } catch (error) {
      console.error("Error loading videos:", error);
      const mockVideos = getMockVideos().map(v => ({ ...v, isLoadingInfo: false }));
      setVideos(mockVideos);
    }
  };

  const loadYouTubeInfo = async (videosList: VideoWithYouTubeInfo[]) => {
    const updated = [...videosList];
    for (let i = 0; i < updated.length; i++) {
      const id = getYouTubeId(updated[i].url);
      if (!id) continue;

      try {
        const info = await youtubeService.getVideoInfo(id);
        updated[i] = { ...updated[i], youtubeInfo: info, isLoadingInfo: false };
        setVideos([...updated]);
      } catch (error) {
        console.error(`Error loading info for video ${id}:`, error);
        updated[i] = { ...updated[i], isLoadingInfo: false };
        setVideos([...updated]);
      }
    }
  };

  const getMockVideos = (): EducationalContent[] => [
    {
      id: 1,
      title: "Video 1",
      category: "$8 - 1.2 miles away",
      description: "Supporting line text items...",
      url: "https://youtu.be/69l-iaw_Vz0?si=NCMt0rKoVgyz_iAD"
    },
    {
      id: 2,
      title: "Video 2",
      category: "$9 - 1.2 miles away",
      description: "Supporting line text items...",
      url: "https://youtu.be/SvT6kOjwyRw?si=9DGxzHlIIDJAxPk0"
    },
    {
      id: 3,
      title: "Video 3",
      category: "$9 - 1.2 miles away",
      description: "Supporting line text items...",
      url: "https://youtu.be/eOSpCe1xdjw?si=jLWBcHqOnze03ltQ"
    }
  ];

  const handleLike = (videoId: number) => {
    setLikedVideos(prev =>
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)  // se já curtido, remove
        : [...prev, videoId]                 // senão, adiciona
    );
  };

  const handleRating = (videoId: number, rating: number) => {
    setVideoRatings(prev => {
      const existing = prev.find(r => r.videoId === videoId);
      if (existing) {
        // se a mesma nota for clicada de novo → remove a avaliação
        if (existing.rating === rating) {
          return prev.filter(r => r.videoId !== videoId);
        }
        // senão, atualiza a nota
        return prev.map(r => r.videoId === videoId ? { ...r, rating } : r);
      }
      // se não existia avaliação, cria uma
      return [...prev, { videoId, rating }];
    });
  };

  const getVideoRating = (videoId: number) =>
    videoRatings.find(r => r.videoId === videoId)?.rating || 0;

  const renderStars = (videoId: number) => {
    const rating = getVideoRating(videoId);
    return Array.from({ length: 5 }, (_, i) => {
      const value = i + 1;
      return (
        <button
          key={value}
          onClick={() => handleRating(videoId, value)}
          className="focus:outline-none text-lg hover:scale-110 transition-transform"
          aria-label={`Avaliar com ${value} estrelas`}
        >
          {value <= rating ? "★" : "☆"} {/* ★ para preenchido, ☆ para vazio */}
        </button>
      );
    });
  };

  const getYouTubeId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  if (isLoadingDelay) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-8">
      <div className="w-full max-w-5xl p-10 rounded-4xl bg-placeholder">
        <h1 className="font-extrabold text-4xl mb-8">Tutoriais</h1>

        {/* Video Principal fixo */}
        <div className="mb-8">
          <iframe
            className="rounded-4xl w-full aspect-video"
            src="https://www.youtube.com/embed/lDH7qc__b1c?si=xPv0J9OsRYMuoKdd"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        {/* Lista de vídeos */}
        <div className="space-y-6">
          {videos.map(video => {
            const isLiked = likedVideos.includes(video.id);
            const ytId = getYouTubeId(video.url);
            const displayTitle = video.youtubeInfo?.title || video.title;
            const displayDescription = video.youtubeInfo?.description
              ? video.youtubeInfo.description.substring(0, 100) + "..."
              : video.description;

            return (
              <div key={video.id} className="flex items-start border-b-2 pb-6 border-black/30 last:border-b-0">
                {ytId && (
                  <img
                    src={
                      video.youtubeInfo?.thumbnail ||
                      `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                    }
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
                    {displayDescription || "Supporting line text items..."}
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
                      color="#404040"
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
