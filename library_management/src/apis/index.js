import axios from "axios";
import { API_ROOT } from "../ultils/constants";

// method post để đẩy dữ liệu lên server ,nhận 2 tham số,Id và data
// method put để cập nhật lại dữ liệu,nhận 2 tham số,Id và data
// method get để lấy dữ liệu về

//API Columns
export const createNewAccountApi = async (newAccountData) => {
  const response = await axios.post(`${API_ROOT}/login`, newAccountData);
  return response.data;
};
