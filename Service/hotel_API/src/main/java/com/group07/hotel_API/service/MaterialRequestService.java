package com.group07.hotel_API.service;

import com.group07.hotel_API.dto.request.MaterialRequest.MaterialRequestRequest;
import com.group07.hotel_API.dto.response.MaterialRequest.MaterialRequestResponse;

import java.util.List;

public interface MaterialRequestService {
    MaterialRequestResponse createRequest(MaterialRequestRequest request, String username);
    List<MaterialRequestResponse> getAllRequests();
    List<MaterialRequestResponse> getMyRequests(String username);
    MaterialRequestResponse getRequestById(Long id);
    MaterialRequestResponse approveRequest(Long id);
    MaterialRequestResponse rejectRequest(Long id);
}


