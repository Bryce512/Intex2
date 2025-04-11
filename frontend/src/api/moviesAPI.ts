import { Movie } from '../types/movies';
import { NewMovie } from '../types/newMovie';

interface fetchMoviesResponse {
  movies: Movie[];
  totalNumMovies: number;
}

const API_URL = import.meta.env.VITE_API_URL || window.APP_CONFIG?.API_URL;

// Handle login using plain username/password
export const handleLogin = async (
  e: React.FormEvent,
  setErrorMessage: Function,
  setLoading: Function,
  username: string,
  password: string,
  navigate: Function
): Promise<void> => {
  e.preventDefault();
  setErrorMessage('');
  setErrorMessage('');
  setLoading(true);

  try {
    const response = await fetch(
      `${API_URL}/login?useCookies=true&useSessionCookies=false`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Send JSON data
        },
        body: JSON.stringify({
          email: username,
          password: password,
          twoFactorCode: 'string',
          twoFactorRecoveryCode: 'string',
        }),
        credentials: 'include', // ✅ This must be outside the body!
      }
    );

    console.log('Login response:', response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    // If the login is successful, redirect the user
    navigate('/Home');
  } catch (error: any) {
    setErrorMessage(error.message || 'Failed to login. Please try again.');
  } finally {
    setLoading(false);
  }
};

// Register new user
export const handleSubmit = (
  event: React.FormEvent<HTMLFormElement>,
  setValidated: Function,
  isRateLimited: boolean,
  username: string,
  password: string,
  email: string,
  name: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setFailedAttempts: React.Dispatch<React.SetStateAction<number>>,
  handleClose: Function
) => {
  event.preventDefault();
  event.stopPropagation();

  const form = event.currentTarget;

  if (form.checkValidity() === false) {
    setValidated(true);
    return;
  }

  if (isRateLimited) {
    return; // Don't proceed if rate limited
  }

  // Create user object and call the registration function
  const userData = {
    Username: username, // Verify if it's Username with capital 'U'
    Password: password,
    Name: name,
    Email: email,
  };

  handleRegister(
    userData,
    setLoading,
    setErrorMessage,
    setValidated,
    handleClose,
    setFailedAttempts
  );
};

// Register the user
export const handleRegister = async (
  userData: any,
  setLoading: Function,
  setErrorMessage: Function,
  setValidated: Function,
  handleClose: Function,
  setFailedAttempts: Function
) => {
  setLoading(true);
  setErrorMessage('');

  console.log('Registering user:', userData);

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: userData.Password,
        email: userData.Email,
      }),
    });

    // Check if the response is JSON before trying to parse it
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('JSON Response:', data);
    } else {
      // Read the response as text first
      const responseText = await response.text();
      console.log(
        'Response (first 200 chars):',
        responseText.substring(0, 200)
      );

      // Check if response is empty (successful registration)
      if (responseText.trim() === '' && response.ok) {
        // Empty response with OK status means success
        console.log('Registration successful (empty response)');
        data = { success: true };
      } else {
        try {
          // Try to parse the text as JSON
          data = JSON.parse(responseText);
          console.log('JSON Response:', data);
        } catch (e) {
          console.error('Failed to parse response as JSON:', e);
          throw new Error('Server returned non-JSON response');
        }
      }

      if (!response.ok) {
        // Log all validation errors
        if (data?.errors) {
          console.log('Validation errors:', data.errors);

          // Handle specific known errors
          if (data.errors.PasswordTooShort) {
            throw new Error(data.errors.PasswordTooShort[0]);
          }
          if (data.errors.DuplicateUserName) {
            throw new Error(data.errors.DuplicateUserName[0]);
          }

          // If there are other errors, get the first one
          const firstErrorType = Object.keys(data.errors)[0];
          if (firstErrorType && data.errors[firstErrorType][0]) {
            throw new Error(data.errors[firstErrorType][0]);
          }
        }

        throw new Error(
          data?.message || data?.title || `Server error: ${response.status}`
        );
      }
    }

    // Registration successful
    console.log('Registration successful:', data);

    // Set a success message instead of an alert
    setErrorMessage('Registration successful! Logging you in...');

    // Add a class to style the success message with green background
    // This will need a corresponding CSS style
    document
      .querySelector('.custom-alert-danger')
      ?.classList.add('custom-alert-success');

    // Reset validation state
    setValidated(false);

    // Wait 2 seconds before logging in
    setTimeout(() => {
      // Log the user in automatically using their registration credentials
      fetch(`${API_URL}/login?useCookies=true&useSessionCookies=false`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.Email,
          password: userData.Password,
          twoFactorCode: 'string',
          twoFactorRecoveryCode: 'string',
        }),
        credentials: 'include',
      })
        .then((response) => {
          if (response.ok) {
            // Close registration modal
            handleClose();

            // Navigate to home page
            window.location.href = '/Home';
          } else {
            // If auto-login fails, show message and let user log in manually
            setErrorMessage('Registration successful! Please log in manually.');
            handleClose();
          }
        })
        .catch(() => {
          // If there's a network error during auto-login
          setErrorMessage('Registration successful! Please log in manually.');
          handleClose();
        });
    }, 100);
  } catch (error: any) {
    // Increment failed attempts counter
    setFailedAttempts((prev: any) => prev + 1);

    // Set error message
    setErrorMessage(error.message || 'Registration failed. Please try again.');

    console.error('Registration error:', error);
  } finally {
    setLoading(false);
  }
};

