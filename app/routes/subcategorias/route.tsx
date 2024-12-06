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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "@remix-run/react";

const API_URL = "http://localhost:8080";

interface Subcategoria {
  idSubcategoria?: string;
  nombre: string;
}

const SubcategoriasPage = () => {
  const navigate = useNavigate();
  const categoriaId = localStorage.getItem("categoriaId");
  const nombreCategoria = localStorage.getItem("nombreCategoria");

  useEffect(() => {
    if (!categoriaId) {
      navigate("/categorias");
    }
  }, [categoriaId, navigate]);

  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [selectedSubcategoria, setSelectedSubcategoria] = useState<Subcategoria | null>(null);
  const [newSubcategoria, setNewSubcategoria] = useState<Subcategoria>({ nombre: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchSubcategorias();
  }, []);

  const fetchSubcategorias = async () => {
    try {
      const response = await axios.get(`${API_URL}/categorias/${categoriaId}`);
      const categoria = response.data;
      setSubcategorias(categoria.subcategorias || []);
      toast.success("Subcategorías cargadas satisfactoriamente");
    } catch (error) {
      console.error("Error al obtener subcategorías:", error);
      toast.error("No se pudo cargar las subcategorías");
    }
  };

  const handleAddSubcategoria = async () => {
    try {
      const response = await axios.post(`${API_URL}/subcategorias`, newSubcategoria);
      setSubcategorias([...subcategorias, response.data]);
      setShowAddModal(false);
      setNewSubcategoria({ nombre: "" });
      toast.success("Subcategoría añadida satisfactoriamente");
    } catch (error) {
      console.error("Error al añadir la subcategoría:", error);
      toast.error("No se pudo añadir la subcategoría");
    }
  };

  const handleSaveEdit = async () => {
    if (selectedSubcategoria) {
      try {
        const subcategoriaToUpdate = { ...selectedSubcategoria };
        await axios.put(`${API_URL}/subcategorias/${selectedSubcategoria.idSubcategoria}`, subcategoriaToUpdate);
        setShowEditModal(false);
        setSelectedSubcategoria(null);
        fetchSubcategorias();
        toast.success("Subcategoría editada satisfactoriamente");
      } catch (error) {
        console.error("Error al editar la subcategoría:", error);
        toast.error("No se pudo editar la subcategoría");
      }
    }
  };

  const handleDeleteSubcategoria = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/subcategorias/${id}`);
      fetchSubcategorias();
      toast.success("Subcategoría eliminada satisfactoriamente");
    } catch (error) {
      console.error("Error al eliminar la subcategoría:", error);
      toast.error("No se pudo eliminar la subcategoría");
    }
  };

  const renderActions = (subcategoria: Subcategoria) => (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly size="sm" className="button-primary">
          ⋮
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        onAction={(key) => {
          if (key === "edit") {
            setSelectedSubcategoria(subcategoria);
            setShowEditModal(true);
          } else if (key === "delete") {
            if (window.confirm("¿Estás seguro de eliminar esta subcategoría?")) {
              if (subcategoria.idSubcategoria) {
                handleDeleteSubcategoria(subcategoria.idSubcategoria);
              }
            }
          }
        }}
      >
        <DropdownItem key="edit">Editar</DropdownItem>
        <DropdownItem key="delete">Eliminar</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <Button className="button-secondary" onClick={() => navigate("/categorias")}>
          ← Volver a Categorías
        </Button>
        <h1 className="text-3xl font-bold text-blue-700">Gestión de Subcategorías para {nombreCategoria}</h1>
        <Button className="button-primary" onClick={() => setShowAddModal(true)}>
          Añadir Subcategoría
        </Button>
      </div>

      <Table aria-label="Lista de subcategorías">
        <TableHeader>
          <TableColumn className="table-header">Nombre</TableColumn>
          <TableColumn className="table-header">Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {subcategorias.map((subcategoria) => (
            <TableRow key={subcategoria.idSubcategoria} className="table-row">
              <TableCell>{subcategoria.nombre}</TableCell>
              <TableCell>{renderActions(subcategoria)}</TableCell>
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

      {/* Add Subcategoria Modal */}
      <Modal isOpen={showAddModal} onOpenChange={setShowAddModal}>
        <ModalContent>
          <ModalHeader>
            <h2>Añadir Nueva Subcategoría</h2>
          </ModalHeader>
          <ModalBody>
            <Input
              label="Nombre"
              value={newSubcategoria.nombre}
              onChange={(e) => setNewSubcategoria({ ...newSubcategoria, nombre: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button className="button-primary" onClick={handleAddSubcategoria}>
              Confirmar
            </Button>
            <Button className="button-secondary" onClick={() => setShowAddModal(false)}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Subcategoria Modal */}
      {selectedSubcategoria && (
        <Modal isOpen={showEditModal} onOpenChange={setShowEditModal}>
          <ModalContent>
            <ModalHeader>
              <h2>Editar Subcategoría</h2>
            </ModalHeader>
            <ModalBody>
              <Input
                label="Nombre"
                value={selectedSubcategoria.nombre}
                onChange={(e) => setSelectedSubcategoria({ ...selectedSubcategoria, nombre: e.target.value })}
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

export default SubcategoriasPage;