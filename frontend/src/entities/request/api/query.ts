import { client } from "@/shared/api";
import { 
  CreateRequestDto, 
  Request, 
  UpdateRequestDto, 
  UpdateRequestStatusDto 
} from "../model/types/request";
import { requestsApi } from "./api";

const getAll = async () => {
  try {
    const response = await client.get<Request[]>(requestsApi.root);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getById = async (id: number) => {
  try {
    const response = await client.get<Request>(requestsApi.byId(id));
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const create = async (data: CreateRequestDto) => {
  try {
    const response = await client.post<Request>(requestsApi.root, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const update = async (id: number, data: UpdateRequestDto) => {
  try {
    const response = await client.put<Request>(requestsApi.byId(id), data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateStatus = async (id: number, data: UpdateRequestStatusDto) => {
  try {
    const response = await client.put<Request>(requestsApi.updateStatus(id), data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const search = async (query: string) => {
  try {
    const response = await client.get<Request[]>(requestsApi.search, { params: { q: query } });
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const assignMaster = async (requestId: number, masterId: string) => {
  try {
    const response = await client.put(requestsApi.assignMaster(requestId, masterId));
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const requestQuery = {
  getAll,
  getById,
  create,
  update,
  updateStatus,
  search,
  assignMaster
};
