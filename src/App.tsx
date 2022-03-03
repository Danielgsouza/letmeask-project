import React from 'react';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext';

import { Home } from './pages/Home';
import { Room } from './pages/Room';
import { NewRoom } from './pages/NewRoom'
import { AdminRoom } from './pages/AdminRoom';
import { ToastContainer } from 'react-toastify';



function App() {
  return (
    
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/rooms/new' component={NewRoom} />
          <Route path='/rooms/:id' component={Room} />
          <Route path='/admin/rooms/:id' component={AdminRoom} />
        </Switch>
        <ToastContainer />
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
