import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePredictBestPlaying11Mutation } from "@/redux/features/prediction/predictionApi";
import PredictionLoader from "@/components/PredictionLoader";
import TeamRender from "./TeamRender";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const positionMap = {
  forwards: ["LW", "ST", "RW"],
  midfielders: ["CDM", "CAM", "CM"],
  defenders: ["RB", "CB", "LB"],
  goalkeepers: ["GK"],
};

const Playing = () => {
  const { currentUser } = useAuth();

  const [predictBestPlaying11, { data: players, isLoading, error }] =
    usePredictBestPlaying11Mutation();

  useEffect(() => {
    if (currentUser?.uid) {
      predictBestPlaying11({ userId: currentUser.uid });
    }
  }, [currentUser?.uid]);

  if (isLoading) {
    return <PredictionLoader />;
  }

  return (
    <div className="xl:w-[1300px] mx-auto p-4">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        className="w-full"
      >
        {players?.data?.map((team, index) => (
          <SwiperSlide key={index}>
            <TeamRender team={team} index={index} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Playing;
