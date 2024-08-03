"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, set } from "date-fns";
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
import { Input } from "@/components/ui/input";
import { DatePicker } from "rsuite";

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
    header: "Puerto de carga",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("deliver", {
    header: "Puerto de entrega",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("discharge", {
    header: "Puerto de descarga",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("date_time", {
    header: "Fecha de salida",
    cell: (info) => format(new Date(info.getValue()), "dd/MM/yyyy hh:mm a"),
  }),
];

export default function ContainersPage() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [filteredContainers, setFilteredContainers] = useState<Container[]>([]);
  const [query, setQuery] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  const table = useReactTable({
    columns,
    data: filteredContainers,
    getCoreRowModel: getCoreRowModel<Container>(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    setLoading(true);
    services.container
      .getContainers()
      .then((containers) => {
        setContainers(containers);
        setFilteredContainers(containers);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChangeQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    const auxContainer = containers.filter(
      (container) =>
        (container.rowidunh.toString().includes(q) ||
          container.agency.toLowerCase().includes(q.toLowerCase()) ||
          container.load.toLowerCase().includes(q.toLowerCase()) ||
          container.deliver.toLowerCase().includes(q.toLowerCase()) ||
          container.discharge.toLowerCase().includes(q.toLowerCase()) ||
          container.booking.toLowerCase().includes(q.toLowerCase())) &&
        (!date ||
          format(new Date(container.date_time), "dd/MM/yyyy") ===
            format(date, "dd/MM/yyyy"))
    );
    setFilteredContainers(auxContainer);
  };

  const handleChangeDate = (value: Date | null) => {
    setDate(value);
  };

  const handleSearch = () => {
    if (!date) return;
    const auxContainer = containers.filter(
      (container) =>
        format(new Date(container.date_time), "dd/MM/yyyy") ===
        format(date, "dd/MM/yyyy")
    );
    setFilteredContainers(auxContainer);
  };

  return (
    <main className="px-5 pt-5">
      <h1 className="text-2xl font-semibold mb-4">Contenedores</h1>
      <div className="flex mb-5 gap-3 flex-col md:flex-row">
        <div className="flex items-center gap-3 md:w-[50%]">
          <label htmlFor="rowidunh">Filtro:</label>
          <Input
            id="rowidunh"
            placeholder="Ingrese un ID, agencia, reserva o puerto"
            value={query}
            onChange={handleChangeQuery}
          />
        </div>
        <div className="flex items-center gap-3 md:w-[50%]">
          <div className="flex items-center gap-3 flex-1">
            <label htmlFor="rowidunh">Fecha de salida:</label>
            <DatePicker
              format="dd/MM/yyyy"
              className="flex-1"
              size="lg"
              value={date}
              onChange={handleChangeDate}
            />
          </div>
          <Button disabled={!date} onClick={handleSearch}>
            Buscar
          </Button>
        </div>
      </div>
      {loading && <p>Obteniendo contenedores...</p>}
      {!loading && filteredContainers.length > 0 && (
        <div>
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
        </div>
      )}
    </main>
  );
}
