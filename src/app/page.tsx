"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Container } from "@/interfaces/container.interface";
import { services } from "@/services";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";

const columnHelper = createColumnHelper<Container>();

const columns = [
  columnHelper.accessor("rowidunh", {
    header: "ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("agency", {
    header: "Agencia",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("transhipment", {
    header: "Transbordo",
    cell: (info) => (info.getValue() === "" ? "-" : info.getValue()),
  }),
  columnHelper.accessor("carrier", {
    header: "Tranportista",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("booking", {
    header: "Reserva",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("load", {
    header: "Carga",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("deliver", {
    header: "Entrega",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("discharge", {
    header: "Descarga",
    cell: (info) => info.getValue(),
  }),
  /* columnHelper.accessor('date_time', {
    header: 'Fecha y Hora',
    cell: info => format(info.getValue(), 'dd/MM/yyyy hh:mm a'),
  }) */
];

export default function Home() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(false);
  const table = useReactTable({
    columns,
    data: containers,
    getCoreRowModel: getCoreRowModel<Container>(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    setLoading(true);
    services.container
      .getContainers()
      .then((containers) => {
        setContainers(containers);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="px-5 pt-5">
      <h1 className="text-2xl font-semibold mb-4">Contenedores</h1>
      {loading && <p>Obteniendo contenedores...</p>}
      {!loading && containers.length > 0 && (
        <>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-end items-center gap-3 md:gap-6 mt-4 overflow-y-auto">
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <div>Página</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} de{" "}
                {table.getPageCount()}
              </strong>
            </div>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </main>
  );
}
