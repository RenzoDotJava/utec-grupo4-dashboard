import { ContainerService } from "./container.service";
import { HttpService } from "./http.service";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

const httpService = new HttpService(apiUrl);
const containerService = new ContainerService(httpService);

export const services = {
  container: containerService,
};
