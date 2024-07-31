import { ContainerService } from "./container.service";
import { HttpService } from "./http.service";

const httpService = new HttpService('http://54.82.56.30:8080/api');
const containerService = new ContainerService(httpService);

export const services = {
  container: containerService
}