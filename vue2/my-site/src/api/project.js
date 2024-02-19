import request from "@/utils/request";

export async function getProjects() {
  return await request.get("/api/project");
}