export const fetchMovies = async (
  page: number,
  resultsPerPage: number,
  searchTerm: string = ''
): Promise<fetchMoviesResponse> => {
  const url = `${API_URL}/Movies/AllMovies?pageNum=${page}&resultsPerPage=${resultsPerPage}&searchTerm=${searchTerm}`;
  console.log('Fetching movies with URL:', url);

  const response = await fetch(url, { credentials: 'include' });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  console.log('Fetched movies:', data);

  return data;
};

export const addMovie = async (newMovie: NewMovie): Promise<NewMovie> => {
  try {
    const response = await fetch(`${API_URL}/Movies/AddMovie`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(newMovie),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding movie:', error);
    throw error;
  }
};

export const updateMovie = async (
  showId: string,
  updatedMovie: Movie
): Promise<Movie> => {
  try {
    const response = await fetch(`${API_URL}/Movies/UpdateMovie/${showId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updatedMovie),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating movie:', error);
    throw error;
  }
};

export const deleteMovie = async (showId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/Movies/DeleteMovie/${showId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting movie:', error);
    throw error;
  }
};

export const fetchMovieById = async (showId: string): Promise<Movie> => {
  const response = await fetch(`${API_URL}/Movies/GetMovieDetails/${showId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  console.log('Fetched movie by ID:', data);

  return data;
};

export const fetchAllMoviesMax = async (
  page: number = 1,
  pageSize: number = 20,
  search: string = '',
  genres: string = ''
): Promise<{ result: Array<Movie>; hasMore: boolean }> => {
  const url = new URL(`${API_URL}/Movies/AllMoviesMax`);

  // Add all parameters
  url.searchParams.append('page', String(page));
  url.searchParams.append('pageSize', String(pageSize));
  if (search) url.searchParams.append('search', search);
  if (genres) url.searchParams.append('genres', genres);

  const response = await fetch(url.toString(), {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  console.log('Fetched movies with search:', data);

  return data;
};

export const fetchUserRoles = async (): Promise<string[]> => {
  const response = await fetch(`${API_URL}/pingauth`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('Fetched user data:', data);

  const roles = data.roles;
  if (!Array.isArray(roles) || roles.length === 0) {
    throw new Error('No roles found in the response');
  }

  return roles;
};
