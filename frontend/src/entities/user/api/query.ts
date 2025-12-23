import { client } from "@/shared/api";
import { UserDTO } from "../types/user";
import { userApi } from "./api";

const getProfile = async () => {
  try {
    const response = await client.get<UserDTO>(userApi.profile);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getClients = async () => {
  const response = await client.get<UserDTO[]>(userApi.byRole({ role: "CLIENT" }));
  return response.data;
}

const getSpecialists = async () => {
  const response = await client.get<UserDTO[]>(userApi.byRole({ role: "SPECIALIST" }));
  return response.data;
}


export const userQuery = {
  getProfile,
  getClients,
  getSpecialists
}