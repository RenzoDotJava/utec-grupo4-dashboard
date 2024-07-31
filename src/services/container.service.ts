import { Container } from "@/interfaces/container.interface";
import { HttpService } from "./http.service";

export class ContainerService {
  private httpService: HttpService;

  constructor(httpService: HttpService) {
    this.httpService = httpService;
  }

  async getContainers(): Promise<Container[]> {
    return this.httpService.get({
      url: '/container'
    })
  }

  async getContainerByRowId(rowId: number): Promise<Container> {
    return this.httpService.get({
      url: `/container/${rowId}`
    })
  }
}