import { Activity, Layers, UserRoundPlus, X } from "lucide-react";
import React, { useEffect, useState } from "react";

import PlayersList from "./PlayersList";
import PopupSelect from "@/utils/PopupSelect";
import { PlayerComparisonChart } from "./PlayerComparisonChart";

import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Pagination, Navigation } from "swiper/modules";

import { useLazyGetComparisonPlayersQuery } from "@/redux/features/stats/statsRankingApi";

const skills = ["pace", "shooting", "passing", "dribbling", "defending"];

const PlayerComparison = () => {
  const [trigger, setTrigger] = useState(false);
  const [comparisonPlayer, setComparisonPlayer] = useState([]);
  const [selectPlayer, setSelectedPlayer] = useState(null);

  const [getComparisonPlayers] = useLazyGetComparisonPlayersQuery();

  useEffect(() => {
    if (selectPlayer) {
      const fetchData = async () => {
        try {
          const { data } = await getComparisonPlayers({
            overall: selectPlayer.overall,
            position: selectPlayer.club_position,
          });
          setComparisonPlayer(data?.similarPlayers);
        } catch (error) {
          console.error("Failed to fetch comparison player:", error);
        }
      };

      fetchData();
    }
  }, [selectPlayer]);


  const handleRemoveSelectedPlayer=()=>{
    setTrigger(false);
    setSelectedPlayer(null);
  }
  const handleTrigger = () => {
    setTrigger((prev) => !prev);
  };

  return (
    <section className="xl:max-w-[1300px] mx-auto mt-2 px-4">
      <div className="relative py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 bg-gray-50 rounded-lg">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-700 dark:text-white">
            Designed for comparison of players
          </h2>
          <p className="mb-5 font-normal text-gray-500 sm:text-xl dark:text-gray-400">
            Here at Dominion FC, we focus on the selection process of the best
            possible player.
          </p>
        </div>
        <div className="space-y-6 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
          {selectPlayer ? (
            <>
              <div
                className={`flex flex-col p-3 mx-auto text-center text-gray-900 rounded-lg border-2 border-gray-100 shadow xl:p-8 ${
                  selectPlayer.bought === 1 ? "bg-red-50" : "bg-gray-50"
                }`}
              >
                <button className="mb-4" onClick={handleRemoveSelectedPlayer}>
                  <X />
                </button>
                <h3 className="mb-4 text-2xl font-semibold">
                  {selectPlayer.short_name}
                </h3>
                <p className="font-normal sm:text-lg">Selected Player</p>
                <div>
                  <img
                    src={selectPlayer.player_face_url}
                    alt=""
                    className="mx-auto"
                  />
                </div>
                <div>
                  <ul className="flex p-2 justify-between gap-10">
                    <li className="flex items-center gap-2 font-semibold">
                      {" "}
                      <span>
                        <Activity className="size-4" />
                      </span>
                      Age : {selectPlayer.age}{" "}
                    </li>
                    <li className="flex items-center gap-2 font-semibold">
                      {" "}
                      <span>
                        <Layers className="size-4" />
                      </span>{" "}
                      Position : {selectPlayer.club_position}{" "}
                    </li>
                  </ul>
                </div>
                <div>
                  <PlayerComparisonChart
                    playerSkills={{
                      pace: selectPlayer.pace,
                      shooting: selectPlayer.shooting,
                      passing: selectPlayer.passing,
                      dribbling: selectPlayer.dribbling,
                      defending: selectPlayer.defending,
                    }}
                  />
                </div>
              </div>
              {/* swiper  */}
              <div className="col-span-2">
                <Swiper
                  slidesPerView={1}
                  spaceBetween={20}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 10,
                    },
                  }}
                  navigation={true}
                  modules={[Pagination, Navigation]}
                  className="mySwiper"
                >
                  {comparisonPlayer &&
                    comparisonPlayer.map((player, index) => (
                      <SwiperSlide key={index}>
                        <div className="flex flex-col p-4 mx-auto text-center text-gray-900 rounded-lg border-2 bg-white border-gray-100 shadow xl:p-8">
                          <h3 className="mb-4 text-2xl font-semibold">
                            {player.short_name}
                          </h3>
                          <p className="font-normal sm:text-lg">
                            Similar to selected one
                          </p>
                          <div>
                            <img
                              src={player.player_face_url}
                              alt="player name"
                              className="mx-auto"
                            />
                          </div>
                          <div>
                            <ul className="flex p-2 justify-between gap-10">
                              <li className="flex items-center gap-2 font-semibold">
                                {" "}
                                <span>
                                  <Activity className="size-4" />
                                </span>
                                Age : {player.age}
                              </li>
                              <li className="flex items-center gap-2 font-semibold">
                                {" "}
                                <span>
                                  <Layers className="size-4" />
                                </span>{" "}
                                Position : {player.club_position}{" "}
                              </li>
                            </ul>
                          </div>
                          <div>
                            <PlayerComparisonChart
                              playerSkills={{
                                pace: player.pace,
                                shooting: player.shooting,
                                passing: player.passing,
                                dribbling: player.dribbling,
                                defending: player.defending,
                              }}
                            />
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
            </>
          ) : (
            <div className="flex flex-col p-4 mx-auto text-center text-gray-900 bg-white rounded-lg border-2 border-gray-100 shadow xl:p-8">
              <h3 className="mb-4 text-2xl font-semibold">Add Players</h3>
              <p className="font-normal sm:text-lg">
                Compare with other players on the basis of overall score.
              </p>
              <button
                className="flex justify-center items-baseline my-6 cursor-pointer transition-colors duration-300"
                onClick={handleTrigger}
              >
                <UserRoundPlus className="size-56 hover:stroke-blue-600" />
              </button>
              {/* Popup */}
              {trigger && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <PopupSelect trigger={trigger}>
                    <div className="h-fit w-[90%] sm:w-[500px] bg-white rounded-lg shadow-md p-4">
                      <PlayersList setSelectedPlayer={setSelectedPlayer} />
                      <button
                        className="bg-blue-500 text-white w-32 py-1 rounded-md mt-2"
                        onClick={handleTrigger}
                      >
                        Close
                      </button>
                    </div>
                  </PopupSelect>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PlayerComparison;
