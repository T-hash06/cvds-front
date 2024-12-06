// app/routes/books/route.tsx

import React, { useState, useEffect } from "react";
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
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080";

interface Libro {
  id?: string;
  nombreLibro: string;
  autor: string;
  editor: string;
  edicion: string;
  isbn: string;
  sinopsis: string;
  anioPublicacion: string;
}

const BooksPage = () => {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("autor");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLibro, setSelectedLibro] = useState<Libro | null>(null);

  const [newLibro, setNewLibro] = useState<Libro>({
    nombreLibro: "",
    autor: "",
    editor: "",
    edicion: "",
    isbn: "",
    sinopsis: "",
    anioPublicacion: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm) {
      searchLibros();
    } else {
      fetchLibros();
    }
  }, [searchTerm]);

  const fetchLibros = async () => {
    try {
      const response = await axios.get(`${API_URL}/libros`, {
        params: { page: page - 1, size: rowsPerPage },
      });
      setLibros(response.data.content);
      setTotalPages(response.data.totalPages);
      toast.success("Libros cargados satisfactoriamente");
    } catch (error) {
      console.error("Error al obtener libros:", error);
      toast.error("No se pudo cargar los libros");
    }
  };

  const searchLibros = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/busquedas/${searchTerm}/parametro/${searchBy}/pagina/${
          page - 1
        }/tamano/${rowsPerPage}`
      );
      setLibros(response.data.content);
      setTotalPages(response.data.totalPages);
      toast.success("Búsqueda realizada satisfactoriamente");
    } catch (error) {
      console.error("Error al buscar libros:", error);
      toast.error("No se pudo realizar la búsqueda");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSearchBy("autor");
    setPage(1);
    fetchLibros();
    toast.info("Filtros restablecidos");
  };

  const deleteLibro = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/libros/${id}`);
      if (searchTerm) {
        searchLibros();
      } else {
        fetchLibros();
      }
      toast.success("Libro eliminado satisfactoriamente");
    } catch (error) {
      console.error("Error al eliminar el libro:", error);
      toast.error("No se pudo eliminar el libro");
    }
  };

  const handleEditClick = (libro: Libro) => {
    setSelectedLibro(libro);
    setShowEditModal(true);
  };

  const handleEditChange = (field: keyof Libro, value: string) => {
    if (selectedLibro) {
      setSelectedLibro({ ...selectedLibro, [field]: value });
    }
  };

  const handleSaveEdit = async () => {
    if (selectedLibro) {
      try {
        await axios.put(`${API_URL}/libros/${selectedLibro.id}`, selectedLibro);
        setShowEditModal(false);
        setSelectedLibro(null);
        if (searchTerm) {
          searchLibros();
        } else {
          fetchLibros();
        }
        toast.success("Libro editado satisfactoriamente");
      } catch (error) {
        console.error("Error al editar el libro:", error);
        toast.error("No se pudo editar el libro");
      }
    }
  };

  const handleAddLibro = async () => {
    try {
      const libroToAdd = {
        ...newLibro,
        categorias: [],
        subcategorias: [],
        ejemplares: [],
      };
      await axios.post(`${API_URL}/libros`, libroToAdd);
      setShowAddModal(false);
      setNewLibro({
        nombreLibro: "",
        autor: "",
        editor: "",
        edicion: "",
        isbn: "",
        sinopsis: "",
        anioPublicacion: "",
      });
      if (searchTerm) {
        setPage(1);
        searchLibros();
      } else {
        fetchLibros();
      }
      toast.success("Libro añadido satisfactoriamente");
    } catch (error) {
      console.error("Error al añadir el libro:", error);
      toast.error("No se pudo añadir el libro");
    }
  };

  const renderActions = (libro: Libro) => (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly size="sm" className="button-primary">
          ⋮
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        onAction={(key) => {
          if (key === "edit") {
            handleEditClick(libro);
          } else if (key === "delete") {
            if (
              window.confirm(`¿Estás seguro de eliminar "${libro.nombreLibro}"?`)
            ) {
              if (libro.id) {
                deleteLibro(libro.id);
              }
            }
          } else if (key === "ejemplares") {
            if (libro.id) {
              localStorage.setItem("libroId", libro.id); // Save libroId to local storage
              localStorage.setItem("nombreLibro", libro.nombreLibro); 
              navigate("/ejemplares");
            } else {
              toast.error("No se pudo navegar a ejemplares, ID del libro no encontrado");
            }
          } else if (key === "categorias") {
            if (libro.id) {
              localStorage.setItem("libroId", libro.id); // Save libroId to local storage
              localStorage.setItem("nombreLibro", libro.nombreLibro);
            } else {
              toast.error("No se pudo navegar a categorías, ID del libro no encontrado");
            }
            navigate("/categorias");
          }
        }}
      >
        <DropdownItem key="edit">Editar</DropdownItem>
        <DropdownItem key="delete">Eliminar</DropdownItem>
        <DropdownItem key="ejemplares">Ejemplares</DropdownItem>
        <DropdownItem key="categorias">Categorías</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Gestión de Libros</h1>
        <Button className="button-primary" onClick={() => setShowAddModal(true)}>
          Añadir Libro
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <Input
          className="input-search"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Dropdown>
          <DropdownTrigger>
            <Button className="button-primary">{`Buscar por: ${searchBy}`}</Button>
          </DropdownTrigger>
          <DropdownMenu onAction={(key) => setSearchBy(key as string)}>
            <DropdownItem key="autor">Autor</DropdownItem>
            <DropdownItem key="nombreLibro">Título</DropdownItem>
            <DropdownItem key="isbn">ISBN</DropdownItem>
            <DropdownItem key="sinopsis">Sinopsis</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Button className="button-primary" onClick={searchLibros}>
          Buscar
        </Button>
        <Button className="button-secondary" onClick={resetFilters}>
          Borrar filtros
        </Button>
      </div>

      <Table aria-label="Lista de libros">
        <TableHeader>
          <TableColumn className="table-header">Título</TableColumn>
          <TableColumn className="table-header">Autor</TableColumn>
          <TableColumn className="table-header">Editor</TableColumn>
          <TableColumn className="table-header">Edición</TableColumn>
          <TableColumn className="table-header w-auto">ISBN</TableColumn>
          <TableColumn className="table-header">Sinopsis</TableColumn>
          <TableColumn className="table-header">Año</TableColumn>
          <TableColumn className="table-header">Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {libros.map((libro) => (
            <TableRow key={libro.id} className="table-row">
              <TableCell>{libro.nombreLibro}</TableCell>
              <TableCell>{libro.autor}</TableCell>
              <TableCell>{libro.editor}</TableCell>
              <TableCell>{libro.edicion}</TableCell>
              <TableCell className="whitespace-nowrap w-auto">
                {libro.isbn}
              </TableCell>
              <TableCell>{libro.sinopsis}</TableCell>
              <TableCell>{libro.anioPublicacion}</TableCell>
              <TableCell>{renderActions(libro)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center mt-6">
        <Pagination
          total={totalPages}
          page={page}
          onChange={(newPage) => setPage(newPage)}
        />
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />

      {/* Add Libro Modal */}
      <Modal isOpen={showAddModal} onOpenChange={setShowAddModal}>
        <ModalContent>
          <ModalHeader>
            <h2>Añadir Nuevo Libro</h2>
          </ModalHeader>
          <ModalBody>
            <Input
              label="Título"
              value={newLibro.nombreLibro}
              onChange={(e) =>
                setNewLibro({ ...newLibro, nombreLibro: e.target.value })
              }
            />
            <Input
              label="Autor"
              value={newLibro.autor}
              onChange={(e) =>
                setNewLibro({ ...newLibro, autor: e.target.value })
              }
            />
            <Input
              label="Editor"
              value={newLibro.editor}
              onChange={(e) =>
                setNewLibro({ ...newLibro, editor: e.target.value })
              }
            />
            <Input
              label="Edición"
              value={newLibro.edicion}
              onChange={(e) =>
                setNewLibro({ ...newLibro, edicion: e.target.value })
              }
            />
            <Input
              label="ISBN"
              value={newLibro.isbn}
              onChange={(e) =>
                setNewLibro({ ...newLibro, isbn: e.target.value })
              }
            />
            <Input
              label="Sinopsis"
              value={newLibro.sinopsis}
              onChange={(e) =>
                setNewLibro({ ...newLibro, sinopsis: e.target.value })
              }
            />
            <Input
              label="Año de Publicación"
              value={newLibro.anioPublicacion}
              onChange={(e) =>
                setNewLibro({
                  ...newLibro,
                  anioPublicacion: e.target.value,
                })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button className="button-primary" onClick={handleAddLibro}>
              Confirmar
            </Button>
            <Button
              className="button-secondary"
              onClick={() => setShowAddModal(false)}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Libro Modal */}
      {selectedLibro && (
        <Modal isOpen={showEditModal} onOpenChange={setShowEditModal}>
          <ModalContent>
            <ModalHeader>
              <h2>Editar Libro</h2>
            </ModalHeader>
            <ModalBody>
              <Input
                label="Título"
                value={selectedLibro.nombreLibro}
                onChange={(e) =>
                  handleEditChange("nombreLibro", e.target.value)
                }
              />
              <Input
                label="Autor"
                value={selectedLibro.autor}
                onChange={(e) => handleEditChange("autor", e.target.value)}
              />
              <Input
                label="Editor"
                value={selectedLibro.editor}
                onChange={(e) => handleEditChange("editor", e.target.value)}
              />
              <Input
                label="Edición"
                value={selectedLibro.edicion}
                onChange={(e) => handleEditChange("edicion", e.target.value)}
              />
              <Input
                label="ISBN"
                value={selectedLibro.isbn}
                onChange={(e) => handleEditChange("isbn", e.target.value)}
              />
              <Input
                label="Sinopsis"
                value={selectedLibro.sinopsis}
                onChange={(e) => handleEditChange("sinopsis", e.target.value)}
              />
              <Input
                label="Año de Publicación"
                value={selectedLibro.anioPublicacion}
                onChange={(e) =>
                  handleEditChange("anioPublicacion", e.target.value)
                }
              />
            </ModalBody>
            <ModalFooter>
              <Button className="button-primary" onClick={handleSaveEdit}>
                Confirmar
              </Button>
              <Button
                className="button-secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default BooksPage;