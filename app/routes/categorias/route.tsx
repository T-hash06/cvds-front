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
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
} from "@nextui-org/react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080";

interface Categoria {
  idCategoria?: string;
  nombre: string;
}

interface Subcategoria {
  idSubcategoria?: string;
  nombre: string;
  categorias: Categoria[];
}

const CategoriasPage = () => {
  const navigate = useNavigate();
  const libroId = localStorage.getItem("libroId");
  const nombreLibro = localStorage.getItem("nombreLibro");

  useEffect(() => {
    if (!libroId) {
      navigate("/books");
    }
  }, [libroId, navigate]);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [newCategoria, setNewCategoria] = useState<Categoria>({ nombre: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSubcategoria, setSelectedSubcategoria] = useState<string | null>(null);
  const [newSubcategoria, setNewSubcategoria] = useState<string>("");

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(`${API_URL}/libros/${libroId}`);
      const libro = response.data;
      setCategorias(libro.subcategorias.flatMap((sub: Subcategoria) => sub.categorias));
      setSubcategorias(libro.subcategorias);
      toast.success("Categorías cargadas satisfactoriamente");
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      toast.error("No se pudo cargar las categorías");
    }
  };

  const handleAddCategoria = async () => {
    try {
      let subcategoria = subcategorias.find((sub) => sub.nombre === selectedSubcategoria);
      if (!subcategoria && newSubcategoria) {
        // Create new subcategoria
        const subcategoriaResponse = await axios.post(`${API_URL}/subcategorias`, {
          nombre: newSubcategoria,
          categorias: [],
        });
        subcategoria = subcategoriaResponse.data;
        if (subcategoria) {
          setSubcategorias([...subcategorias, subcategoria]);
        }
      }
      const categoriaToAdd = { ...newCategoria };
      const categoriaResponse = await axios.post(`${API_URL}/categorias`, categoriaToAdd);
      const categoria = categoriaResponse.data;

      // Update subcategoria with new categoria
      if (subcategoria) {
        subcategoria.categorias.push(categoria);
        await axios.put(`${API_URL}/subcategorias/${subcategoria.idSubcategoria}`, subcategoria);
      }

      // Optionally update libro's subcategorias

      setCategorias([...categorias, categoria]);
      setShowAddModal(false);
      setNewCategoria({ nombre: "" });
      setSelectedSubcategoria(null);
      setNewSubcategoria("");
      toast.success("Categoría añadida satisfactoriamente");
    } catch (error) {
      console.error("Error al añadir la categoría:", error);
      toast.error("No se pudo añadir la categoría");
    }
  };

  const handleSaveEdit = async () => {
    if (selectedCategoria) {
      try {
        const categoriaToUpdate = { ...selectedCategoria };
        await axios.put(`${API_URL}/categorias/${selectedCategoria.idCategoria}`, categoriaToUpdate);
        setShowEditModal(false);
        setSelectedCategoria(null);
        fetchCategorias();
        toast.success("Categoría editada satisfactoriamente");
      } catch (error) {
        console.error("Error al editar la categoría:", error);
        toast.error("No se pudo editar la categoría");
      }
    }
  };

  const handleDeleteCategoria = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/categorias/${id}`);
      fetchCategorias();
      toast.success("Categoría eliminada satisfactoriamente");
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      toast.error("No se pudo eliminar la categoría");
    }
  };

  const renderActions = (categoria: Categoria) => (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly size="sm" className="button-primary">
          ⋮
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        onAction={(key) => {
          if (key === "edit") {
            setSelectedCategoria(categoria);
            setShowEditModal(true);
          } else if (key === "delete") {
            if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
              if (categoria.idCategoria) {
                handleDeleteCategoria(categoria.idCategoria);
              } else {
                toast.error("ID de categoría no válido");
              }
            }
          } else if (key === "subcategorias") {
            if (categoria.idCategoria) {
              localStorage.setItem("categoriaId", categoria.idCategoria);
            } else {
              toast.error("ID de categoría no válido");
            }
            navigate("/subcategorias");
          }
        }}
      >
        <DropdownItem key="edit">Editar</DropdownItem>
        <DropdownItem key="delete">Eliminar</DropdownItem>
        <DropdownItem key="subcategorias">Subcategorías</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <Button className="button-secondary" onClick={() => navigate("/books")}>
          ← Volver a Libros
        </Button>
        <h1 className="text-3xl font-bold text-blue-700">Gestión de Categorías para {nombreLibro}</h1>
        <Button className="button-primary" onClick={() => setShowAddModal(true)}>
          Añadir Categoría
        </Button>
      </div>

      <Table aria-label="Lista de categorías">
        <TableHeader>
          <TableColumn className="table-header">Nombre</TableColumn>
          <TableColumn className="table-header">Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {categorias.map((categoria) => (
            <TableRow key={categoria.idCategoria} className="table-row">
              <TableCell>{categoria.nombre}</TableCell>
              <TableCell>{renderActions(categoria)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />

      {/* Add Categoria Modal */}
      <Modal isOpen={showAddModal} onOpenChange={setShowAddModal}>
        <ModalContent>
          <ModalHeader>
            <h2>Añadir Nueva Categoría</h2>
          </ModalHeader>
          <ModalBody>
            <Input
              label="Nombre"
              value={newCategoria.nombre}
              onChange={(e) =>
                setNewCategoria({ ...newCategoria, nombre: e.target.value })
              }
            />
            <Dropdown>
              <DropdownTrigger>
                <Button className="button-primary">
                  {selectedSubcategoria ?? "Seleccionar Subcategoría"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Seleccionar Subcategoría"
                selectionMode="single"
                selectedKeys={selectedSubcategoria ? [selectedSubcategoria] : []}
                onSelectionChange={(keys) => {
                  const selection = Array.from(keys).join("");
                  if (selection === "new") {
                    setSelectedSubcategoria(null);
                  } else {
                    setSelectedSubcategoria(selection);
                  }
                }}
              >
                {/* {subcategorias.map((subcategoria) => (
                  <DropdownItem key={subcategoria.nombre}>
                    {subcategoria.nombre}
                  </DropdownItem>
                ))} */}
                <DropdownItem key="new">Nueva Subcategoría</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            {selectedSubcategoria === null && (
              <Input
                label="Nueva Subcategoría"
                value={newSubcategoria}
                onChange={(e) => setNewSubcategoria(e.target.value)}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button className="button-primary" onClick={handleAddCategoria}>
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

      {/* Edit Categoria Modal */}
      {selectedCategoria && (
        <Modal isOpen={showEditModal} onOpenChange={setShowEditModal}>
          <ModalContent>
            <ModalHeader>
              <h2>Editar Categoría</h2>
            </ModalHeader>
            <ModalBody>
              <Input
                label="Nombre"
                value={selectedCategoria.nombre}
                onChange={(e) => setSelectedCategoria({ ...selectedCategoria, nombre: e.target.value })}
              />
            </ModalBody>
            <ModalFooter>
              <Button className="button-primary" onClick={handleSaveEdit}>
                Confirmar
              </Button>
              <Button className="button-secondary" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default CategoriasPage;