import React, { useState, useMemo, useCallback } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Selection,
  SortDescriptor,
  Link,
} from "@nextui-org/react";
import styles from './prestamoTable.module.css';

// Define TypeScript interface for Loan
interface Loan {
  id: string;
  idEstudiante: string;
  idLibro: string;
  fechaPrestamo: string;
  fechaDevolucion: string;
  estado: 'Prestado' | 'Devuelto';
  observaciones?: string;
}

// Columns configuration
const INITIAL_COLUMNS = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'ESTUDIANTE', uid: 'idEstudiante', sortable: true },
  { name: 'LIBRO', uid: 'idLibro', sortable: true },
  { name: 'FECHA PRÉSTAMO', uid: 'fechaPrestamo', sortable: true },
  { name: 'FECHA DEVOLUCIÓN', uid: 'fechaDevolucion', sortable: true },
  { name: 'ESTADO', uid: 'estado' },
  { name: 'ACCIONES', uid: 'acciones' },
];

const PrestamoTable: React.FC = () => {
  // Sample data
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: "674b4a9f8964470f827ade2c",
      idEstudiante: "5f5b3b3b1f1b3b5f5b3b3b1f",
      idLibro: "5f5b3b3b1f1b3b5f5b3b3b1f",
      fechaPrestamo: "2024-11-30",
      fechaDevolucion: "2025-09-18",
      estado: "Prestado",
    },
    {
      id: "674e1330a3d1fa256a067d08",
      idEstudiante: "5f5b3b3b1f1b3b5f5b3b3b1f",
      idLibro: "5f5b3b3b1f1b3b5f5b3b3b1f",
      fechaPrestamo: "2024-12-02",
      fechaDevolucion: "2025-09-18",
      estado: "Devuelto",
    }
  ]);

  // State for table management
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_COLUMNS.map(column => column.uid)));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending"
  });
  const [page, setPage] = useState(1);

  // Filtering and sorting logic
  const filteredItems = useMemo(() => {
    let filtered = [...loans];

    if (filterValue) {
      filtered = filtered.filter(loan => 
        Object.values(loan).some(value => 
          value.toString().toLowerCase().includes(filterValue.toLowerCase())
        )
      );
    }

    return filtered.sort((a, b) => {
      const key = sortDescriptor.column as keyof Loan;
      const direction = sortDescriptor.direction === "ascending" ? 1 : -1;
      const aValue = a[key] ?? "";
      const bValue = b[key] ?? "";
      return aValue.localeCompare(bValue) * direction;
    });
  }, [loans, filterValue, sortDescriptor]);

  // Pagination
  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  // Render cell content
  const renderCell = useCallback((loan: Loan, columnKey: React.Key) => {
    switch (columnKey) {
      case "estado":
        return (
          <Chip 
            color={loan.estado === "Devuelto" ? "success" : "warning"}
            variant="flat"
          >
            {loan.estado}
          </Chip>
        );
      case "acciones":
        return (
          <div className="flex gap-2">
            <Button size="sm" color="primary" variant="light">Editar</Button>
            <Button size="sm" color="danger" variant="light">Eliminar</Button>
          </div>
        );
      default:
        return loan[columnKey as keyof Loan];
    }
  }, []);

  // Columns rendering
  const headerColumns = useMemo(() => {
    return INITIAL_COLUMNS.filter(column => 
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Buscar préstamo..."
          value={filterValue}
          onClear={() => setFilterValue("")}
          onValueChange={setFilterValue}
        />
      </div>
      <Table
        aria-label="Tabla de Préstamos"
        isHeaderSticky
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={setPage}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[340px]",
        }}
        onSortChange={setSortDescriptor}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn 
              key={column.uid} 
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody 
          emptyContent={"No hay préstamos para mostrar"}
          items={items}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const PrestamoPage: React.FC = () => {
  return (
    <main className={styles.prestamoPage}>
      <h1 className={styles.title}>Lista de Préstamos</h1>
      <PrestamoTable />
	  <Link
		href='/prestamo'
		className={styles.prestamoButtonLink}
	
	  >
	  	Volver 
	  </Link>
    </main>
  );
};

export default PrestamoPage;