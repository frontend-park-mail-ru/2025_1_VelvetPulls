import { API } from "@/shared/api/api";
import { EmptyResponse, SendMessageRequest } from "@/shared/api/types";

export const SendMessage = async (chatId : string, text : string, files? : File[], photos? : File[]) => {
    const formData = new FormData();
    formData.append("text", JSON.stringify({
        "message":text,
    }));
    files?.map((file) => {
        formData.append('files', file);
    })
    photos?.map((photo) => {
        formData.append('photos', photo);
    })
    // console.log(formData.get("text"),formData)

    const response = await API.postFormData(
        `/chat/${chatId}/messages`,
        formData,
      );
    console.log(response)

    return response;
};