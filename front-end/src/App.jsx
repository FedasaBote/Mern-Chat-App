// import { Button } from "@chakra-ui/react";
import Home from "./Home";
import "./App.css";
import ChatPage from "./ChatPage";
import ChatProvider from "./context/ChatProvider.jsx";

import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Home />} />
      <Route
        path="/chats"
        element={
          <ChatProvider>
            <ChatPage />
          </ChatProvider>
        }
      >
        {/* <Route index element={<ChatPage />} /> */}
      </Route>
    </Route>
  )
);
export default function App() {
  return (
    <div className="app">
      <RouterProvider router={router}>{/* <ChatProvider /> */}</RouterProvider>
    </div>
  );
}

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./Home";
// import ChatPage from "./ChatPage";
// import ChatProvider from "./context/ChatProvider.jsx";

// function App() {
//   return (
//     <div className="app">
//       <Router>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route
//             path="/chats"
//             element={
//               <ChatProvider>
//                 <ChatPage />
//               </ChatProvider>
//             }
//           >
//             {/* <Route index element={<ChatPage />} /> */}
//           </Route>
//         </Routes>
//       </Router>
//     </div>
//   );
// }

// export default App;
