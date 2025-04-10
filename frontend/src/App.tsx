import './App.css';
import AdminBooklist from './screens/adminMovielist';
import Home from './screens/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './screens/Login';
import Privacy from './screens/Privacy';
import AllMovies from './screens/AllMovies';
import MovieDetailsPage from './screens/MovieDetailsPage';
import NewMovieForm from './components/NewMovieForm';
import CreateUser from './screens/CreateUser';
import Landing from './screens/Landing';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/Home" element={<Home />}></Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/Admin" element={<AdminBooklist />}></Route>
          <Route path="/All" element={<AllMovies />}></Route>
          <Route path="/Privacy" element={<Privacy />}></Route>
          <Route path="/CreateUser" element={<CreateUser />}></Route>
          <Route path="/Landing" element={<Landing />}></Route>
          <Route
            path="/NewMovie"
            element={
              <NewMovieForm
                onSuccess={function (): void {
                  throw new Error('Function not implemented.');
                }}
                onCancel={function (): void {
                  throw new Error('Function not implemented.');
                }}
              />
            }
          ></Route>
          <Route
            path="/MovieDetailsPage/:id"
            element={<MovieDetailsPage />}
          ></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
