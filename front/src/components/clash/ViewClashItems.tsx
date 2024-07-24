"use client";
import React, { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import socket from "@/lib/socket";
import CountUp from "react-countup";
export default function ViewClashItems({ clash }: { clash: ClashType }) {
  const [clashItems, setClashItems] = useState(clash.ClashItem);
  const [clashComments, setClashComments] = useState(clash.ClashComments);
  useEffect(() => {
    socket.on(`clashing-${clash.id}`, (payload: any) => {
      updateCounter(payload?.clashItemId);
    });

    socket.on(`clashing_comment-${clash.id}`, (payload) => {
      updateComment(payload);
    });
  }, []);

  const updateCounter = (id: number) => {
    if (clashItems) {
      // setHideVote(true);
      const items = [...clashItems];
      const findIndex = clashItems.findIndex((item) => item.id === id);
      if (findIndex !== -1) {
        items[findIndex].count += 1;
      }
      setClashItems(items);
    }
  };

  const updateComment = (payload: any) => {
    if (clashComments && clashComments.length > 0) {
      setClashComments([payload, ...clashComments!]);
    } else {
      setClashComments([payload]);
    }
  };

  return (
    <div className="mt-10">
      <div className="flex flex-wrap lg:flex-nowrap justify-between items-center">
        {clash?.ClashItem &&
          clash.ClashItem.length > 0 &&
          clash.ClashItem.map((item, index) => {
            return (
              <Fragment key={index}>
                {/* First Block */}
                <div className="w-full lg:w-[500px] flex justify-center items-center flex-col">
                  <div className="w-full flex justify-center items-center  p-2 h-[300px]">
                    <Image
                      src={getImageUrl(item.image)}
                      width={500}
                      height={500}
                      alt="preview-1"
                      className="w-full h-[300px] object-contain rounded-xl"
                    />
                  </div>
                  <CountUp
                    start={0}
                    end={item.count}
                    duration={0.5}
                    className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                  />
                </div>

                {/* VS Block */}
                {index % 2 === 0 && (
                  <div className="flex w-full lg:w-auto justify-center items-center">
                    <h1 className="text-7xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                      VS
                    </h1>
                  </div>
                )}
              </Fragment>
            );
          })}
      </div>

      {/* Display comments */}
      <div className="mt-4">
        {clashComments &&
          clashComments.length > 0 &&
          clashComments.map((item, index) => (
            <div
              className="w-full md:w-[600px] rounded-lg p-4 bg-muted mb-4"
              key={index}
            >
              <p className="font-bold">{item.comment}</p>
              <p>{new Date(item.created_at).toDateString()}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
