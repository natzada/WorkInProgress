import React, { useState } from "react";
import Icon from "@mdi/react";
import { mdiHeartOutline, mdiHeart } from "@mdi/js";

const Tutorials: React.FC = () => {
  const videos = [
    {
      id: 1,
      title: "Video 1",
      category: "Category 1",
      description: "Description for Tutorial 1",
      url: "https://youtu.be/rOr0hEO7pqk?si=Hyr6sJkf57k0jknZ",
      img: "https://img.youtube.com/vi/rOr0hEO7pqk/hqdefault.jpg",
    },
    {
      id: 2,
      title: "Video 2",
      category: "Category 1",
      description: "Description for Tutorial 2",
      url: "https://youtu.be/in0XbfQEm2A?si=c1tEvL2Wwdt607vB",
      img: "https://img.youtube.com/vi/in0XbfQEm2A/hqdefault.jpg",
    },
    {
      id: 3,
      title: "Video 3",
      category: "Category 1",
      description: "Description for Tutorial 3",
      url: "https://youtu.be/eOSpCe1xdjw?si=hjGVF42j_gxV4rjM",
      img: "https://img.youtube.com/vi/eOSpCe1xdjw/hqdefault.jpg",
    },
  ];

  const stars = (n: number) => {
    return "★".repeat(n) + "☆".repeat(5 - n);
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-20">
      <div className="bg-placeholder w-5xl p-10 rounded-4xl">
        <h1 className="font-extrabold text-4xl">Tutoriais</h1>
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
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [liked, setLiked] = useState(false);

            const handleLike = () => {
              setLiked(!liked);
            };

            return (
              <li key={video.id} className="flex border-b-2 p-5 border-black/30">
                <img
                  src={video.img}
                  alt={video.title}
                  className="rounded-2xl mt-2 w-25 h-25 object-cover"
                />
                <div className="flex flex-col justify-around ml-5">
                  <a href={video.url} className="text-2xl">{video.title}</a>
                  <p className="italic text-sm text-neutral-600">
                    {video.category}
                    <br />
                    {video.description}
                  </p>
                </div>
                <div className="flex flex-row items-center ml-auto space-x-4">
                  <span className="text-neutral-700 text-lg">{stars(5)}</span>
                  <button onClick={handleLike} className="focus:outline-none">
                    <Icon path={liked ? mdiHeart : mdiHeartOutline} size={0.8} />
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