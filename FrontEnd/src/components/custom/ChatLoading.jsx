import React from "react";

import { SkeletonText } from "../ui/skeleton";

const ChatLoading = () => {
  return <SkeletonText noOfLines={6} gap="8" />;
};

export default ChatLoading;
