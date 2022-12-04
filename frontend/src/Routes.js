import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import NewNote from "./containers/NewNote";
import NotFound from "./containers/NotFound";
import Signup from "./containers/Signup";
import Notes from "./containers/Notes";
import Settings from "./containers/Settings";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
export default function Links() {
  const AllRoutes=[
    {
    path:'/',
    element:<Home />
  },
  {
    path:'/*',
    element:<NotFound />
  },
  {
    path:'/login',
    element: <UnauthenticatedRoute>
    <Login />
  </UnauthenticatedRoute>
  },
  {
    path:'/signup',
    element:<UnauthenticatedRoute>
    <Signup />
  </UnauthenticatedRoute>
  },
  {
    path:'/notes/new',
    element: <AuthenticatedRoute>
    <NewNote />
  </AuthenticatedRoute>
  },
  {
    path:'/notes/:id',
    element:<AuthenticatedRoute>
    <Notes />
  </AuthenticatedRoute>
  },
  {
    path:'/settings',
    element:<AuthenticatedRoute>
    <Settings />
  </AuthenticatedRoute>
  },

]
  return (
    <Routes>
      {AllRoutes.map(x=>{
        return(<Route path={x.path} element={x.element} />)
      })}
      {/* <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />;
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/notes/new" element={<NewNote />} />
      <Route path="/notes/:id" element={<Notes />} />
      <Route path="/settings" element={<Settings />} /> */}
    </Routes>
  );
}