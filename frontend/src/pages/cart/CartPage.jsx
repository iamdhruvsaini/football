import React, { useEffect, useState } from "react";
import SelectedPlayer from "./SelectedPlayer";
import Recommended from "./Recommended";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserSelectedPlayer } from "@/redux/cart/cartSlice";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const positionMap = {
  forwards: ["LW", "ST", "RW"], // Forwards
  midfielders: ["CDM", "CAM", "CM"], // Midfielders
  defenders: ["RB", "CB", "LB"], // Defenders
  goalkeepers: ["GK"],
};

const CartPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(currentUser?.uid);
  const [cartSummary, setCartSummary] = useState({
    totalPlayer: 0,
    totalPrice: 0,
    positionCounts: {},
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserSelectedPlayer(userId));
  }, [dispatch, userId]);

  const players = useSelector((state) => state.cart.cartItems);

  useEffect(() => {
    if (players.length >= 0) {
      //total price
      const totalPrice = players.reduce(
        (sum, player) => sum + Number(player.value_eur),
        0
      );

      const positionCounts = players.reduce((counts, player) => {
        const position = player.club_position; // Assuming 'club_position' holds the player's position

        for (const category in positionMap) {
          if (positionMap[category].includes(position)) {
            counts[category] = (counts[category] || 0) + 1;
          }
        }

        return counts;
      }, {});

      setCartSummary({
        totalPlayer: players.length,
        totalPrice,
        positionCounts,
      });
    }
  }, [players]);

  if (!players) {
    return <Loading />;
  }

  const handlePredictionClick = () => {
    navigate('/playing');
  };

  return (
    <section className="xl:max-w-[1300px] mx-auto mt-10 px-4">
      <div className="mx-auto max-w-screen-xl  2xl:px-0">
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-3xl">
          Players Cart
        </h1>

        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            {/* selected player */}
            <SelectedPlayer players={players} />
            {/* Recommended section */}
            <Recommended />
          </div>
          {/* Player summary */}
          <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                Player summary
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Total Players
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      {cartSummary.totalPlayer}
                    </dd>
                  </dl>
                  {Object.entries(cartSummary.positionCounts).map(
                    ([category, count]) => (
                      <dl
                        className="flex items-center justify-between gap-4"
                        key={category}
                      >
                        <dt className="text-base font-normal text-gray-500 capitalize">
                          {category}
                        </dt>
                        <dd className="text-base font-medium text-gray-900 dark:text-white">
                          {count}
                        </dd>
                      </dl>
                    )
                  )}
                </div>

                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt className="text-base font-bold text-gray-900 dark:text-white">
                    Total
                  </dt>
                  <dd className="text-base font-bold text-gray-900 dark:text-white">
                    $ {cartSummary.totalPrice}
                  </dd>
                </dl>
              </div>

              <button
                className={`flex w-full items-center justify-center rounded-lg p-2 font-semibold text-white ${
                  cartSummary.totalPlayer === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600"
                }`}
                disabled={cartSummary.totalPlayer === 0}
                onClick={handlePredictionClick}
              >
                Proceed to Prediction
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
