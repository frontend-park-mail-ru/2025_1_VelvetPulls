import { UserStorage } from "@/entities/User";
import { API } from "@/shared/api/api";
import { ProfileRequest, ProfileResponse } from "@/shared/api/types";

export const genProfileData = async (
  profileData: ProfileRequest,
  avatar: File,
) => {
  const formData: FormData = new FormData();
  const profileData1 = {
    username: profileData.name,
    birth_date: profileData.birthdate,
    password: profileData.bio,
  };
  const jsonProfileData = JSON.stringify(profileData1);
  console.log(profileData,jsonProfileData)
  formData.append("profile_data", jsonProfileData);
  formData["profile_data"]=jsonProfileData
  console.log(formData)
  formData.append("avatar", avatar);
  formData["avatar"]=avatar
  console.log(profileData,formData)

  const response = await API.putFormData<ProfileResponse>("/profile", formData);
  console.log(response)
  if (!response.error) {
    UserStorage.setUserName(profileData.name);
    return "";
  }
  const errorMessage = response.error;
  return errorMessage;
};
