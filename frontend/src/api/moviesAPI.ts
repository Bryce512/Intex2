// const API_URL = "https://intex2-backend-ezargqcgdwbgd4hq.westus3-01.azurewebsites.net/User";
const API_URL = 'https://localhost:5000'; // For local development

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
  setLoading(true);

  try {

    const response = await fetch(`${API_URL}/login`, {
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
    });

    console.log('Login response:', response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    // If the login is successful, redirect the user
    navigate('/');
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
  handleClose: void
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
    // Make sure these property names match EXACTLY what's in your C# User model
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
  handleClose: void,
  setFailedAttempts: Function
) => {
  setLoading(true);
  setErrorMessage('');

  console.log('Registering user:', userData);

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: userData.Password,
        email: userData.Email
      }),
    });

    // Check if the response is JSON before trying to parse it
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('JSON Response:', data);
    } else {
      // Not JSON, get as text instead
      const textResponse = await response.text();
      console.log(
        'Text Response (first 200 chars):',
        textResponse.substring(0, 200)
      );
      throw new Error('Server returned non-JSON response');
    }

    if (!response.ok) {
      throw new Error(data?.message || `Server error: ${response.status}`);
    }

    // Registration successful
    console.log('Registration successful:', data);

    // Reset validation state and close modal
    setValidated(false);
    handleClose;

    // You might want to automatically log the user in here
    // or show a success message
    alert('Registration successful! Please log in.');
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
