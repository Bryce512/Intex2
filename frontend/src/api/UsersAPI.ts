const API_URL =
  "https://intex2-backend-ezargqcgdwbgd4hq.westus3-01.azurewebsites.net/User";

  export const handleLogin = async (e: React.FormEvent,
    setErrorMessage: Function,
    setLoading: Function,
    username: string,
    password: string,
    navigate: Function): Promise<void> => {

    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    console.log("Logging in with:", { username, password });

    try {
      // Send plain password to the server - it will handle hashing/verification
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Username: username,
          Password: password,
        }),
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      // Process successful login
      const data = await response.json();

      // Store user info (don't store the password!)
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user.id,
          username: data.user.username,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
        })
      );

      // Redirect to dashboard/home
      navigate("/dashboard");
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  export const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    setValidated: Function,
    isRateLimited: boolean,
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
    setErrorMessage: Function,
    setLoading: Function,
    setFailedAttempts: Function,
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
      Email: email,
      FirstName: firstName,
      LastName: lastName,
    };

    handleRegister(
      userData,
      setLoading,
      setErrorMessage,
      setValidated,
      handleClose,
      setFailedAttempts);
  };

  export const handleRegister = async (
    userData: object,
    setLoading: Function,
    setErrorMessage: Function,
    setValidated: Function,
    handleClose: void,
    setFailedAttempts: Function) => {
    setLoading(true);
    setErrorMessage("");

    console.log("Registering user:", userData);

    try {
      const response = await fetch(
        `${API_URL}/AddUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      // Check if the response is JSON before trying to parse it
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        console.log("JSON Response:", data);
      } else {
        // Not JSON, get as text instead
        const textResponse = await response.text();
        console.log(
          "Text Response (first 200 chars):",
          textResponse.substring(0, 200)
        );
        throw new Error("Server returned non-JSON response");
      }

      if (!response.ok) {
        throw new Error(data?.message || `Server error: ${response.status}`);
      }

      // Registration successful
      console.log("Registration successful:", data);

      // Reset validation state and close modal
      setValidated(false);
      handleClose;

      // You might want to automatically log the user in here
      // or show a success message
      alert("Registration successful! Please log in.");
    } catch (error: any) {
      // Increment failed attempts counter
      setFailedAttempts((prev:any) => prev + 1);

      // Set error message
      setErrorMessage(
        error.message || "Registration failed. Please try again."
      );

      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };