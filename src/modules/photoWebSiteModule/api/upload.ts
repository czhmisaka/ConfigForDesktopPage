import { getPreUrl, request } from "@/utils/api/requests";
import { getHeaders } from "@/utils/api/user/header";




export const uploadFile = async (file: any) => {
    var formData = new FormData();
    formData.append("file", file);
    let res = await request({
        url: getPreUrl() + '/admin/picture/pictureInfo/upload',
        method: 'POST',
        data: formData,
        headers: {
            ...getHeaders(),
            "Content-Type": "multipart/form-data"
        },
    })
    return res
}



// 调用图片id获取
export const createTagsFromImageID = async (photoId: string)=>{

}