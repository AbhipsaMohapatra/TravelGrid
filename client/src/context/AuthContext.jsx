import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Mock user data for demonstration
    const mockUsers = [
        {
            id: 1,
            email: 'demo@travelgrid.com',
            password: 'password123',
            name: 'John Doe',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
            id: 2,
            email: 'jane@travelgrid.com',
            password: 'password123',
            name: 'Jane Smith',
            avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
        }
    ];

    // Check for stored user session on app load
    useEffect(() => {
        const storedUser = localStorage.getItem('travelgrid_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                localStorage.removeItem('travelgrid_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const foundUser = mockUsers.find(
            u => u.email === email && u.password === password
        );

        if (foundUser) {
            const userSession = {
                id: foundUser.id,
                email: foundUser.email,
                name: foundUser.name,
                avatar: foundUser.avatar
            };

            setUser(userSession);
            localStorage.setItem('travelgrid_user', JSON.stringify(userSession));
            setIsLoading(false);
            return { success: true };
        } else {
            setIsLoading(false);
            return { success: false, error: 'Invalid email or password' };
        }
    };

    const signup = async (userData) => {
        setIsLoading(true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if email already exists
        const emailExists = mockUsers.some(u => u.email === userData.email);

        if (emailExists) {
            setIsLoading(false);
            return { success: false, error: 'Email already exists' };
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            email: userData.email,
            name: userData.name,
            avatar: `https://randomuser.me/api/portraits/${userData.name.toLowerCase().includes('jane') || userData.name.toLowerCase().includes('maria') ? 'women' : 'men'}/${Math.floor(Math.random() * 90) + 1}.jpg`
        };

        setUser(newUser);
        localStorage.setItem('travelgrid_user', JSON.stringify(newUser));
        setIsLoading(false);
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('travelgrid_user');
    };

    const value = {
        user,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user from cookie session
  const fetchUser = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Signup
  const signup = async ({ name, email, password }) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || data.message };

      setUser(data.user);
      toast.success("Signup successful! 🎉");
      return { success: true };
    } catch (err) {
      return { success: false, error: "Signup failed" };
    } finally {
      setIsLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // very important
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || data.message };

      setUser(data.user);
      toast.success("Login successful 👋");
      return { success: true };
    } catch (err) {
      return { success: false, error: "Login failed" };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      toast.success("Logged out 👋");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

