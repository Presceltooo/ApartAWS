// import {
//   deleteFile as delFile,
//   downloadFile,
//   multiUploadFile as multiUploadFiles,
//   singleUploadFile,
// } from "@shared/services/api";
// import useNotification from "./useNotification";
// import useServerErrorMsg from "./useServerErrorMsg";

// export const useFileManagementService = () => {
//   const { showErrorNotify } = useNotification();
//   const { ERROR_CODE_MSG } = useServerErrorMsg();
//   const errorMessages = ERROR_CODE_MSG as Record<string, string>;

//   class FileManagementService {
//     constructor() {
//       this.preview = this.preview.bind(this);
//       this.getFullUrl = this.getFullUrl.bind(this);
//     }

//     async uploadFile(payload: any): Promise<string | null> {
//       const rs = await singleUploadFile(payload);
//       if (!rs?.success) {
//         showErrorNotify("Tải tệp lên thất bại!");
//         return null;
//       }

//       return rs.data;
//     }

//     async multiUploadFile(payload: any) {
//       const rs = await multiUploadFiles(payload);
//       if (!rs?.success) {
//         showErrorNotify("Tải tệp lên thất bại!");
//         return null;
//       }

//       return rs.data;
//     }

//     async deleteFile(payload: any): Promise<boolean> {
//       const rs = await delFile(payload);
//       if (!rs?.success) {
//         const msg = errorMessages[rs?.message] ?? "Xóa tệp thất bại!";
//         showErrorNotify(msg);
//         return false;
//       }

//       return true;
//     }

//     getFullUrl(url: string): string {
//       if (!url || typeof url !== "string") return "";
//       if (url.includes("http")) return url;

//       return `${import.meta.env.VITE_RESOURCE_URL}${url}`;
//     }

//     getFileName(url: string | null | undefined): string {
//       if (!url || typeof url !== "string") return "";

//       const urlArr = url.split("/");
//       return urlArr[urlArr.length - 1];
//     }

//     public getFileDownload(url: string): string {
//       const urlArr = url.split("/");
//       const index = urlArr.indexOf("public");

//       return urlArr.slice(index).join("/");
//     }

//     preview(url: string) {
//       const ext = this.getExtensionFromUrl(url);
//       if (!ext) return null;

//       const previewUrl = url.includes("http") ? url : this.getFullUrl(url);

//       if (["doc", "docx", "xls", "xlsx"].includes(ext)) {
//         const encodedUrl = encodeURIComponent(previewUrl);
//         window.open(
//           `https://docs.google.com/gview?url=${encodedUrl}&embedded=true`
//         );
//         return;
//       }

//       if (ext === "pdf") {
//         window.open(`https://docs.google.com/gview?url=${previewUrl}`);
//         return;
//       }

//       if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) {
//         window.open(previewUrl, "_blank");
//         return;
//       }

//       showErrorNotify("Tài liệu không hỗ trợ xem trước!");
//     }

//     getExtensionFromUrl(url: string) {
//       if (!url || typeof url !== "string") return null;

//       const cleanPath = url.split("?")[0].split("#")[0];
//       const lastDot = cleanPath.lastIndexOf(".");
//       if (lastDot === -1) return null;

//       const ext = cleanPath.slice(lastDot + 1);
//       if (!ext || ext.includes("/") || ext.includes("\\")) return null;

//       return ext.toLowerCase();
//     }

//     async download(objectName: string, cb?: () => void): Promise<void> {
//       if (!objectName) return;

//       let objName = objectName;
//       const projectName =
//         import.meta.env.VITE_RESOURCE_PROJECT_URL ?? "cmc-dtqg";

//       if (objName.includes(projectName)) {
//         const objNameArr = objName.split(`${projectName}/`);
//         objName = objNameArr[objNameArr.length - 1];
//       }

//       const res = await downloadFile({ objectName: objName });

//       if (!(res instanceof ArrayBuffer)) {
//         console.error("Response is not ArrayBuffer", res);
//         return;
//       }

//       const fileName = objectName.split("/").pop() || "download";
//       const blob = new Blob([res], {
//         type: "application/octet-stream",
//       });
//       const url = URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = url;
//       link.download = fileName;

//       document.body.appendChild(link);
//       link.click();
//       cb?.();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//     }
//   }

//   return new FileManagementService();
// };

// export default useFileManagementService;
