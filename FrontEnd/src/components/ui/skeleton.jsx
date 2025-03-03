import { Skeleton as ChakraSkeleton, Circle, Stack } from "@chakra-ui/react";
import * as React from "react";

export const SkeletonCircle = React.forwardRef(function SkeletonCircle(
  props,
  ref
) {
  const { size, ...rest } = props;
  return (
    <Circle size={size} asChild ref={ref}>
      <ChakraSkeleton {...rest} />
    </Circle>
  );
});

export const SkeletonText = React.forwardRef(function SkeletonText(props, ref) {
  const { noOfLines = 3, gap, ...rest } = props;
  return (
    <Stack gap={gap} width="full" ref={ref}>
      {Array.from({ length: noOfLines }).map((_, index) => (
        <ChakraSkeleton
          bg={"gray"}
          height="4"
          key={index}
          {...props}
          _last={{ maxW: "80%" }}
          {...rest}
        />
      ))}
    </Stack>
  );
});

export const Skeleton = ChakraSkeleton;
