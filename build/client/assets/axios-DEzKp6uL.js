import{e,j as s}from"./jsx-runtime-DtbKUkqS.js";import{a as r}from"./axios-2aYz4xwk.js";const o=e.createContext(null);function i(){return r.create({baseURL:void 0,timeout:2e3})}function x(){const t=e.useContext(o);if(!t)throw new Error("useAxios must be used within a AxiosProvider");return t}function c({children:t}){const n=i();return s.jsx(o.Provider,{value:n,children:t})}export{c as A,x as u};