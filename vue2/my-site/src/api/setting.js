import request from "@/utils/request";

export async function getSetting() {
  return await request.get("/api/setting");
}
