import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL+"/api";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
    (config)=>{
        const excludedPaths = ['/auth/login', '/auth/register','/auth/google'];

        try {
            
            const fullUrl = new URL(config.url, API_BASE_URL);
            const path = fullUrl.pathname;

            const shouldExclude = excludedPaths.includes(path);

            if (!shouldExclude) {
                const token = sessionStorage.getItem("token");
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }

        } catch (e) {
            
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const LoginWithGoogle = async(data)=>{
    try {
        return await apiClient.post("/auth/google", data,{ headers: { "Content-Type": "application/json" } } );
    } catch (error) {
        throw error.response ? error.response.data : error; 
    }
}


export const Login = async(data)=>{
    try {
        return await apiClient.post("/auth/login", data);
    } catch (error) {
        throw error.response ? error.response.data : error;    
    }
}

export const Logout = async()=>{
    try {
        sessionStorage.removeItem("token");
        return await apiClient.post("/auth/logout");
        
    } catch (error) {
        throw error.response ? error.response.data : error;    
    }
}

export const UserRegister = async(data)=>{
    try {
        return await apiClient.post("/auth/register/user",data);
    } catch (error) {
        throw error.response ? error.response.data : error;    
        
    }

}

export const SetRole = async(data)=>{
    try {
        return await apiClient.post("/auth/set/role",data);
    } catch (error) {
        throw error.response ? error.response.data : error;    
    }
}
export const GetUserDetails = async()=>{
    try {
        return await apiClient.get("/auth/get/user/details");
        
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const GetUser = async(id)=>{
    try {
        return await apiClient.get(`/auth/get/user/${id}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const UpdateUser = async(data)=>{
    try {
        return await apiClient.put("/auth/update/user", data);
    } catch (error) {
        throw error.response ? error.response.data : error;
        
    }
}

export const GetAllUsers = async()=>{
    try {
        return await apiClient.get("/auth/getAll/users");
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const GetUsersByRole = async(role)=>{
    try {
        return await apiClient.get(`/auth/get/users/role/${role}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
        
    }
}

export const RegisterEmployee = async(data)=>{
    try {
        return await apiClient.post("/auth/register/employee", data);
    } catch (error) {
        throw error.response ? error.response.data : error;
        
    }
}


export const GetAllRoles = async()=>{
    try {
        return await apiClient.get("/role");
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const GetAllEmployees = async()=>{
    try {
        return await apiClient.get("/auth/get/employees");
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}


// Invnentory
export const getAllInventoryItems = async() => {
    try {
        return await apiClient.get("/inventory");
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const updateInventoryItemStatus = async (id, status) => {
  try {
    return await apiClient.patch(`/inventory/${id}/status`, null, {
      params: { status }
    });
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getInventoryItemById = async(id) => {
    try {
        return await apiClient.get("/inventory/${id}");
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const createInventoryItem = async(data) => {
    try {
        return await apiClient.post("/inventory", data);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const updateInventoryItem = async(id, data) => {
    try {
        return await apiClient.put(`/inventory/${id}`, data);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const updateItemQuantity = async(id, data) =>{
    try {
        return await apiClient.patch(`/inventory/${id}/quantity`, data);
    } catch (error) {
        throw error.response ? error.response.data : error
    }
}

export const deleteInventoryItem = async(id) => {
    try {
        return await apiClient.delete(`/inventory/${id}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }

};

export const getGroupedInventoryItems = async() =>{
    try {
        return await apiClient.get("/inventory/grouped-by-category")
    } catch (error) {
        throw error.response ? error.response.data : error
    }
}

// Inventory Category
export const getAllCategories = async () => {
  try {
    return await apiClient.get("/inventory/category");
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const createCategory = async (data) => {
  try {
    return await apiClient.post("/inventory/category", data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const updateCategory = async (id, data) => {
  try {
    return await apiClient.put(`/inventory/category/${id}`, data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const deleteCategory = async (id, data) => {
  try {
    return await apiClient.delete(`/inventory/category/${id}`, data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};


// Booking

export const createBooking = async (data) => {
    try {
        return await apiClient.post("/bookings", data);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const updateBooking = async (id, data) => {
    try {
        return await apiClient.put(`/bookings/${id}`, data);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};


export const deleteBooking = async (id) => {
    try {
        return await apiClient.delete(`/bookings/${id}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getUserBookings = async (id) => {
    try {
        return await apiClient.get(`/bookings/me/${id}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getActiveBookings = async () => {
    try {
        return await apiClient.get("/bookings/active");
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getAllBookings = async()=>{
    try {
        return await apiClient.get("/bookings");
    } catch (error) {
        throw error.response ? error.response.data : error;
        
    }
}

export const checkIn = async (userId) => {
    try {
        return await apiClient.post(`/bookings/checkIn/${userId}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const checkOut = async (userId) => {
    try {
        return await apiClient.post(`/bookings/checkOut/${userId}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
    
};

// Ticket
export const createTicket = async (data) => {
    try {
        return await apiClient.post("/tickets", data);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getAllTickets = async () => {
    try {
        return await apiClient.get("/tickets");
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getTicketById = async (id) => {
    try {
        return await apiClient.get(`/tickets/${id}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getTicketByBookingId = async (bookingId) => {
    try {
        return await apiClient.get(`/tickets/booking/${bookingId}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getTicketsByUserId = async (userId) => {
    try {
        return await apiClient.get(`/tickets/user/${userId}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getActiveTickets = async () => {
    try {
        return await apiClient.get("/tickets/active");
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getPastTickets = async () => {
    try {
        return await apiClient.get("/tickets/past");
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const updateTicket = async (id, data) => {
    try {
        return await apiClient.put(`/tickets/${id}`, data);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const deleteTicket = async (id) => {
    try {
        return await apiClient.delete(`/tickets/${id}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getAllRoomTypes = async()=>{
    try {
        return await apiClient.get("/room_type")
    } catch (error) {
        throw error.response ? error.response.data : error;
        
    }
}

export const getRoomTypeById = async(id)=>{
    try {
        return await apiClient.get(`/room_type/${id}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const getAllRooms = async()=>{
    try {
        return await apiClient.get("/room");
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const getRoomById = async(id)=>{
    try {
        return await apiClient.get(`/room/${id}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const getRoomByStatus = async(status)=>{
    try {
        return await apiClient.get(`/room/status/${status}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const createRoom = async(data)=>{
    try {
        return await apiClient.post("/room", data);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const updateRoom = async(id, data)=>{
    try {
        return await apiClient.put(`/room/${id}`, data);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const deleteRoom = async (id) =>{
    try {
        return await apiClient.delete(`/room/${id}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const getAllRoomServices = async () => {
  try {
    return await apiClient.get("/room-services");
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getRoomServiceById = async (id) => {
  try {
    return await apiClient.get(`/room-services/${id}`);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};


export const getRoomServicesByBookingId = async (bookingId) => {
  try {
    return await apiClient.get(`/room-services/booking/${bookingId}`);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};


export const getRoomServicesByStatus = async (status) => {
  try {
    return await apiClient.get(`/room-services/status/${status}`);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};


export const createRoomService = async (data) => {
  try {
    return await apiClient.post("/room-services", data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};


export const updateRoomService = async (id, data) => {
  try {
    return await apiClient.put(`/room-services/${id}`, data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const deleteRoomService = async (id) => {
  try {
    return await apiClient.delete(`/room-services/${id}`);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getAllRoomCleanings = async () => {
  try {
    return await apiClient.get("/room-cleaning");
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getRoomCleaningById = async (id) => {
  try {
    return await apiClient.get(`/room-cleaning/${id}`);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getRoomCleaningSummaries = async () => {
  try {
    return await apiClient.get("/room-cleaning/room-summary");
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const PostRoomCleaningRecord = async (data) => {
  try {
    return await apiClient.post("/room-cleaning", data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const updateRoomCleaning = async (id, data) => {
  try {
    return await apiClient.put(`/room-cleaning/${id}`, data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const deleteRoomCleaning = async (id) => {
  try {
    return await apiClient.delete(`/room-cleaning/${id}`);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getRoomCleaningByRoomId = async (id) => {
  try {
    return await apiClient.get(`/room-cleaning/room/${id}`);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getActiveBookingByRoomId = async (id) => {
  try {
    return await apiClient.get(`/bookings/active/room/${id}`);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getAllServicesTypes = async()=>{
    try {
        return await apiClient.get("/room-service-types");
    } catch (error) {
        throw error.response ? error.response.data : error;
        
    }
}

export const getServiceTypeById = async(id)=>{
    try {
        return await apiClient.get(`/room-service-types/${id}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const createServiceType = async(data)=>{
    try {
        return await apiClient.post("/room-service-types", data);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const updateServiceType = async(id, data)=>{
    try {
        return await apiClient.put(`/room-service-types${id}`, data);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const deleteServiceType = async (id) => {
    try {
        return await apiClient.delete(`/room-service-types/${id}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const validateCardPayment = async (data) => {
  try {
    return await apiClient.post("/payment-methods/validate-card", data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const processDeposit = async (data) => {
  try {
    return await apiClient.post("/payment-methods/process-deposit", data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const processFullPayment = async (data) => {
  try {
    return await apiClient.post("/payment-methods/process-full-payment", data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const processBookingPayment = async (data) => {
  try {
    return await apiClient.post("/payments/booking", data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const processCheckInPayment = async (data) => {
  try {
    return await apiClient.post("/payments/checkin", data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const processCheckOutPayment = async (data) => {
  try {
    return await apiClient.post("/payments/checkout", data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
