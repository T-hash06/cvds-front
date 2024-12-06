import{r as s,j as e}from"./jsx-runtime-DtbKUkqS.js";import{a as i}from"./axios-2aYz4xwk.js";import{B as r,t as q,a as F,b as f,c as J,d as K,e as b,p as V,Q as W,m as S,f as v,g as k,h as $,i as A,j as X,k as Y,l as Z,n as g}from"./ReactToastify-DsUNwl2o.js";import{H as ee,n as ae}from"./index-vU54yuje.js";import{b as o,i as E,c as _}from"./chunk-IR2E3HZF-CKWO4TGO.js";import"./context-Cx_DuriG.js";const c="http://localhost:8080",ie=()=>{const{libroId:d}=ee();console.log("libroId:",d);const[P,N]=s.useState([]),[C,O]=s.useState(""),[j,D]=s.useState(1),[w]=s.useState(5),[M,I]=s.useState(0),[T,m]=s.useState(!1),[z,h]=s.useState(!1),[l,u]=s.useState(null),[n,x]=s.useState({estado:"",disponible:!1,libro:d}),B=ae();s.useEffect(()=>{p()},[j]);const p=async()=>{try{const a=await i.get(`${c}/ejemplares/libro/${d}`,{params:{page:j-1,size:w}});N(a.data),I(Math.ceil(a.data.length/w)),r.success("Ejemplares cargados satisfactoriamente")}catch(a){console.error("Error al obtener ejemplares:",a),r.error("No se pudo cargar los ejemplares")}},H=a=>{u(a),h(!0)},y=(a,t)=>{l&&u({...l,[a]:t})},L=async()=>{if(l)try{await i.put(`${c}/ejemplares/${l.id}`,l),h(!1),u(null),p(),r.success("Ejemplar editado satisfactoriamente")}catch(a){console.error("Error al editar el ejemplar:",a),r.error("No se pudo editar el ejemplar")}},R=async()=>{try{await i.post(`${c}/ejemplares`,n),m(!1),x({estado:"",disponible:!1,libro:d}),p(),r.success("Ejemplar añadido satisfactoriamente")}catch(a){console.error("Error al añadir el ejemplar:",a),r.error("No se pudo añadir el ejemplar")}},G=async a=>{try{await i.delete(`${c}/ejemplares/${a}`),p(),r.success("Ejemplar eliminado satisfactoriamente")}catch(t){console.error("Error al eliminar el ejemplar:",t),r.error("No se pudo eliminar el ejemplar")}},Q=async()=>{try{const a=await i.get(`${c}/ejemplares/${C}`);N([a.data]),r.success("Ejemplar encontrado")}catch(a){console.error("Error al escanear el ejemplar:",a),r.error("No se pudo encontrar el ejemplar")}},U=a=>e.jsxs(X,{children:[e.jsx(Y,{children:e.jsx(o,{isIconOnly:!0,size:"sm",className:"button-primary",children:"⋮"})}),e.jsxs(Z,{onAction:t=>{t==="edit"?H(a):t==="delete"?window.confirm("¿Estás seguro de eliminar este ejemplar?")&&G(a.id):t==="subcategorias"&&B(`/books/subcategorias/${a.id}`)},children:[e.jsx(g,{children:"Editar"},"edit"),e.jsx(g,{children:"Eliminar"},"delete"),e.jsx(g,{children:"Subcategorías"},"subcategorias")]})]});return e.jsxs("div",{className:"p-6 bg-blue-50 min-h-screen",children:[e.jsxs("div",{className:"flex items-center justify-between mb-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-blue-700",children:"Gestión de Ejemplares"}),e.jsx(o,{className:"button-primary",onClick:()=>m(!0),children:"Añadir Ejemplar"})]}),e.jsxs("div",{className:"flex gap-4 mb-6",children:[e.jsx(E,{className:"input-search",placeholder:"Escanear Ejemplar...",value:C,onChange:a=>O(a.target.value)}),e.jsx(o,{className:"button-primary",onClick:Q,children:e.jsx("i",{className:"fas fa-search"})})]}),e.jsxs(q,{"aria-label":"Lista de ejemplares",children:[e.jsxs(F,{children:[e.jsx(f,{className:"table-header",children:"Estado"}),e.jsx(f,{className:"table-header",children:"Disponible"}),e.jsx(f,{className:"table-header",children:"Acciones"})]}),e.jsx(J,{children:P.map(a=>e.jsxs(K,{className:"table-row",children:[e.jsx(b,{children:a.estado}),e.jsx(b,{children:e.jsx(_,{isSelected:a.disponible,isDisabled:!0})}),e.jsx(b,{children:U(a)})]},a.id))})]}),e.jsx("div",{className:"flex justify-center mt-6",children:e.jsx(V,{total:M,page:j,onChange:a=>D(a)})}),e.jsx(W,{position:"top-right",autoClose:3e3,hideProgressBar:!0,newestOnTop:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0}),e.jsx(S,{isOpen:T,onOpenChange:m,children:e.jsxs(v,{children:[e.jsx(k,{children:e.jsx("h2",{children:"Añadir Nuevo Ejemplar"})}),e.jsxs($,{children:[e.jsx(E,{label:"Estado",value:n.estado,onChange:a=>x({...n,estado:a.target.value})}),e.jsx(_,{isSelected:n.disponible,onChange:a=>x({...n,disponible:a.target.checked}),children:"Disponible"})]}),e.jsxs(A,{children:[e.jsx(o,{className:"button-primary",onClick:R,children:"Confirmar"}),e.jsx(o,{className:"button-secondary",onClick:()=>m(!1),children:"Cancelar"})]})]})}),l&&e.jsx(S,{isOpen:z,onOpenChange:h,children:e.jsxs(v,{children:[e.jsx(k,{children:e.jsx("h2",{children:"Editar Ejemplar"})}),e.jsxs($,{children:[e.jsx(E,{label:"Estado",value:l.estado,onChange:a=>y("estado",a.target.value)}),e.jsx(_,{isSelected:l.disponible,onChange:a=>y("disponible",a.target.checked),children:"Disponible"})]}),e.jsxs(A,{children:[e.jsx(o,{className:"button-primary",onClick:L,children:"Confirmar"}),e.jsx(o,{className:"button-secondary",onClick:()=>h(!1),children:"Cancelar"})]})]})})]})};export{ie as default};