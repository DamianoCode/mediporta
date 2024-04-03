import {
  Skeleton as MuiSkeleton,
  TableCell,
  TableRow,
  Chip,
} from "@mui/material";

export default function Skeleton(props) {
  return (
    <>
      <TableRow hover tabIndex={-1} key={props.key}>
        <TableCell>
          <MuiSkeleton />
        </TableCell>
        <TableCell>
          <MuiSkeleton sx={{ marginLeft: "auto" }}>
            <Chip />
          </MuiSkeleton>
        </TableCell>
      </TableRow>
    </>
  );
}
