import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer, Outlet, Meta, Links, ScrollRestoration, Scripts, useParams, useNavigate } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { NextUIProvider, Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Checkbox, Pagination, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate as useNavigate$1 } from "react-router-dom";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let responseCode = responseStatusCode;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let responseCode = responseStatusCode;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const AxiosContext = React.createContext(null);
function axiosInstance() {
  const instance = axios.create({
    baseURL: void 0,
    timeout: 2e3
  });
  return instance;
}
function useAxios() {
  const context = React.useContext(AxiosContext);
  if (!context) {
    throw new Error("useAxios must be used within a AxiosProvider");
  }
  return context;
}
function AxiosProvider({ children }) {
  const value = axiosInstance();
  return /* @__PURE__ */ jsx(AxiosContext.Provider, { value, children });
}
const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
  }
];
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1"
        }
      ),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(NextUIProvider, { children }),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(AxiosProvider, { children: /* @__PURE__ */ jsx(Outlet, {}) });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: App,
  links
}, Symbol.toStringTag, { value: "Module" }));
const API_URL$1 = "http://localhost:8080";
const EjemplaresPage = () => {
  const { libroId } = useParams();
  console.log("libroId:", libroId);
  const [ejemplares, setEjemplares] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEjemplar, setSelectedEjemplar] = useState(null);
  const [newEjemplar, setNewEjemplar] = useState({
    estado: "",
    disponible: false,
    libro: libroId
  });
  const navigate = useNavigate();
  useEffect(() => {
    fetchEjemplares();
  }, [page]);
  const fetchEjemplares = async () => {
    try {
      const response = await axios.get(`${API_URL$1}/ejemplares/libro/${libroId}`, {
        params: { page: page - 1, size: rowsPerPage }
      });
      setEjemplares(response.data);
      setTotalPages(Math.ceil(response.data.length / rowsPerPage));
      toast.success("Ejemplares cargados satisfactoriamente");
    } catch (error) {
      console.error("Error al obtener ejemplares:", error);
      toast.error("No se pudo cargar los ejemplares");
    }
  };
  const handleEditClick = (ejemplar) => {
    setSelectedEjemplar(ejemplar);
    setShowEditModal(true);
  };
  const handleEditChange = (field, value) => {
    if (selectedEjemplar) {
      setSelectedEjemplar({ ...selectedEjemplar, [field]: value });
    }
  };
  const handleSaveEdit = async () => {
    if (selectedEjemplar) {
      try {
        await axios.put(`${API_URL$1}/ejemplares/${selectedEjemplar.id}`, selectedEjemplar);
        setShowEditModal(false);
        setSelectedEjemplar(null);
        fetchEjemplares();
        toast.success("Ejemplar editado satisfactoriamente");
      } catch (error) {
        console.error("Error al editar el ejemplar:", error);
        toast.error("No se pudo editar el ejemplar");
      }
    }
  };
  const handleAddEjemplar = async () => {
    try {
      await axios.post(`${API_URL$1}/ejemplares`, newEjemplar);
      setShowAddModal(false);
      setNewEjemplar({
        estado: "",
        disponible: false,
        libro: libroId
      });
      fetchEjemplares();
      toast.success("Ejemplar añadido satisfactoriamente");
    } catch (error) {
      console.error("Error al añadir el ejemplar:", error);
      toast.error("No se pudo añadir el ejemplar");
    }
  };
  const handleDeleteEjemplar = async (id) => {
    try {
      await axios.delete(`${API_URL$1}/ejemplares/${id}`);
      fetchEjemplares();
      toast.success("Ejemplar eliminado satisfactoriamente");
    } catch (error) {
      console.error("Error al eliminar el ejemplar:", error);
      toast.error("No se pudo eliminar el ejemplar");
    }
  };
  const handleScanEjemplar = async () => {
    try {
      const response = await axios.get(`${API_URL$1}/ejemplares/${searchTerm}`);
      setEjemplares([response.data]);
      toast.success("Ejemplar encontrado");
    } catch (error) {
      console.error("Error al escanear el ejemplar:", error);
      toast.error("No se pudo encontrar el ejemplar");
    }
  };
  const renderActions = (ejemplar) => /* @__PURE__ */ jsxs(Dropdown, { children: [
    /* @__PURE__ */ jsx(DropdownTrigger, { children: /* @__PURE__ */ jsx(Button, { isIconOnly: true, size: "sm", className: "button-primary", children: "⋮" }) }),
    /* @__PURE__ */ jsxs(
      DropdownMenu,
      {
        onAction: (key) => {
          if (key === "edit") {
            handleEditClick(ejemplar);
          } else if (key === "delete") {
            if (window.confirm(`¿Estás seguro de eliminar este ejemplar?`)) {
              handleDeleteEjemplar(ejemplar.id);
            }
          } else if (key === "subcategorias") {
            navigate(`/books/subcategorias/${ejemplar.id}`);
          }
        },
        children: [
          /* @__PURE__ */ jsx(DropdownItem, { children: "Editar" }, "edit"),
          /* @__PURE__ */ jsx(DropdownItem, { children: "Eliminar" }, "delete"),
          /* @__PURE__ */ jsx(DropdownItem, { children: "Subcategorías" }, "subcategorias")
        ]
      }
    )
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "p-6 bg-blue-50 min-h-screen", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-blue-700", children: "Gestión de Ejemplares" }),
      /* @__PURE__ */ jsx(Button, { className: "button-primary", onClick: () => setShowAddModal(true), children: "Añadir Ejemplar" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4 mb-6", children: [
      /* @__PURE__ */ jsx(
        Input,
        {
          className: "input-search",
          placeholder: "Escanear Ejemplar...",
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value)
        }
      ),
      /* @__PURE__ */ jsx(Button, { className: "button-primary", onClick: handleScanEjemplar, children: /* @__PURE__ */ jsx("i", { className: "fas fa-search" }) })
    ] }),
    /* @__PURE__ */ jsxs(Table, { "aria-label": "Lista de ejemplares", children: [
      /* @__PURE__ */ jsxs(TableHeader, { children: [
        /* @__PURE__ */ jsx(TableColumn, { className: "table-header", children: "Estado" }),
        /* @__PURE__ */ jsx(TableColumn, { className: "table-header", children: "Disponible" }),
        /* @__PURE__ */ jsx(TableColumn, { className: "table-header", children: "Acciones" })
      ] }),
      /* @__PURE__ */ jsx(TableBody, { children: ejemplares.map((ejemplar) => /* @__PURE__ */ jsxs(TableRow, { className: "table-row", children: [
        /* @__PURE__ */ jsx(TableCell, { children: ejemplar.estado }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
          Checkbox,
          {
            isSelected: ejemplar.disponible,
            isDisabled: true
          }
        ) }),
        /* @__PURE__ */ jsx(TableCell, { children: renderActions(ejemplar) })
      ] }, ejemplar.id)) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-center mt-6", children: /* @__PURE__ */ jsx(
      Pagination,
      {
        total: totalPages,
        page,
        onChange: (newPage) => setPage(newPage)
      }
    ) }),
    /* @__PURE__ */ jsx(
      ToastContainer,
      {
        position: "top-right",
        autoClose: 3e3,
        hideProgressBar: true,
        newestOnTop: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      }
    ),
    /* @__PURE__ */ jsx(Modal, { isOpen: showAddModal, onOpenChange: setShowAddModal, children: /* @__PURE__ */ jsxs(ModalContent, { children: [
      /* @__PURE__ */ jsx(ModalHeader, { children: /* @__PURE__ */ jsx("h2", { children: "Añadir Nuevo Ejemplar" }) }),
      /* @__PURE__ */ jsxs(ModalBody, { children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Estado",
            value: newEjemplar.estado,
            onChange: (e) => setNewEjemplar({ ...newEjemplar, estado: e.target.value })
          }
        ),
        /* @__PURE__ */ jsx(
          Checkbox,
          {
            isSelected: newEjemplar.disponible,
            onChange: (e) => setNewEjemplar({ ...newEjemplar, disponible: e.target.checked }),
            children: "Disponible"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(ModalFooter, { children: [
        /* @__PURE__ */ jsx(Button, { className: "button-primary", onClick: handleAddEjemplar, children: "Confirmar" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            className: "button-secondary",
            onClick: () => setShowAddModal(false),
            children: "Cancelar"
          }
        )
      ] })
    ] }) }),
    selectedEjemplar && /* @__PURE__ */ jsx(Modal, { isOpen: showEditModal, onOpenChange: setShowEditModal, children: /* @__PURE__ */ jsxs(ModalContent, { children: [
      /* @__PURE__ */ jsx(ModalHeader, { children: /* @__PURE__ */ jsx("h2", { children: "Editar Ejemplar" }) }),
      /* @__PURE__ */ jsxs(ModalBody, { children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Estado",
            value: selectedEjemplar.estado,
            onChange: (e) => handleEditChange("estado", e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(
          Checkbox,
          {
            isSelected: selectedEjemplar.disponible,
            onChange: (e) => handleEditChange("disponible", e.target.checked),
            children: "Disponible"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(ModalFooter, { children: [
        /* @__PURE__ */ jsx(Button, { className: "button-primary", onClick: handleSaveEdit, children: "Confirmar" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            className: "button-secondary",
            onClick: () => setShowEditModal(false),
            children: "Cancelar"
          }
        )
      ] })
    ] }) })
  ] });
};
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: EjemplaresPage
}, Symbol.toStringTag, { value: "Module" }));
const meta$1 = () => {
  return [
    { title: "Library Search" },
    { name: "description", content: "Welcome to your library search!" }
  ];
};
function Index() {
  return /* @__PURE__ */ jsx("h1", { children: "CVDS 2024" });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const API_URL = "http://localhost:8080";
const BooksPage = () => {
  const [libros, setLibros] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("autor");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLibro, setSelectedLibro] = useState(null);
  const [newLibro, setNewLibro] = useState({
    nombreLibro: "",
    autor: "",
    editor: "",
    edicion: "",
    isbn: "",
    sinopsis: "",
    anioPublicacion: ""
  });
  const navigate = useNavigate$1();
  useEffect(() => {
    if (searchTerm) {
      searchLibros();
    } else {
      fetchLibros();
    }
  }, [page]);
  const fetchLibros = async () => {
    try {
      const response = await axios.get(`${API_URL}/libros`, {
        params: { page: page - 1, size: rowsPerPage }
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
        `${API_URL}/busquedas/${searchTerm}/parametro/${searchBy}/pagina/${page - 1}/tamano/${rowsPerPage}`
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
  const deleteLibro = async (id) => {
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
  const handleEditClick = (libro) => {
    setSelectedLibro(libro);
    setShowEditModal(true);
  };
  const handleEditChange = (field, value) => {
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
        ejemplares: []
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
        anioPublicacion: ""
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
  const renderActions = (libro) => /* @__PURE__ */ jsxs(Dropdown, { children: [
    /* @__PURE__ */ jsx(DropdownTrigger, { children: /* @__PURE__ */ jsx(Button, { isIconOnly: true, size: "sm", className: "button-primary", children: "⋮" }) }),
    /* @__PURE__ */ jsxs(
      DropdownMenu,
      {
        onAction: (key) => {
          if (key === "edit") {
            handleEditClick(libro);
          } else if (key === "delete") {
            if (window.confirm(`¿Estás seguro de eliminar "${libro.nombreLibro}"?`)) {
              deleteLibro(libro.id);
            }
          } else if (key === "ejemplares") {
            navigate(`/books/ejemplares/${libro.id}`);
          } else if (key === "categorias") {
            navigate(`/books/categorias/${libro.id}`);
          }
        },
        children: [
          /* @__PURE__ */ jsx(DropdownItem, { children: "Editar" }, "edit"),
          /* @__PURE__ */ jsx(DropdownItem, { children: "Eliminar" }, "delete"),
          /* @__PURE__ */ jsx(DropdownItem, { children: "Ejemplares" }, "ejemplares"),
          /* @__PURE__ */ jsx(DropdownItem, { children: "Categorías" }, "categorias")
        ]
      }
    )
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "p-6 bg-blue-50 min-h-screen", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-blue-700", children: "Gestión de Libros" }),
      /* @__PURE__ */ jsx(Button, { className: "button-primary", onClick: () => setShowAddModal(true), children: "Añadir Libro" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4 mb-6", children: [
      /* @__PURE__ */ jsx(
        Input,
        {
          className: "input-search",
          placeholder: "Buscar...",
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value)
        }
      ),
      /* @__PURE__ */ jsxs(Dropdown, { children: [
        /* @__PURE__ */ jsx(DropdownTrigger, { children: /* @__PURE__ */ jsx(Button, { className: "button-primary", children: `Buscar por: ${searchBy}` }) }),
        /* @__PURE__ */ jsxs(DropdownMenu, { onAction: (key) => setSearchBy(key), children: [
          /* @__PURE__ */ jsx(DropdownItem, { children: "Autor" }, "autor"),
          /* @__PURE__ */ jsx(DropdownItem, { children: "Título" }, "nombreLibro"),
          /* @__PURE__ */ jsx(DropdownItem, { children: "ISBN" }, "isbn"),
          /* @__PURE__ */ jsx(DropdownItem, { children: "Sinopsis" }, "sinopsis")
        ] })
      ] }),
      /* @__PURE__ */ jsx(Button, { className: "button-primary", onClick: searchLibros, children: "Buscar" }),
      /* @__PURE__ */ jsx(Button, { className: "button-secondary", onClick: resetFilters, children: "Borrar filtros" })
    ] }),
    /* @__PURE__ */ jsxs(Table, { "aria-label": "Lista de libros", children: [
      /* @__PURE__ */ jsxs(TableHeader, { children: [
        /* @__PURE__ */ jsx(TableColumn, { className: "table-header", children: "Título" }),
        /* @__PURE__ */ jsx(TableColumn, { className: "table-header", children: "Autor" }),
        /* @__PURE__ */ jsx(TableColumn, { className: "table-header", children: "Editor" }),
        /* @__PURE__ */ jsx(TableColumn, { className: "table-header", children: "Edición" }),
        /* @__PURE__ */ jsx(TableColumn, { className: "table-header w-auto", children: "ISBN" }),
        /* @__PURE__ */ jsx(TableColumn, { className: "table-header", children: "Sinopsis" }),
        /* @__PURE__ */ jsx(TableColumn, { className: "table-header", children: "Año" }),
        /* @__PURE__ */ jsx(TableColumn, { className: "table-header", children: "Acciones" })
      ] }),
      /* @__PURE__ */ jsx(TableBody, { children: libros.map((libro) => /* @__PURE__ */ jsxs(TableRow, { className: "table-row", children: [
        /* @__PURE__ */ jsx(TableCell, { children: libro.nombreLibro }),
        /* @__PURE__ */ jsx(TableCell, { children: libro.autor }),
        /* @__PURE__ */ jsx(TableCell, { children: libro.editor }),
        /* @__PURE__ */ jsx(TableCell, { children: libro.edicion }),
        /* @__PURE__ */ jsx(TableCell, { className: "whitespace-nowrap w-auto", children: libro.isbn }),
        /* @__PURE__ */ jsx(TableCell, { children: libro.sinopsis }),
        /* @__PURE__ */ jsx(TableCell, { children: libro.anioPublicacion }),
        /* @__PURE__ */ jsx(TableCell, { children: renderActions(libro) })
      ] }, libro.id)) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-center mt-6", children: /* @__PURE__ */ jsx(
      Pagination,
      {
        total: totalPages,
        page,
        onChange: (newPage) => setPage(newPage)
      }
    ) }),
    /* @__PURE__ */ jsx(
      ToastContainer,
      {
        position: "top-right",
        autoClose: 3e3,
        hideProgressBar: true,
        newestOnTop: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      }
    ),
    /* @__PURE__ */ jsx(Modal, { isOpen: showAddModal, onOpenChange: setShowAddModal, children: /* @__PURE__ */ jsxs(ModalContent, { children: [
      /* @__PURE__ */ jsx(ModalHeader, { children: /* @__PURE__ */ jsx("h2", { children: "Añadir Nuevo Libro" }) }),
      /* @__PURE__ */ jsxs(ModalBody, { children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Título",
            value: newLibro.nombreLibro,
            onChange: (e) => setNewLibro({ ...newLibro, nombreLibro: e.target.value })
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Autor",
            value: newLibro.autor,
            onChange: (e) => setNewLibro({ ...newLibro, autor: e.target.value })
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Editor",
            value: newLibro.editor,
            onChange: (e) => setNewLibro({ ...newLibro, editor: e.target.value })
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Edición",
            value: newLibro.edicion,
            onChange: (e) => setNewLibro({ ...newLibro, edicion: e.target.value })
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "ISBN",
            value: newLibro.isbn,
            onChange: (e) => setNewLibro({ ...newLibro, isbn: e.target.value })
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Sinopsis",
            value: newLibro.sinopsis,
            onChange: (e) => setNewLibro({ ...newLibro, sinopsis: e.target.value })
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Año de Publicación",
            value: newLibro.anioPublicacion,
            onChange: (e) => setNewLibro({
              ...newLibro,
              anioPublicacion: e.target.value
            })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(ModalFooter, { children: [
        /* @__PURE__ */ jsx(Button, { className: "button-primary", onClick: handleAddLibro, children: "Confirmar" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            className: "button-secondary",
            onClick: () => setShowAddModal(false),
            children: "Cancelar"
          }
        )
      ] })
    ] }) }),
    selectedLibro && /* @__PURE__ */ jsx(Modal, { isOpen: showEditModal, onOpenChange: setShowEditModal, children: /* @__PURE__ */ jsxs(ModalContent, { children: [
      /* @__PURE__ */ jsx(ModalHeader, { children: /* @__PURE__ */ jsx("h2", { children: "Editar Libro" }) }),
      /* @__PURE__ */ jsxs(ModalBody, { children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Título",
            value: selectedLibro.nombreLibro,
            onChange: (e) => handleEditChange("nombreLibro", e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Autor",
            value: selectedLibro.autor,
            onChange: (e) => handleEditChange("autor", e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Editor",
            value: selectedLibro.editor,
            onChange: (e) => handleEditChange("editor", e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Edición",
            value: selectedLibro.edicion,
            onChange: (e) => handleEditChange("edicion", e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "ISBN",
            value: selectedLibro.isbn,
            onChange: (e) => handleEditChange("isbn", e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Sinopsis",
            value: selectedLibro.sinopsis,
            onChange: (e) => handleEditChange("sinopsis", e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Año de Publicación",
            value: selectedLibro.anioPublicacion,
            onChange: (e) => handleEditChange("anioPublicacion", e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(ModalFooter, { children: [
        /* @__PURE__ */ jsx(Button, { className: "button-primary", onClick: handleSaveEdit, children: "Confirmar" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            className: "button-secondary",
            onClick: () => setShowEditModal(false),
            children: "Cancelar"
          }
        )
      ] })
    ] }) })
  ] });
};
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: BooksPage
}, Symbol.toStringTag, { value: "Module" }));
const logo = "/assets/logo-BN3MmO1b.png";
const header = "_header_8guyw_1";
const headerWrapper = "_headerWrapper_8guyw_7";
const titleWrapper = "_titleWrapper_8guyw_15";
const headerTitle = "_headerTitle_8guyw_21";
const headerImage = "_headerImage_8guyw_29";
const headerButtonsContainer = "_headerButtonsContainer_8guyw_39";
const loginPage = "_loginPage_8guyw_49";
const loginForm = "_loginForm_8guyw_55";
const formTitle = "_formTitle_8guyw_61";
const forgotPasswordText = "_forgotPasswordText_8guyw_69";
const forgotPasswordLink = "_forgotPasswordLink_8guyw_77";
const loginContent = "_loginContent_8guyw_87";
const styles = {
  header,
  headerWrapper,
  titleWrapper,
  headerTitle,
  headerImage,
  headerButtonsContainer,
  loginPage,
  loginForm,
  formTitle,
  forgotPasswordText,
  forgotPasswordLink,
  loginContent
};
const meta = () => {
  return [
    {
      title: "Iniciar sesión"
    },
    {
      name: "description",
      content: "Inicia sesión en tu cuenta de BiblioSoft"
    }
  ];
};
const Title = () => {
  return /* @__PURE__ */ jsx("h1", { className: styles.formTitle, children: "Iniciar Sesión:" });
};
const ForgotPassword = () => {
  return /* @__PURE__ */ jsxs("p", { className: styles.forgotPasswordText, children: [
    "Olvidaste tu contraseña?",
    " ",
    /* @__PURE__ */ jsx("a", { href: "/#", className: styles.forgotPasswordLink, children: "Recupérala aquí" })
  ] });
};
const Header = () => {
  return /* @__PURE__ */ jsx("header", { className: styles.header, children: /* @__PURE__ */ jsxs("div", { className: styles.headerWrapper, children: [
    /* @__PURE__ */ jsxs("div", { className: styles.titleWrapper, children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: logo,
          alt: "Bibliosoft Colsabi",
          className: styles.headerImage
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: styles.headerTitle, children: "Bibliosoft Colsabi" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: styles.headerButtonsContainer, children: [
      /* @__PURE__ */ jsx(Button, { color: "default", size: "sm", variant: "light", children: "Contáctenos" }),
      /* @__PURE__ */ jsx(Button, { color: "primary", size: "sm", children: "Iniciar Sesión" })
    ] })
  ] }) });
};
const MainContent = () => {
  return /* @__PURE__ */ jsx("section", { className: styles.loginContent, children: /* @__PURE__ */ jsxs("form", { className: styles.loginForm, children: [
    /* @__PURE__ */ jsx(Title, {}),
    /* @__PURE__ */ jsx(Input, { type: "text", placeholder: "Nombre de usuario" }),
    /* @__PURE__ */ jsx(Input, { type: "password", placeholder: "Contraseña" }),
    /* @__PURE__ */ jsx(Checkbox, { size: "sm", children: "Recordarme" }),
    /* @__PURE__ */ jsx(Button, { color: "primary", children: "Iniciar Sesión" }),
    /* @__PURE__ */ jsx(ForgotPassword, {})
  ] }) });
};
const LoginRoute = () => {
  useAxios();
  return /* @__PURE__ */ jsxs("main", { className: styles.loginPage, children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx(MainContent, {})
  ] });
};
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: LoginRoute,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BC_zRWDz.js", "imports": ["/assets/jsx-runtime-DtbKUkqS.js", "/assets/index-vU54yuje.js", "/assets/components-DUsnjYsu.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-BP3bIZoO.js", "imports": ["/assets/jsx-runtime-DtbKUkqS.js", "/assets/index-vU54yuje.js", "/assets/components-DUsnjYsu.js", "/assets/axios-DEzKp6uL.js", "/assets/axios-2aYz4xwk.js", "/assets/context-Cx_DuriG.js"], "css": ["/assets/root-Vsrn4Nmj.css"] }, "routes/ejemplares": { "id": "routes/ejemplares", "parentId": "root", "path": "ejemplares", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-Ghb-Xi4p.js", "imports": ["/assets/jsx-runtime-DtbKUkqS.js", "/assets/axios-2aYz4xwk.js", "/assets/ReactToastify-DsUNwl2o.js", "/assets/index-vU54yuje.js", "/assets/chunk-IR2E3HZF-CKWO4TGO.js", "/assets/context-Cx_DuriG.js"], "css": ["/assets/ReactToastify-BE4BdE5o.css"] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-DP93NtHO.js", "imports": ["/assets/jsx-runtime-DtbKUkqS.js"], "css": [] }, "routes/books": { "id": "routes/books", "parentId": "root", "path": "books", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-BMe_7wXU.js", "imports": ["/assets/jsx-runtime-DtbKUkqS.js", "/assets/axios-2aYz4xwk.js", "/assets/ReactToastify-DsUNwl2o.js", "/assets/index-vU54yuje.js", "/assets/chunk-IR2E3HZF-CKWO4TGO.js", "/assets/context-Cx_DuriG.js"], "css": ["/assets/ReactToastify-BE4BdE5o.css"] }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-cgA4yJ4T.js", "imports": ["/assets/jsx-runtime-DtbKUkqS.js", "/assets/axios-DEzKp6uL.js", "/assets/chunk-IR2E3HZF-CKWO4TGO.js", "/assets/axios-2aYz4xwk.js"], "css": ["/assets/route-DU_Y8Lot.css"] } }, "url": "/assets/manifest-5ee7676d.js", "version": "5ee7676d" };
const mode = "production";
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": true, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/ejemplares": {
    id: "routes/ejemplares",
    parentId: "root",
    path: "ejemplares",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route2
  },
  "routes/books": {
    id: "routes/books",
    parentId: "root",
    path: "books",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
