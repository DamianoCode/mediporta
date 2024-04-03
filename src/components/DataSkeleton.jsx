import Skeleton from "./Skeleton";

export default function DataSkeleton({ quantity }) {
  return (
    <>
      {Array.from({ length: quantity }, (_, index) => (
        <Skeleton key={index} />
      ))}
    </>
  );
}
