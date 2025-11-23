import axios from "axios";

import { getAPIBaseURL } from "../config/config";

let apiClient = null;

const getClient = ()=>{
  if(!apiClient){
    apiClient = axios.create({
      baseURL: getAPIBaseURL() + "/api",
    })

    
    apiClient.interceptors.request.use(
  (config) => {
    const excluded = [
      "/auth/login",
      "/auth/register/user",
      "/auth/google",
    ];

    const path = config.url; 

    const isExcluded = excluded.some((ex) => path.includes(ex));

    if (!isExcluded) {
      const token = sessionStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);
  }

  return apiClient;

}




export const LoginWithGoogle = async(data)=>{
    try {
        return await getClient().post("/auth/google", data,{ headers: { "Content-Type": "application/json" } } );
    } catch (error) {
        throw error.response ? error.response.data : error; 
    }
}


export const Login = async(data)=>{
    try {
        return await getClient().post("/auth/login", data);
    } catch (error) {
        throw error.response ? error.response.data : error;    
    }
}

export const Logout = async()=>{
    try {
        sessionStorage.removeItem("token");
        return await getClient().post("/auth/logout");
        
    } catch (error) {
        throw error.response ? error.response.data : error;    
    }
}

export const UserRegister = async(data)=>{
    try {
        return await getClient().post("/auth/register/user",data);
    } catch (error) {
        throw error.response ? error.response.data : error;    
        
    }

}

export const SetRole = async(data)=>{
    try {
        return await getClient().post("/auth/set/role",data);
    } catch (error) {
        throw error.response ? error.response.data : error;    
    }
}
export const GetUserDetails = async()=>{
    try {
        return await getClient().get("/auth/get/user/details");
        
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const GetUser = async(id)=>{
    try {
        return await getClient().get(`/auth/get/user/${id}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const UpdateUser = async(data)=>{
    try {
        return await getClient().put("/auth/update/user", data);
    } catch (error) {
        throw error.response ? error.response.data : error;
        
    }
}

export const GetAllUsers = async()=>{
    try {
        return await getClient().get("/auth/getAll/users");
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const GetUsersByRole = async(role)=>{
    try {
        return await getClient().get(`/auth/get/users/role/${role}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
        
    }
}

export const RegisterEmployee = async(data)=>{
    try {
        return await getClient().post("/auth/register/employee", data);
    } catch (error) {
        throw error.response ? error.response.data : error;
        
    }
}


export const GetAllRoles = async()=>{
    try {
        return await getClient().get("/role");
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const GetAllEmployees = async()=>{
    try {
        return await getClient().get("/auth/get/employees");
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}


// Invnentory
export const getAllInventoryItems = async() => {
    try {
        return await getClient().get("/inventory");
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const updateInventoryItemStatus = async (id, status) => {
  try {
    return await getClient().patch(`/inventory/${id}/status`, null, {
      params: { status }
    });
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getInventoryItemById = async(id) => {
    try {
        return await getClient().get("/inventory/${id}");
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const createInventoryItem = async(data) => {
    try {
        return await getClient().post("/inventory", data);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const updateInventoryItem = async(id, data) => {
    try {
        return await getClient().put(`/inventory/${id}`, data);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const updateItemQuantity = async(id, quantity) =>{
    try {
        return await getClient().patch(`/inventory/${id}/quantity`, quantity, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        throw error.response ? error.response.data : error
    }
}

export const getLowStockItems = async() => {
    try {
        return await getClient().get("/inventory/low-stock");
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const updateItemQuantityWithLog = async(id, quantity, userId, action) => {
    try {
        console.log("API: Llamando updateItemQuantityWithLog - ID:", id, "cantidad:", quantity, "userId:", userId, "action:", action);
        const response = await getClient().patch(`/inventory/${id}/quantity-with-log`, {
            quantity,
            userId,
            action
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log("API: updateItemQuantityWithLog completado exitosamente", response);
        return response;
    } catch (error) {
        console.error("API: Error en updateItemQuantityWithLog", error);
        throw error.response ? error.response.data : error;
    }
};

export const deleteInventoryItem = async(id) => {
    try {
        return await getClient().delete(`/inventory/${id}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }

};

export const getGroupedInventoryItems = async() =>{
    try {
        return await getClient().get("/inventory/grouped-by-category")
    } catch (error) {
        throw error.response ? error.response.data : error
    }
}

// Inventory Category
export const getAllCategories = async () => {
  try {
    return await getClient().get("/inventory/category");
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const createCategory = async (data) => {
  try {
    return await getClient().post("/inventory/category", data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const updateCategory = async (id, data) => {
  try {
    return await getClient().put(`/inventory/category/${id}`, data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const deleteCategory = async (id, data) => {
  try {
    return await getClient().delete(`/inventory/category/${id}`, data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};


// Booking

export const createBooking = async (data) => {
    try {
        return await getClient().post("/bookings", data);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const updateBooking = async (id, data) => {
    try {
        return await getClient().put(`/bookings/${id}`, data);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};


export const deleteBooking = async (id) => {
    try {
        return await getClient().delete(`/bookings/${id}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getUserBookings = async (id) => {
    try {
        return await getClient().get(`/bookings/me/${id}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getBookingHistory = async (userId) => {
    try {
        return await getClient().get(`/bookings/history/${userId}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

// Admin booking history endpoints
export const getAllBookingHistory = async () => {
    try {
        return await getClient().get("/bookings/admin/history");
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const updateBookingHistory = async (bookingId, data) => {
    try {
        return await getClient().put(`/bookings/admin/history/${bookingId}`, data);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const deleteBookingHistoryRecord = async (bookingId) => {
    try {
        return await getClient().delete(`/bookings/admin/history/${bookingId}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const recalculateInvoice = async (bookingId) => {
    try {
        return await getClient().post(`/bookings/admin/history/${bookingId}/recalculate-invoice`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getActiveBookings = async () => {
    try {
        return await getClient().get("/bookings/active");
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getAllBookings = async()=>{
    try {
        return await getClient().get("/bookings");
    } catch (error) {
        throw error.response ? error.response.data : error;
        
    }
}

export const checkIn = async (userId) => {
    try {
        return await getClient().post(`/bookings/checkIn/${userId}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const checkOut = async (userId) => {
    try {
        return await getClient().post(`/bookings/checkOut/${userId}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
    
};

// Ticket
export const createTicket = async (data) => {
    try {
        return await getClient().post("/tickets", data);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getAllTickets = async () => {
    try {
        return await getClient().get("/tickets");
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getTicketById = async (id) => {
    try {
        return await getClient().get(`/tickets/${id}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getTicketByBookingId = async (bookingId) => {
    try {
        return await getClient().get(`/tickets/booking/${bookingId}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getTicketsByUserId = async (userId) => {
    try {
        return await getClient().get(`/tickets/user/${userId}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getActiveTickets = async () => {
    try {
        return await getClient().get("/tickets/active");
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getPastTickets = async () => {
    try {
        return await getClient().get("/tickets/past");
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const updateTicket = async (id, data) => {
    try {
        return await getClient().put(`/tickets/${id}`, data);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const deleteTicket = async (id) => {
    try {
        return await getClient().delete(`/tickets/${id}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getAllRoomTypes = async()=>{
    try {
        return await getClient().get("/room_type")
    } catch (error) {
        throw error.response ? error.response.data : error;
        
    }
}

export const getRoomTypeById = async(id)=>{
    try {
        return await getClient().get(`/room_type/${id}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const getAllRooms = async()=>{
    try {
        return await getClient().get("/room");
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const getRoomById = async(id)=>{
    try {
        return await getClient().get(`/room/${id}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const getRoomByStatus = async(status)=>{
    try {
        return await getClient().get(`/room/status/${status}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const createRoom = async(data)=>{
    try {
        return await getClient().post("/room", data);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const updateRoom = async(id, data)=>{
    try {
        return await getClient().put(`/room/${id}`, data);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const deleteRoom = async (id) =>{
    try {
        return await getClient().delete(`/room/${id}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const getAllRoomServices = async () => {
  try {
    return await getClient().get("/room-services");
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getRoomServiceById = async (id) => {
  try {
    return await getClient().get(`/room-services/${id}`);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};


export const getRoomServicesByBookingId = async (bookingId) => {
  try {
    return await getClient().get(`/room-services/booking/${bookingId}`);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};


export const getRoomServicesByStatus = async (status) => {
  try {
    return await getClient().get(`/room-services/status/${status}`);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};


export const createRoomService = async (data) => {
  try {
    return await getClient().post("/room-services", data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};


export const updateRoomService = async (id, data) => {
  try {
    return await getClient().put(`/room-services/${id}`, data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const deleteRoomService = async (id) => {
  try {
    return await getClient().delete(`/room-services/${id}`);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getAllRoomCleanings = async () => {
  try {
    return await getClient().get("/room-cleaning");
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getRoomCleaningById = async (id) => {
  try {
    return await getClient().get(`/room-cleaning/${id}`);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getRoomCleaningSummaries = async () => {
  try {
    return await getClient().get("/room-cleaning/room-summary");
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const PostRoomCleaningRecord = async (data) => {
  try {
    return await getClient().post("/room-cleaning", data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const updateRoomCleaning = async (id, data) => {
  try {
    return await getClient().put(`/room-cleaning/${id}`, data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const deleteRoomCleaning = async (id) => {
  try {
    return await getClient().delete(`/room-cleaning/${id}`);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getRoomCleaningByRoomId = async (id) => {
  try {
    return await getClient().get(`/room-cleaning/room/${id}`);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getActiveBookingByRoomId = async (id) => {
  try {
    return await getClient().get(`/bookings/active/room/${id}`);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getAllServicesTypes = async()=>{
    try {
        return await getClient().get("/room-service-types");
    } catch (error) {
        throw error.response ? error.response.data : error;
        
    }
}

export const getServiceTypeById = async(id)=>{
    try {
        return await getClient().get(`/room-service-types/${id}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const createServiceType = async(data)=>{
    try {
        return await getClient().post("/room-service-types", data);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const updateServiceType = async(id, data)=>{
    try {
        return await getClient().put(`/room-service-types${id}`, data);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const deleteServiceType = async (id) => {
    try {
        return await getClient().delete(`/room-service-types/${id}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const validateCardPayment = async (data) => {
  try {
    return await getClient().post("/payment-methods/validate-card", data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const processDeposit = async (data) => {
  try {
    return await getClient().post("/payment-methods/process-deposit", data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const processFullPayment = async (data) => {
  try {
    return await getClient().post("/payment-methods/process-full-payment", data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const processBookingPayment = async (data) => {
  try {
    return await getClient().post("/payments/booking", data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const processCheckInPayment = async (data) => {
  try {
    return await getClient().post("/payments/checkin", data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const processCheckOutPayment = async (data) => {
  try {
    return await getClient().post("/payments/checkout", data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getRoomSummary = async () => {
  try {
    return await getClient().get("/room/summary");
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getRandomAvailableRooms = async () => {
  try {
    return await getClient().get("/room/random");
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getBookingById = async (id) => {
    try {
        return await getClient().get(`/bookings/${id}`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }

    
};


export const cancelBooking = async (id) => {
    try {
        return await getClient().put(`/bookings/${id}/cancel`);
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const modifyBooking = async (id, data) => {
  try {
    return await getClient().put(`/bookings/${id}/modify`, data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Material Request Services
export const createMaterialRequest = async (data) => {
  try {
    return await getClient().post("/inventory/requests", data);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getMyMaterialRequests = async () => {
  try {
    return await getClient().get("/inventory/requests/me");
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getAllMaterialRequests = async () => {
  try {
    return await getClient().get("/inventory/requests");
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getMaterialRequestById = async (id) => {
  try {
    return await getClient().get(`/inventory/requests/${id}`);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getBookingServices = async (bookingId) => {
  return await getClient().get(`/bookings/booking/${bookingId}/services`);
};

export const getRoomTypeReviews = async (roomTypeId) => {
  try {
    return await getClient().get(`/room_type/${roomTypeId}/reviews`);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const createRoomTypeReview = async (roomTypeId, body) => {
  try {
    return await getClient().post(`/room_type/${roomTypeId}/reviews`, body, {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const deleteRoomTypeReview = async (roomTypeId, reviewId) => {
  try {
    return await getClient().delete(`/room_type/${roomTypeId}/reviews/${reviewId}`);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getRoomTypeReviewsSummary = async (roomTypeId) => {
  try {
    return await getClient().get(`/room_type/${roomTypeId}/reviews/summary`);
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
